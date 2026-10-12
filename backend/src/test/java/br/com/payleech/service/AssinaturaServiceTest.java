package br.com.payleech.service;

import br.com.payleech.dto.ProximaCobrancaResponse;
import br.com.payleech.dto.ResumoFinanceiroResponse;
import br.com.payleech.entity.Assinatura;
import br.com.payleech.entity.Categoria;
import br.com.payleech.enums.Periodicidade;
import br.com.payleech.enums.StatusAssinatura;
import br.com.payleech.exception.ResourceNotFoundException;
import br.com.payleech.repository.AssinaturaRepository;
import br.com.payleech.repository.CategoriaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AssinaturaServiceTest {

    private static final Long USUARIO_ID = 10L;

    private static final LocalDate HOJE_TESTE = LocalDate.of(2026, 10, 11);
    private static final Clock CLOCK_TESTE = Clock.fixed(
            HOJE_TESTE.atStartOfDay().toInstant(ZoneOffset.UTC),
            ZoneOffset.UTC);

    private AssinaturaRepository assinaturaRepository;
    private CategoriaRepository categoriaRepository;
    private CobrancaService cobrancaService;
    private AssinaturaService assinaturaService;

    @BeforeEach
    void configurar() {
        assinaturaRepository = mock(AssinaturaRepository.class);
        categoriaRepository = mock(CategoriaRepository.class);
        cobrancaService = mock(CobrancaService.class);
        assinaturaService = new AssinaturaService(assinaturaRepository, categoriaRepository, cobrancaService, CLOCK_TESTE);
    }

    @Test
    void criarDeveAssociarCategoriaExistenteESalvarAssinatura() {
        Categoria categoria = new Categoria(7L, "Entretenimento", null);
        Assinatura assinatura = assinatura(1L, "Streaming", "39.90", Periodicidade.MENSAL,
                LocalDate.now(), StatusAssinatura.ATIVA, new Categoria(7L, null, null));
        when(categoriaRepository.findByIdAndUsuario_Id(7L, USUARIO_ID)).thenReturn(Optional.of(categoria));
        when(assinaturaRepository.save(assinatura)).thenReturn(assinatura);

        Assinatura resultado = assinaturaService.criar(assinatura, USUARIO_ID);

        assertSame(assinatura, resultado);
        assertSame(categoria, assinatura.getCategoria());
        verify(assinaturaRepository).save(assinatura);
    }

    @Test
    void criarDeveLancarExcecaoQuandoCategoriaNaoExiste() {
        Assinatura assinatura = assinatura(null, "Streaming", "39.90", Periodicidade.MENSAL,
                LocalDate.now(), StatusAssinatura.ATIVA, new Categoria(77L, null, null));
        when(categoriaRepository.findByIdAndUsuario_Id(77L, USUARIO_ID)).thenReturn(Optional.empty());

        ResourceNotFoundException excecao = assertThrows(
                ResourceNotFoundException.class,
                () -> assinaturaService.criar(assinatura, USUARIO_ID));

        assertEquals("Categoria não encontrada com ID: 77", excecao.getMessage());
    }

    @Test
    void listarSemFiltrosDeveRetornarTodasAsAssinaturas() {
        List<Assinatura> assinaturas = List.of(assinatura(1L, "Streaming", "39.90",
                Periodicidade.MENSAL, LocalDate.now(), StatusAssinatura.ATIVA,
                new Categoria(7L, "Entretenimento", null)));
        when(assinaturaRepository.findAllByCategoria_Usuario_Id(USUARIO_ID)).thenReturn(assinaturas);

        List<Assinatura> resultado = assinaturaService.listar(null, null, USUARIO_ID);

        assertSame(assinaturas, resultado);
        verify(assinaturaRepository).findAllByCategoria_Usuario_Id(USUARIO_ID);
    }

    @Test
    void listarComStatusDeveFiltrarPorStatus() {
        List<Assinatura> assinaturas = List.of(assinatura(1L, "Streaming", "39.90",
                Periodicidade.MENSAL, LocalDate.now(), StatusAssinatura.ATIVA,
                new Categoria(7L, "Entretenimento", null)));
        when(assinaturaRepository.findByStatusAssinaturaAndCategoria_Usuario_Id(StatusAssinatura.ATIVA, USUARIO_ID))
                .thenReturn(assinaturas);

        List<Assinatura> resultado = assinaturaService.listar(StatusAssinatura.ATIVA, null, USUARIO_ID);

        assertSame(assinaturas, resultado);
        verify(assinaturaRepository).findByStatusAssinaturaAndCategoria_Usuario_Id(StatusAssinatura.ATIVA, USUARIO_ID);
    }

    @Test
    void listarComCategoriaDeveFiltrarPorCategoria() {
        List<Assinatura> assinaturas = List.of(assinatura(1L, "Streaming", "39.90",
                Periodicidade.MENSAL, LocalDate.now(), StatusAssinatura.ATIVA,
                new Categoria(7L, "Entretenimento", null)));
        when(assinaturaRepository.findByCategoria_IdAndCategoria_Usuario_Id(7L, USUARIO_ID)).thenReturn(assinaturas);

        List<Assinatura> resultado = assinaturaService.listar(null, 7L, USUARIO_ID);

        assertSame(assinaturas, resultado);
        verify(assinaturaRepository).findByCategoria_IdAndCategoria_Usuario_Id(7L, USUARIO_ID);
    }

    @Test
    void listarComStatusECategoriaDeveAplicarAmbosOsFiltros() {
        List<Assinatura> assinaturas = List.of(assinatura(1L, "Streaming", "39.90",
                Periodicidade.MENSAL, LocalDate.now(), StatusAssinatura.ATIVA,
                new Categoria(7L, "Entretenimento", null)));
        when(assinaturaRepository.findByStatusAssinaturaAndCategoria_IdAndCategoria_Usuario_Id(
                StatusAssinatura.ATIVA, 7L, USUARIO_ID)).thenReturn(assinaturas);

        List<Assinatura> resultado = assinaturaService.listar(StatusAssinatura.ATIVA, 7L, USUARIO_ID);

        assertSame(assinaturas, resultado);
        verify(assinaturaRepository).findByStatusAssinaturaAndCategoria_IdAndCategoria_Usuario_Id(
                StatusAssinatura.ATIVA, 7L, USUARIO_ID);
    }

    @Test
    void buscarPorIdDeveRetornarAssinaturaExistente() {
        Assinatura assinatura = assinatura(4L, "Streaming", "39.90", Periodicidade.MENSAL,
                LocalDate.now(), StatusAssinatura.ATIVA, new Categoria(7L, "Entretenimento", null));
        when(assinaturaRepository.findByCodigoAndCategoria_Usuario_Id(4L, USUARIO_ID))
                .thenReturn(Optional.of(assinatura));

        assertSame(assinatura, assinaturaService.buscarPorId(4L, USUARIO_ID));
    }

    @Test
    void buscarPorIdDeveLancarExcecaoQuandoAssinaturaNaoExiste() {
        when(assinaturaRepository.findByCodigoAndCategoria_Usuario_Id(99L, USUARIO_ID))
                .thenReturn(Optional.empty());

        ResourceNotFoundException excecao = assertThrows(
                ResourceNotFoundException.class,
                () -> assinaturaService.buscarPorId(99L, USUARIO_ID));

        assertEquals("Assinatura não encontrada com ID: 99", excecao.getMessage());
    }

    @Test
    void atualizarDeveSubstituirDadosEAssociarCategoriaExistente() {
        Categoria categoriaAtualizada = new Categoria(8L, "Produtividade", null);
        Assinatura existente = assinatura(4L, "Streaming", "39.90", Periodicidade.MENSAL,
                LocalDate.now(), StatusAssinatura.ATIVA, new Categoria(7L, "Entretenimento", null));
        Assinatura novosDados = assinatura(null, "Software", "120.00", Periodicidade.ANUAL,
                LocalDate.now().plusDays(2), StatusAssinatura.PAUSADA,
                new Categoria(8L, null, null));
        when(assinaturaRepository.findByCodigoAndCategoria_Usuario_Id(4L, USUARIO_ID))
                .thenReturn(Optional.of(existente));
        when(categoriaRepository.findByIdAndUsuario_Id(8L, USUARIO_ID)).thenReturn(Optional.of(categoriaAtualizada));
        when(assinaturaRepository.save(existente)).thenReturn(existente);

        Assinatura resultado = assinaturaService.atualizar(4L, novosDados, USUARIO_ID);

        assertSame(existente, resultado);
        assertEquals("Software", existente.getNome());
        assertEquals(new BigDecimal("120.00"), existente.getValor());
        assertEquals(Periodicidade.ANUAL, existente.getPeriodicidade());
        assertEquals(StatusAssinatura.PAUSADA, existente.getStatusAssinatura());
        assertSame(categoriaAtualizada, existente.getCategoria());
        verify(assinaturaRepository).save(existente);
    }

    @Test
    void excluirDeveBuscarEExcluirAssinaturaExistente() {
        Assinatura existente = assinatura(4L, "Streaming", "39.90", Periodicidade.MENSAL,
                LocalDate.now(), StatusAssinatura.ATIVA, new Categoria(7L, "Entretenimento", null));
        when(assinaturaRepository.findByCodigoAndCategoria_Usuario_Id(4L, USUARIO_ID))
                .thenReturn(Optional.of(existente));

        assinaturaService.excluir(4L, USUARIO_ID);

        verify(assinaturaRepository).delete(existente);
    }

    @Test
    void gerarResumoDeveConsiderarSomenteAssinaturasAtivasEConverterPeriodicidades() {
        List<Assinatura> ativas = List.of(
                assinatura(1L, "Mensal", "10.00", Periodicidade.MENSAL,
                        LocalDate.now(), StatusAssinatura.ATIVA, new Categoria(1L, "A", null)),
                assinatura(2L, "Trimestral", "30.00", Periodicidade.TRIMESTRAL,
                        LocalDate.now(), StatusAssinatura.ATIVA, new Categoria(1L, "A", null)),
                assinatura(3L, "Anual", "120.00", Periodicidade.ANUAL,
                        LocalDate.now(), StatusAssinatura.ATIVA, new Categoria(1L, "A", null)));
        when(assinaturaRepository.findByStatusAssinaturaAndCategoria_Usuario_Id(StatusAssinatura.ATIVA, USUARIO_ID))
                .thenReturn(ativas);

        ResumoFinanceiroResponse resultado = assinaturaService.gerarResumoFinanceiro(USUARIO_ID);

        assertEquals(new BigDecimal("30.00"), resultado.getCustoMensalEquivalente());
        assertEquals(new BigDecimal("360.00"), resultado.getCustoAnualEstimado());
        assertEquals(3L, resultado.getQuantidadeAssinaturasAtivas());
        verify(assinaturaRepository).findByStatusAssinaturaAndCategoria_Usuario_Id(StatusAssinatura.ATIVA, USUARIO_ID);
    }

    @Test
    void gerarResumoSemAssinaturasAtivasDeveRetornarZeros() {
        when(assinaturaRepository.findByStatusAssinaturaAndCategoria_Usuario_Id(StatusAssinatura.ATIVA, USUARIO_ID))
                .thenReturn(List.of());

        ResumoFinanceiroResponse resultado = assinaturaService.gerarResumoFinanceiro(USUARIO_ID);

        assertEquals(new BigDecimal("0.00"), resultado.getCustoMensalEquivalente());
        assertEquals(new BigDecimal("0.00"), resultado.getCustoAnualEstimado());
        assertEquals(0L, resultado.getQuantidadeAssinaturasAtivas());
    }

    @Test
    void gerarResumoDevePreservarPrecisaoNoCustoAnualEstimado() {
        List<Assinatura> ativas = List.of(assinatura(
                1L, "Anual", "10.00", Periodicidade.ANUAL,
                HOJE_TESTE, StatusAssinatura.ATIVA, new Categoria(1L, "A", null)));
        when(assinaturaRepository.findByStatusAssinaturaAndCategoria_Usuario_Id(StatusAssinatura.ATIVA, USUARIO_ID))
                .thenReturn(ativas);

        ResumoFinanceiroResponse resultado = assinaturaService.gerarResumoFinanceiro(USUARIO_ID);

        assertEquals(new BigDecimal("0.83"), resultado.getCustoMensalEquivalente());
        assertEquals(new BigDecimal("10.00"), resultado.getCustoAnualEstimado());
    }

    @Test
    void listarProximasCobrancasDeveOrdenarEIncluirHoje() {
        LocalDate hoje = HOJE_TESTE;
        Categoria categoria = new Categoria(1L, "Entretenimento", null);
        Assinatura comCobrancaFutura = assinatura(2L, "Futura", "20.00", Periodicidade.TRIMESTRAL,
                hoje.plusDays(3), StatusAssinatura.ATIVA, categoria);
        Assinatura comCobrancaHoje = assinatura(1L, "Hoje", "10.00", Periodicidade.MENSAL,
                hoje, StatusAssinatura.ATIVA, categoria);
        when(assinaturaRepository.findByStatusAssinaturaAndCategoria_Usuario_Id(StatusAssinatura.ATIVA, USUARIO_ID))
                .thenReturn(List.of(comCobrancaFutura, comCobrancaHoje));

        List<ProximaCobrancaResponse> resultado = assinaturaService.listarProximasCobrancas(USUARIO_ID);

        assertEquals(2, resultado.size());
        assertEquals("Hoje", resultado.get(0).getNomeAssinatura());
        assertEquals(hoje, resultado.get(0).getDataProximaCobranca());
        assertEquals("Futura", resultado.get(1).getNomeAssinatura());
        assertEquals(hoje.plusDays(3), resultado.get(1).getDataProximaCobranca());
        verify(assinaturaRepository).findByStatusAssinaturaAndCategoria_Usuario_Id(StatusAssinatura.ATIVA, USUARIO_ID);
    }

    @Test
    void listarProximasCobrancasDevePreservarDiaOriginalAposMesCurto() {
        Categoria categoria = new Categoria(1L, "Entretenimento", null);
        Assinatura assinatura = assinatura(1L, "Mensal", "10.00", Periodicidade.MENSAL,
                LocalDate.of(2026, 8, 31), StatusAssinatura.ATIVA, categoria);
        when(assinaturaRepository.findByStatusAssinaturaAndCategoria_Usuario_Id(StatusAssinatura.ATIVA, USUARIO_ID))
                .thenReturn(List.of(assinatura));

        List<ProximaCobrancaResponse> resultado = assinaturaService.listarProximasCobrancas(USUARIO_ID);

        assertEquals(LocalDate.of(2026, 10, 31), resultado.get(0).getDataProximaCobranca());
    }

    @Test
    void listarProximasCobrancasDeveAjustarAnoBissextoEmAnoNaoBissexto() {
        Categoria categoria = new Categoria(1L, "Entretenimento", null);
        Assinatura assinatura = assinatura(1L, "Anual", "120.00", Periodicidade.ANUAL,
                LocalDate.of(2024, 2, 29), StatusAssinatura.ATIVA, categoria);
        when(assinaturaRepository.findByStatusAssinaturaAndCategoria_Usuario_Id(StatusAssinatura.ATIVA, USUARIO_ID))
                .thenReturn(List.of(assinatura));

        List<ProximaCobrancaResponse> resultado = assinaturaService.listarProximasCobrancas(USUARIO_ID);

        assertEquals(LocalDate.of(2027, 2, 28), resultado.get(0).getDataProximaCobranca());
    }

    private Assinatura assinatura(Long id, String nome, String valor,
                                  Periodicidade periodicidade, LocalDate dataPrimeiraCobranca,
                                  StatusAssinatura status, Categoria categoria) {
        return new Assinatura(id, nome, new BigDecimal(valor), periodicidade,
                dataPrimeiraCobranca, status, categoria);
    }
}
