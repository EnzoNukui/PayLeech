package br.com.payleech.service;

import br.com.payleech.entity.Categoria;
import br.com.payleech.entity.Usuario;
import br.com.payleech.exception.ResourceNotFoundException;
import br.com.payleech.repository.CategoriaRepository;
import br.com.payleech.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class CategoriaServiceTest {

    private CategoriaRepository categoriaRepository;
    private UsuarioRepository usuarioRepository;
    private CategoriaService categoriaService;

    @BeforeEach
    void configurar() {
        categoriaRepository = mock(CategoriaRepository.class);
        usuarioRepository = mock(UsuarioRepository.class);
        categoriaService = new CategoriaService(categoriaRepository, usuarioRepository);
    }

    @Test
    void criarDeveSalvarERetornarCategoria() {
        Categoria categoria = new Categoria(null, "Entretenimento", "Streaming e música");
        Usuario usuario = new Usuario(10L, "Enzo", "enzo@example.com", "hash");
        when(usuarioRepository.getReferenceById(10L)).thenReturn(usuario);
        when(categoriaRepository.save(categoria)).thenReturn(categoria);

        Categoria resultado = categoriaService.criar(categoria, 10L);

        assertSame(categoria, resultado);
        assertSame(usuario, categoria.getUsuario());
        verify(categoriaRepository).save(categoria);
    }

    @Test
    void listarDeveRetornarCategoriasDoRepository() {
        List<Categoria> categorias = List.of(
                new Categoria(1L, "Música", null),
                new Categoria(2L, "Jogos", null));
        when(categoriaRepository.findAllByUsuario_Id(10L)).thenReturn(categorias);

        List<Categoria> resultado = categoriaService.listar(10L);

        assertSame(categorias, resultado);
        verify(categoriaRepository).findAllByUsuario_Id(10L);
    }

    @Test
    void buscarPorIdDeveRetornarCategoriaExistente() {
        Categoria categoria = new Categoria(1L, "Música", null);
        when(categoriaRepository.findByIdAndUsuario_Id(1L, 10L)).thenReturn(Optional.of(categoria));

        Categoria resultado = categoriaService.buscarPorId(1L, 10L);

        assertSame(categoria, resultado);
        verify(categoriaRepository).findByIdAndUsuario_Id(1L, 10L);
    }

    @Test
    void buscarPorIdDeveLancarExcecaoQuandoCategoriaNaoExiste() {
        when(categoriaRepository.findByIdAndUsuario_Id(99L, 10L)).thenReturn(Optional.empty());

        ResourceNotFoundException excecao = assertThrows(
                ResourceNotFoundException.class,
                () -> categoriaService.buscarPorId(99L, 10L));

        assertEquals("Categoria não encontrada com ID: 99", excecao.getMessage());
    }

    @Test
    void atualizarDeveAlterarDadosESalvarCategoriaExistente() {
        Categoria existente = new Categoria(1L, "Música", "Descrição antiga");
        Categoria novosDados = new Categoria(null, "Áudio", "Descrição atualizada");
        when(categoriaRepository.findByIdAndUsuario_Id(1L, 10L)).thenReturn(Optional.of(existente));
        when(categoriaRepository.save(existente)).thenReturn(existente);

        Categoria resultado = categoriaService.atualizar(1L, novosDados, 10L);

        assertSame(existente, resultado);
        assertEquals("Áudio", existente.getNome());
        assertEquals("Descrição atualizada", existente.getDescricao());
        verify(categoriaRepository).save(existente);
    }

    @Test
    void excluirDeveBuscarEExcluirCategoriaExistente() {
        Categoria existente = new Categoria(1L, "Música", null);
        when(categoriaRepository.findByIdAndUsuario_Id(1L, 10L)).thenReturn(Optional.of(existente));

        categoriaService.excluir(1L, 10L);

        verify(categoriaRepository).delete(existente);
    }
}
