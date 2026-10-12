package br.com.payleech.service;

import br.com.payleech.entity.Categoria;
import br.com.payleech.exception.ResourceNotFoundException;
import br.com.payleech.repository.CategoriaRepository;
import br.com.payleech.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final UsuarioRepository usuarioRepository;

    public CategoriaService(CategoriaRepository categoriaRepository, UsuarioRepository usuarioRepository) {
        this.categoriaRepository = categoriaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Categoria criar(Categoria categoria, Long usuarioId) {
        categoria.setUsuario(usuarioRepository.getReferenceById(usuarioId));
        return categoriaRepository.save(categoria);
    }

    @Transactional(readOnly = true)
    public List<Categoria> listar(Long usuarioId) {
        return categoriaRepository.findAllByUsuario_Id(usuarioId);
    }

    @Transactional(readOnly = true)
    public Categoria buscarPorId(Long id, Long usuarioId) {
        return categoriaRepository.findByIdAndUsuario_Id(id, usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Categoria não encontrada com ID: " + id));
    }

    public Categoria atualizar(Long id, Categoria dadosAtualizados, Long usuarioId) {
        Categoria categoriaExistente = buscarPorId(id, usuarioId);

        categoriaExistente.setNome(dadosAtualizados.getNome());
        categoriaExistente.setDescricao(dadosAtualizados.getDescricao());

        return categoriaRepository.save(categoriaExistente);
    }

    public void excluir(Long id, Long usuarioId) {
        Categoria categoria = buscarPorId(id, usuarioId);
        categoriaRepository.delete(categoria);
    }
}
