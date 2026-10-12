package br.com.payleech.repository;

import br.com.payleech.entity.Cobranca;
import br.com.payleech.enums.StatusCobranca;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CobrancaRepository extends JpaRepository<Cobranca, Long> {

    @EntityGraph(attributePaths = "assinatura")
    List<Cobranca> findAllByUsuario_IdOrderByDataPrevistaAsc(Long usuarioId);

    @EntityGraph(attributePaths = "assinatura")
    List<Cobranca> findAllByUsuario_IdAndStatusOrderByDataPrevistaAsc(
            Long usuarioId, StatusCobranca status);

    List<Cobranca> findAllByAssinatura_CodigoAndStatusOrderByDataPrevistaAsc(
            Long assinaturaId, StatusCobranca status);

    List<Cobranca> findAllByAssinatura_Codigo(Long assinaturaId);

    @EntityGraph(attributePaths = "assinatura")
    Optional<Cobranca> findByIdAndUsuario_Id(Long id, Long usuarioId);
}
