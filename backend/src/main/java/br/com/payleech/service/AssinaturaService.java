package br.com.payleech.service;

import br.com.payleech.dto.ResumoFinanceiroResponse;
import br.com.payleech.dto.ProximaCobrancaResponse;
import br.com.payleech.entity.Assinatura;
import br.com.payleech.entity.Categoria;
import br.com.payleech.enums.StatusAssinatura;
import br.com.payleech.exception.ResourceNotFoundException;
import br.com.payleech.repository.AssinaturaRepository;
import br.com.payleech.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Clock;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional
public class AssinaturaService {

    private final AssinaturaRepository assinaturaRepository;
    private final CategoriaRepository categoriaRepository;
    private final CobrancaService cobrancaService;
    private final Clock clock;

    @Autowired
    public AssinaturaService(AssinaturaRepository assinaturaRepository,
                             CategoriaRepository categoriaRepository,
                             CobrancaService cobrancaService) {
        this(assinaturaRepository, categoriaRepository, cobrancaService, Clock.systemDefaultZone());
    }

    AssinaturaService(AssinaturaRepository assinaturaRepository,
                      CategoriaRepository categoriaRepository,
                      CobrancaService cobrancaService,
                      Clock clock) {
        this.assinaturaRepository = assinaturaRepository;
        this.categoriaRepository = categoriaRepository;
        this.cobrancaService = cobrancaService;
        this.clock = clock;
    }

    public Assinatura criar(Assinatura assinatura, Long usuarioId) {
        assinatura.setCategoria(buscarCategoriaInformada(assinatura, usuarioId));
        Assinatura assinaturaCriada = assinaturaRepository.save(assinatura);
        cobrancaService.sincronizarPrevisao(
                assinaturaCriada,
                usuarioId,
                RecorrenciaCobranca.proximaData(assinaturaCriada, LocalDate.now(clock)));
        return assinaturaCriada;
    }

    @Transactional(readOnly = true)
    public List<Assinatura> listar(Long usuarioId) {
        return assinaturaRepository.findAllByCategoria_Usuario_Id(usuarioId);
    }

    @Transactional(readOnly = true)
    public List<Assinatura> listar(StatusAssinatura statusAssinatura, Long categoriaId, Long usuarioId) {
        if (statusAssinatura != null && categoriaId != null) {
            return assinaturaRepository.findByStatusAssinaturaAndCategoria_IdAndCategoria_Usuario_Id(
                    statusAssinatura,
                    categoriaId,
                    usuarioId);
        }

        if (statusAssinatura != null) {
            return assinaturaRepository.findByStatusAssinaturaAndCategoria_Usuario_Id(statusAssinatura, usuarioId);
        }

        if (categoriaId != null) {
            return assinaturaRepository.findByCategoria_IdAndCategoria_Usuario_Id(categoriaId, usuarioId);
        }

        return listar(usuarioId);
    }

    @Transactional(readOnly = true)
    public ResumoFinanceiroResponse gerarResumoFinanceiro(Long usuarioId) {
        List<Assinatura> assinaturasAtivas = assinaturaRepository.findByStatusAssinaturaAndCategoria_Usuario_Id(
                StatusAssinatura.ATIVA, usuarioId);

        BigDecimal custoMensalSemArredondamento = assinaturasAtivas.stream()
                .map(AssinaturaService::calcularCustoMensalEquivalente)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal custoMensal = custoMensalSemArredondamento.setScale(2, RoundingMode.HALF_UP);
        BigDecimal custoAnual = custoMensalSemArredondamento
                .multiply(BigDecimal.valueOf(12))
                .setScale(2, RoundingMode.HALF_UP);

        return new ResumoFinanceiroResponse(custoMensal, custoAnual, assinaturasAtivas.size());
    }

    @Transactional(readOnly = true)
    public List<ProximaCobrancaResponse> listarProximasCobrancas(Long usuarioId) {
        LocalDate hoje = LocalDate.now(clock);

        return assinaturaRepository.findByStatusAssinaturaAndCategoria_Usuario_Id(StatusAssinatura.ATIVA, usuarioId)
                .stream()
                .map(assinatura -> new ProximaCobrancaResponse(
                        assinatura.getCodigo(),
                        assinatura.getNome(),
                        assinatura.getValor(),
                        assinatura.getPeriodicidade(),
                        calcularProximaDataCobranca(assinatura, hoje),
                        assinatura.getCategoria().getNome()))
                .sorted(Comparator.comparing(ProximaCobrancaResponse::getDataProximaCobranca)
                        .thenComparing(ProximaCobrancaResponse::getNomeAssinatura))
                .toList();
    }

    @Transactional(readOnly = true)
    public Assinatura buscarPorId(Long id, Long usuarioId) {
        return assinaturaRepository.findByCodigoAndCategoria_Usuario_Id(id, usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Assinatura não encontrada com ID: " + id));
    }

    public Assinatura atualizar(Long id, Assinatura dadosAtualizados, Long usuarioId) {
        Assinatura assinaturaExistente = buscarPorId(id, usuarioId);

        assinaturaExistente.setNome(dadosAtualizados.getNome());
        assinaturaExistente.setValor(dadosAtualizados.getValor());
        assinaturaExistente.setPeriodicidade(dadosAtualizados.getPeriodicidade());
        assinaturaExistente.setDataPrimeiraCobranca(dadosAtualizados.getDataPrimeiraCobranca());
        assinaturaExistente.setStatusAssinatura(dadosAtualizados.getStatusAssinatura());
        assinaturaExistente.setIcone(dadosAtualizados.getIcone());
        assinaturaExistente.setCategoria(buscarCategoriaInformada(dadosAtualizados, usuarioId));

        Assinatura assinaturaAtualizada = assinaturaRepository.save(assinaturaExistente);
        cobrancaService.sincronizarPrevisao(
                assinaturaAtualizada,
                usuarioId,
                RecorrenciaCobranca.proximaData(assinaturaAtualizada, LocalDate.now(clock)));
        return assinaturaAtualizada;
    }

    public void excluir(Long id, Long usuarioId) {
        Assinatura assinatura = buscarPorId(id, usuarioId);
        cobrancaService.desvincularDaAssinatura(id);
        assinaturaRepository.delete(assinatura);
    }

    private Categoria buscarCategoria(Long categoriaId, Long usuarioId) {
        if (categoriaId == null) {
            throw new IllegalArgumentException("O ID da categoria é obrigatório.");
        }

        return categoriaRepository.findByIdAndUsuario_Id(categoriaId, usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Categoria não encontrada com ID: " + categoriaId));
    }

    private Categoria buscarCategoriaInformada(Assinatura assinatura, Long usuarioId) {
        if (assinatura.getCategoria() == null) {
            throw new IllegalArgumentException("A categoria da assinatura é obrigatória.");
        }

        return buscarCategoria(assinatura.getCategoria().getId(), usuarioId);
    }

    private static BigDecimal calcularCustoMensalEquivalente(Assinatura assinatura) {
        return assinatura.getValor().divide(
                BigDecimal.valueOf(RecorrenciaCobranca.mesesPorCobranca(assinatura.getPeriodicidade())),
                10,
                RoundingMode.HALF_UP);
    }

    private static LocalDate calcularProximaDataCobranca(Assinatura assinatura, LocalDate hoje) {
        return RecorrenciaCobranca.proximaData(assinatura, hoje);
    }
}
