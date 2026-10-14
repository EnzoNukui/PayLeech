package br.com.payleech.service;

import br.com.payleech.entity.Assinatura;
import br.com.payleech.entity.Cobranca;
import br.com.payleech.entity.Usuario;
import br.com.payleech.enums.StatusAssinatura;
import br.com.payleech.enums.StatusCobranca;
import br.com.payleech.exception.ResourceNotFoundException;
import br.com.payleech.repository.AssinaturaRepository;
import br.com.payleech.repository.CobrancaRepository;
import br.com.payleech.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class CobrancaService {

    private final CobrancaRepository cobrancaRepository;
    private final AssinaturaRepository assinaturaRepository;
    private final UsuarioRepository usuarioRepository;
    private final Clock clock;

    @Autowired
    public CobrancaService(CobrancaRepository cobrancaRepository,
                           AssinaturaRepository assinaturaRepository,
                           UsuarioRepository usuarioRepository) {
        this(cobrancaRepository, assinaturaRepository, usuarioRepository, Clock.systemDefaultZone());
    }

    CobrancaService(CobrancaRepository cobrancaRepository,
                    AssinaturaRepository assinaturaRepository,
                    UsuarioRepository usuarioRepository,
                    Clock clock) {
        this.cobrancaRepository = cobrancaRepository;
        this.assinaturaRepository = assinaturaRepository;
        this.usuarioRepository = usuarioRepository;
        this.clock = clock;
    }

    public void sincronizarPrevisao(Assinatura assinatura, Long usuarioId, LocalDate dataPrevista) {
        List<Cobranca> previsoes = cobrancaRepository.findAllByAssinatura_CodigoAndStatusOrderByDataPrevistaAsc(
                assinatura.getCodigo(), StatusCobranca.PREVISTA);

        if (assinatura.getStatusAssinatura() != StatusAssinatura.ATIVA) {
            previsoes.forEach(previsao -> previsao.setStatus(StatusCobranca.CANCELADA));
            cobrancaRepository.saveAll(previsoes);
            return;
        }

        Cobranca previsaoPrincipal;
        if (previsoes.isEmpty()) {
            previsaoPrincipal = new Cobranca();
            previsaoPrincipal.setAssinatura(assinatura);
            previsaoPrincipal.setUsuario(usuarioRepository.getReferenceById(usuarioId));
            previsaoPrincipal.setStatus(StatusCobranca.PREVISTA);
        } else {
            previsaoPrincipal = previsoes.getFirst();
            previsoes.stream().skip(1)
                    .forEach(previsao -> previsao.setStatus(StatusCobranca.CANCELADA));
            cobrancaRepository.saveAll(previsoes);
        }

        atualizarDadosDaPrevisao(previsaoPrincipal, assinatura, dataPrevista);
        cobrancaRepository.save(previsaoPrincipal);
    }

    public Cobranca confirmarPagamento(Long cobrancaId, Long usuarioId, BigDecimal valorPago, LocalDate dataPagamento) {
        Cobranca cobranca = buscarPorId(cobrancaId, usuarioId);
        if (cobranca.getStatus() != StatusCobranca.PREVISTA) {
            throw new IllegalArgumentException("Somente uma cobrança prevista pode ser confirmada como paga.");
        }

        cobranca.setStatus(StatusCobranca.PAGA);
        cobranca.setValorPago(valorPago == null ? cobranca.getValorPrevisto() : valorPago);
        cobranca.setDataPagamento(dataPagamento == null ? LocalDate.now(clock) : dataPagamento);
        cobrancaRepository.save(cobranca);

        Assinatura assinatura = cobranca.getAssinatura();
        if (assinatura != null && assinatura.getStatusAssinatura() == StatusAssinatura.ATIVA) {
            LocalDate dataSeguinte = RecorrenciaCobranca.dataSeguinte(assinatura, cobranca.getDataPrevista());
            sincronizarPrevisao(assinatura, usuarioId, dataSeguinte);
        }

        return cobranca;
    }

    // Materialize billing history from the first date entered; an overdue billing is assumed paid on its due date.
    public List<Cobranca> listar(Long usuarioId, StatusCobranca status) {
        atualizarCobrancasAutomaticamente(usuarioId);

        if (status == null) {
            return cobrancaRepository.findAllByUsuario_IdOrderByDataPrevistaAsc(usuarioId);
        }
        return cobrancaRepository.findAllByUsuario_IdAndStatusOrderByDataPrevistaAsc(usuarioId, status);
    }

    @Transactional(readOnly = true)
    public Cobranca buscarPorId(Long id, Long usuarioId) {
        return cobrancaRepository.findByIdAndUsuario_Id(id, usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Cobrança não encontrada com ID: " + id));
    }

    public void desvincularDaAssinatura(Long assinaturaId) {
        List<Cobranca> cobrancas = cobrancaRepository.findAllByAssinatura_Codigo(assinaturaId);
        cobrancas.forEach(cobranca -> {
            if (cobranca.getStatus() == StatusCobranca.PREVISTA) {
                cobranca.setStatus(StatusCobranca.CANCELADA);
            }
            cobranca.setAssinatura(null);
        });
        cobrancaRepository.saveAll(cobrancas);
    }

    public void excluirHistoricoDaAssinatura(Long assinaturaId) {
        cobrancaRepository.deleteByAssinatura_Codigo(assinaturaId);
    }

    public void reconciliarCobrancaDoCicloAtual(Assinatura assinatura, Long usuarioId) {
        LocalDate hoje = LocalDate.now(clock);
        LocalDate dataDoCicloAtual = RecorrenciaCobranca.ultimaDataAte(assinatura, hoje);
        if (dataDoCicloAtual == null) {
            return;
        }

        long cicloAtual = RecorrenciaCobranca.indiceDoCiclo(assinatura, dataDoCicloAtual);
        List<Cobranca> cobrancasDoCiclo = cobrancaRepository.findAllByAssinatura_Codigo(assinatura.getCodigo())
                .stream()
                .filter(cobranca -> RecorrenciaCobranca.indiceDoCiclo(assinatura, cobranca.getDataPrevista()) == cicloAtual)
                .toList();

        Cobranca cobrancaPrincipal = cobrancasDoCiclo.stream()
                .filter(cobranca -> cobranca.getStatus() != StatusCobranca.CANCELADA)
                .filter(cobranca -> cobranca.getDataPrevista().equals(dataDoCicloAtual))
                .findFirst()
                .orElseGet(() -> cobrancasDoCiclo.stream()
                        .filter(cobranca -> cobranca.getStatus() != StatusCobranca.CANCELADA)
                        .min(Comparator.comparingLong(cobranca -> Math.abs(
                                cobranca.getDataPrevista().toEpochDay() - dataDoCicloAtual.toEpochDay())))
                        .orElseGet(() -> criarCobrancaPaga(assinatura, usuarioId, dataDoCicloAtual)));

        cobrancaPrincipal.setAssinatura(assinatura);
        cobrancaPrincipal.setUsuario(usuarioRepository.getReferenceById(usuarioId));
        cobrancaPrincipal.setNomeAssinatura(assinatura.getNome());
        cobrancaPrincipal.setCategoriaNome(assinatura.getCategoria().getNome());
        cobrancaPrincipal.setDataPrevista(dataDoCicloAtual);
        cobrancaPrincipal.setValorPrevisto(assinatura.getValor());
        cobrancaPrincipal.setDataPagamento(dataDoCicloAtual);
        cobrancaPrincipal.setValorPago(assinatura.getValor());
        cobrancaPrincipal.setStatus(StatusCobranca.PAGA);
        cobrancaRepository.save(cobrancaPrincipal);

        cobrancasDoCiclo.stream()
                .filter(cobranca -> !cobranca.getId().equals(cobrancaPrincipal.getId()))
                .forEach(cobrancaRepository::delete);
    }

    private void atualizarDadosDaPrevisao(Cobranca cobranca, Assinatura assinatura, LocalDate dataPrevista) {
        cobranca.setAssinatura(assinatura);
        cobranca.setNomeAssinatura(assinatura.getNome());
        cobranca.setCategoriaNome(assinatura.getCategoria().getNome());
        cobranca.setDataPrevista(dataPrevista);
        cobranca.setValorPrevisto(assinatura.getValor());
        cobranca.setDataPagamento(null);
        cobranca.setValorPago(null);
        cobranca.setStatus(StatusCobranca.PREVISTA);
    }

    private void atualizarCobrancasAutomaticamente(Long usuarioId) {
        LocalDate hoje = LocalDate.now(clock);
        List<Assinatura> assinaturasAtivas = assinaturaRepository.findByStatusAssinaturaAndCategoria_Usuario_Id(
                StatusAssinatura.ATIVA, usuarioId);

        for (Assinatura assinatura : assinaturasAtivas) {
            List<Cobranca> previsoes = cobrancaRepository
                    .findAllByAssinatura_CodigoAndStatusOrderByDataPrevistaAsc(
                            assinatura.getCodigo(), StatusCobranca.PREVISTA);
            if (previsoes.isEmpty()) {
                sincronizarPrevisao(
                        assinatura,
                        usuarioId,
                        assinatura.getDataPrimeiraCobranca());
                previsoes = cobrancaRepository.findAllByAssinatura_CodigoAndStatusOrderByDataPrevistaAsc(
                        assinatura.getCodigo(), StatusCobranca.PREVISTA);
            }

            while (!previsoes.isEmpty() && !previsoes.getFirst().getDataPrevista().isAfter(hoje)) {
                Cobranca vencida = previsoes.getFirst();
                vencida.setStatus(StatusCobranca.PAGA);
                vencida.setDataPagamento(vencida.getDataPrevista());
                vencida.setValorPago(vencida.getValorPrevisto());
                cobrancaRepository.save(vencida);

                LocalDate dataSeguinte = RecorrenciaCobranca.dataSeguinte(assinatura, vencida.getDataPrevista());
                sincronizarPrevisao(assinatura, usuarioId, dataSeguinte);
                previsoes = cobrancaRepository.findAllByAssinatura_CodigoAndStatusOrderByDataPrevistaAsc(
                        assinatura.getCodigo(), StatusCobranca.PREVISTA);
            }

            materializarHistoricoVencidoAusente(assinatura, usuarioId, hoje);
        }
    }

    private void materializarHistoricoVencidoAusente(Assinatura assinatura, Long usuarioId, LocalDate hoje) {
        List<Cobranca> cobrancasExistentes = cobrancaRepository.findAllByAssinatura_Codigo(assinatura.getCodigo());
        Set<Long> ciclosRegistrados = new HashSet<>();
        cobrancasExistentes.stream()
                .filter(cobranca -> cobranca.getStatus() != StatusCobranca.CANCELADA)
                .forEach(cobranca -> ciclosRegistrados.add(
                        RecorrenciaCobranca.indiceDoCiclo(assinatura, cobranca.getDataPrevista())));

        LocalDate dataPrevista = assinatura.getDataPrimeiraCobranca();
        while (!dataPrevista.isAfter(hoje)) {
            long ciclo = RecorrenciaCobranca.indiceDoCiclo(assinatura, dataPrevista);
            if (ciclosRegistrados.add(ciclo)) {
                Cobranca vencida = new Cobranca();
                vencida.setAssinatura(assinatura);
                vencida.setUsuario(usuarioRepository.getReferenceById(usuarioId));
                vencida.setNomeAssinatura(assinatura.getNome());
                vencida.setCategoriaNome(assinatura.getCategoria().getNome());
                vencida.setDataPrevista(dataPrevista);
                vencida.setValorPrevisto(assinatura.getValor());
                vencida.setDataPagamento(dataPrevista);
                vencida.setValorPago(assinatura.getValor());
                vencida.setStatus(StatusCobranca.PAGA);
                cobrancaRepository.save(vencida);
            }

            dataPrevista = RecorrenciaCobranca.dataSeguinte(assinatura, dataPrevista);
        }
    }

    private Cobranca criarCobrancaPaga(Assinatura assinatura, Long usuarioId, LocalDate dataCobranca) {
        Cobranca cobranca = new Cobranca();
        cobranca.setAssinatura(assinatura);
        cobranca.setUsuario(usuarioRepository.getReferenceById(usuarioId));
        cobranca.setNomeAssinatura(assinatura.getNome());
        cobranca.setCategoriaNome(assinatura.getCategoria().getNome());
        cobranca.setDataPrevista(dataCobranca);
        cobranca.setValorPrevisto(assinatura.getValor());
        cobranca.setDataPagamento(dataCobranca);
        cobranca.setValorPago(assinatura.getValor());
        cobranca.setStatus(StatusCobranca.PAGA);
        return cobranca;
    }
}
