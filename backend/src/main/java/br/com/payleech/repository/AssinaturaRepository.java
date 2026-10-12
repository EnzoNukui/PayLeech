package br.com.payleech.repository;

import br.com.payleech.entity.Assinatura;
import br.com.payleech.enums.StatusAssinatura;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssinaturaRepository extends JpaRepository<Assinatura, Long> {

    List<Assinatura> findAllByCategoria_Usuario_Id(Long usuarioId);

    List<Assinatura> findByStatusAssinaturaAndCategoria_Usuario_Id(
            StatusAssinatura statusAssinatura, Long usuarioId);

    List<Assinatura> findByCategoria_IdAndCategoria_Usuario_Id(Long categoriaId, Long usuarioId);

    List<Assinatura> findByStatusAssinaturaAndCategoria_IdAndCategoria_Usuario_Id(
            StatusAssinatura statusAssinatura, Long categoriaId, Long usuarioId);

    Optional<Assinatura> findByCodigoAndCategoria_Usuario_Id(Long codigo, Long usuarioId);
}
