package br.com.payleech.controller;

import br.com.payleech.dto.AssinaturaRequest;
import br.com.payleech.dto.AssinaturaResponse;
import br.com.payleech.dto.CategoriaResponse;
import br.com.payleech.dto.ProximaCobrancaResponse;
import br.com.payleech.entity.Assinatura;
import br.com.payleech.entity.Categoria;
import br.com.payleech.enums.StatusAssinatura;
import br.com.payleech.service.AssinaturaService;
import br.com.payleech.security.UsuarioDetails;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/assinaturas")
@Tag(name = "Assinaturas", description = "Operações para gerenciar assinaturas recorrentes.")
@SecurityRequirement(name = "sessionCookie")
public class AssinaturaController {

    private final AssinaturaService assinaturaService;

    public AssinaturaController(AssinaturaService assinaturaService) {
        this.assinaturaService = assinaturaService;
    }

    @PostMapping
    @Operation(summary = "Criar assinatura",
            description = "Cadastra uma assinatura associada a uma categoria do usuário autenticado.",
            parameters = @Parameter(name = "X-CSRF-TOKEN", in = ParameterIn.HEADER,
                    description = "Token obtido em GET /auth/csrf.", required = true))
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Assinatura criada."),
            @ApiResponse(responseCode = "400", description = "Dados inválidos."),
            @ApiResponse(responseCode = "404", description = "Categoria não encontrada.")
    })
    public ResponseEntity<AssinaturaResponse> criar(
            @Valid @RequestBody AssinaturaRequest request,
            @AuthenticationPrincipal UsuarioDetails usuario) {
        Assinatura assinatura = paraEntidade(request);
        Assinatura assinaturaCriada = assinaturaService.criar(assinatura, usuario.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(paraResposta(assinaturaCriada));
    }

    @GetMapping
    @Operation(summary = "Listar e filtrar assinaturas",
            description = "Lista somente as assinaturas do usuário autenticado e permite filtrar por status, categoria ou ambos.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de assinaturas retornada."),
            @ApiResponse(responseCode = "400", description = "Parâmetro de filtro inválido.")
    })
    public ResponseEntity<List<AssinaturaResponse>> listar(
            @Parameter(description = "Filtra pelo status da assinatura.", example = "ATIVA")
            @RequestParam(name = "status", required = false) StatusAssinatura status,
            @Parameter(description = "Filtra pelo ID da categoria.", example = "1")
            @RequestParam(name = "categoriaId", required = false)
            @Positive(message = "O ID da categoria deve ser maior que zero.")
            Long categoriaId,
            @AuthenticationPrincipal UsuarioDetails usuario) {
        List<AssinaturaResponse> assinaturas = assinaturaService.listar(status, categoriaId, usuario.getId())
                .stream()
                .map(AssinaturaController::paraResposta)
                .toList();

        return ResponseEntity.ok(assinaturas);
    }

    @GetMapping("/proximas-cobrancas")
    @Operation(summary = "Listar próximas cobranças",
            description = "Retorna as próximas cobranças das assinaturas ativas do usuário autenticado, ordenadas pela data.")
    public ResponseEntity<List<ProximaCobrancaResponse>> listarProximasCobrancas(
            @AuthenticationPrincipal UsuarioDetails usuario) {
        return ResponseEntity.ok(assinaturaService.listarProximasCobrancas(usuario.getId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar assinatura", description = "Busca pelo ID uma assinatura do usuário autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Assinatura encontrada."),
            @ApiResponse(responseCode = "404", description = "Assinatura não encontrada.")
    })
    public ResponseEntity<AssinaturaResponse> buscarPorId(
            @PathVariable Long id,
            @AuthenticationPrincipal UsuarioDetails usuario) {
        Assinatura assinatura = assinaturaService.buscarPorId(id, usuario.getId());
        return ResponseEntity.ok(paraResposta(assinatura));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar assinatura",
            description = "Atualiza uma assinatura própria e a associa a uma categoria do usuário autenticado.",
            parameters = @Parameter(name = "X-CSRF-TOKEN", in = ParameterIn.HEADER,
                    description = "Token obtido em GET /auth/csrf.", required = true))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Assinatura atualizada."),
            @ApiResponse(responseCode = "400", description = "Dados inválidos."),
            @ApiResponse(responseCode = "404", description = "Assinatura ou categoria não encontrada.")
    })
    public ResponseEntity<AssinaturaResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody AssinaturaRequest request,
            @AuthenticationPrincipal UsuarioDetails usuario) {
        Assinatura dadosAtualizados = paraEntidade(request);
        Assinatura assinaturaAtualizada = assinaturaService.atualizar(id, dadosAtualizados, usuario.getId());

        return ResponseEntity.ok(paraResposta(assinaturaAtualizada));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir assinatura",
            description = "Exclui uma assinatura do usuário autenticado. Use apagarHistorico=true para apagar também cobranças pagas e previstas associadas.",
            parameters = @Parameter(name = "X-CSRF-TOKEN", in = ParameterIn.HEADER,
                    description = "Token obtido em GET /auth/csrf.", required = true))
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Assinatura excluída."),
            @ApiResponse(responseCode = "404", description = "Assinatura não encontrada.")
    })
    public ResponseEntity<Void> excluir(@PathVariable Long id,
                                        @RequestParam(defaultValue = "false") boolean apagarHistorico,
                                        @AuthenticationPrincipal UsuarioDetails usuario) {
        assinaturaService.excluir(id, usuario.getId(), apagarHistorico);
        return ResponseEntity.noContent().build();
    }

    private static Assinatura paraEntidade(AssinaturaRequest request) {
        Categoria categoria = new Categoria(request.getCategoriaId(), null, null);

        return new Assinatura(
                null,
                request.getNome(),
                request.getValor(),
                request.getPeriodicidade(),
                request.getDataPrimeiraCobranca(),
                request.getStatusAssinatura(),
                categoria,
                request.getIcone());
    }

    private static AssinaturaResponse paraResposta(Assinatura assinatura) {
        Categoria categoria = assinatura.getCategoria();
        CategoriaResponse categoriaResponse = new CategoriaResponse(
                categoria.getId(),
                categoria.getNome(),
                categoria.getDescricao());

        return new AssinaturaResponse(
                assinatura.getCodigo(),
                assinatura.getNome(),
                assinatura.getValor(),
                assinatura.getPeriodicidade(),
                assinatura.getDataPrimeiraCobranca(),
                assinatura.getStatusAssinatura(),
                categoriaResponse,
                assinatura.getIcone());
    }
}
