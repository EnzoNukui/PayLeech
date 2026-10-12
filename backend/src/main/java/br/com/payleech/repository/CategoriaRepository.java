package br.com.payleech.repository;

import br.com.payleech.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    List<Categoria> findAllByUsuario_Id(Long usuarioId);

    Optional<Categoria> findByIdAndUsuario_Id(Long id, Long usuarioId);
}
