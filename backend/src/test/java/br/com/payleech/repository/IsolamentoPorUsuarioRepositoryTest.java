package br.com.payleech.repository;

import br.com.payleech.entity.Assinatura;
import br.com.payleech.entity.Categoria;
import br.com.payleech.entity.Usuario;
import br.com.payleech.enums.Periodicidade;
import br.com.payleech.enums.StatusAssinatura;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
class IsolamentoPorUsuarioRepositoryTest {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private AssinaturaRepository assinaturaRepository;

    private Usuario usuarioA;
    private Usuario usuarioB;
    private Categoria categoriaA;
    private Categoria categoriaB;
    private Assinatura assinaturaAtivaA;
    private Assinatura assinaturaPausadaA;
    private Assinatura assinaturaAtivaB;

    @BeforeEach
    void prepararDadosDeDoisUsuarios() {
        usuarioA = usuarioRepository.saveAndFlush(
                new Usuario(null, "Pessoa A", "pessoa.a@example.com", "hash-a"));
        usuarioB = usuarioRepository.saveAndFlush(
                new Usuario(null, "Pessoa B", "pessoa.b@example.com", "hash-b"));

        categoriaA = categoria("Categoria A", usuarioA);
        categoriaB = categoria("Categoria B", usuarioB);

        assinaturaAtivaA = assinatura("Assinatura ativa A", categoriaA, StatusAssinatura.ATIVA);
        assinaturaPausadaA = assinatura("Assinatura pausada A", categoriaA, StatusAssinatura.PAUSADA);
        assinaturaAtivaB = assinatura("Assinatura ativa B", categoriaB, StatusAssinatura.ATIVA);
    }

    @Test
    void categoriasDevemSerListadasEBuscadasSomentePeloProprietario() {
        List<Categoria> categoriasDaPessoaA = categoriaRepository.findAllByUsuario_Id(usuarioA.getId());

        assertEquals(Set.of(categoriaA.getId()), categoriasDaPessoaA.stream().map(Categoria::getId).collect(java.util.stream.Collectors.toSet()));
        assertTrue(categoriaRepository.findByIdAndUsuario_Id(categoriaB.getId(), usuarioA.getId()).isEmpty());
    }

    @Test
    void assinaturasEConsultasComFiltrosDevemRespeitarProprietarioDaCategoria() {
        List<Assinatura> todasDaPessoaA = assinaturaRepository.findAllByCategoria_Usuario_Id(usuarioA.getId());
        List<Assinatura> ativasDaPessoaA = assinaturaRepository.findByStatusAssinaturaAndCategoria_Usuario_Id(
                StatusAssinatura.ATIVA, usuarioA.getId());
        List<Assinatura> porCategoriaDaPessoaA = assinaturaRepository
                .findByCategoria_IdAndCategoria_Usuario_Id(categoriaA.getId(), usuarioA.getId());
        List<Assinatura> porStatusECategoriaDaPessoaA = assinaturaRepository
                .findByStatusAssinaturaAndCategoria_IdAndCategoria_Usuario_Id(
                        StatusAssinatura.ATIVA, categoriaA.getId(), usuarioA.getId());

        assertEquals(Set.of(assinaturaAtivaA.getCodigo(), assinaturaPausadaA.getCodigo()),
                todasDaPessoaA.stream().map(Assinatura::getCodigo).collect(java.util.stream.Collectors.toSet()));
        assertEquals(Set.of(assinaturaAtivaA.getCodigo()),
                ativasDaPessoaA.stream().map(Assinatura::getCodigo).collect(java.util.stream.Collectors.toSet()));
        assertEquals(2, porCategoriaDaPessoaA.size());
        assertEquals(Set.of(assinaturaAtivaA.getCodigo()),
                porStatusECategoriaDaPessoaA.stream().map(Assinatura::getCodigo).collect(java.util.stream.Collectors.toSet()));
    }

    @Test
    void buscaPorIdDeAssinaturaDeOutroUsuarioDeveRetornarVazio() {
        assertTrue(assinaturaRepository
                .findByCodigoAndCategoria_Usuario_Id(assinaturaAtivaB.getCodigo(), usuarioA.getId())
                .isEmpty());
    }

    private Categoria categoria(String nome, Usuario proprietario) {
        Categoria categoria = new Categoria(null, nome, "Categoria de teste");
        categoria.setUsuario(proprietario);
        return categoriaRepository.saveAndFlush(categoria);
    }

    private Assinatura assinatura(String nome, Categoria categoria, StatusAssinatura status) {
        Assinatura assinatura = new Assinatura(
                null,
                nome,
                new BigDecimal("12.90"),
                Periodicidade.MENSAL,
                LocalDate.of(2026, 10, 11),
                status,
                categoria);
        return assinaturaRepository.saveAndFlush(assinatura);
    }
}
