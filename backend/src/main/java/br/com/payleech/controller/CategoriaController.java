package br.com.payleech.controller;

import br.com.payleech.dto.CategoriaRequest;
import br.com.payleech.dto.CategoriaResponse;
import br.com.payleech.entity.Categoria;
import br.com.payleech.service.CategoriaService;
import br.com.payleech.security.UsuarioDetails;
import jakarta.validation.Valid;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/categorias")
@Tag(name = "Categorias", description = "Operações para gerenciar categorias de assinaturas.")
@SecurityRequirement(name = "sessionCookie")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @PostMapping
    @Operation(summary = "Criar categoria",
            description = "Cadastra uma categoria pertencente ao usuário autenticado.",
            parameters = @Parameter(name = "X-CSRF-TOKEN", in = ParameterIn.HEADER,
                    description = "Token obtido em GET /auth/csrf.", required = true))
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Categoria criada."),
            @ApiResponse(responseCode = "400", description = "Dados inválidos.")
    })
    public ResponseEntity<CategoriaResponse> criar(
            @Valid @RequestBody CategoriaRequest request,
            @AuthenticationPrincipal UsuarioDetails usuario) {
        Categoria categoria = new Categoria(null, request.getNome(), request.getDescricao());
        Categoria categoriaCriada = categoriaService.criar(categoria, usuario.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(paraResposta(categoriaCriada));
    }

    @GetMapping
    @Operation(summary = "Listar categorias", description = "Retorna as categorias do usuário autenticado.")
    public ResponseEntity<List<CategoriaResponse>> listar(@AuthenticationPrincipal UsuarioDetails usuario) {
        List<CategoriaResponse> categorias = categoriaService.listar(usuario.getId())
                .stream()
                .map(CategoriaController::paraResposta)
                .toList();

        return ResponseEntity.ok(categorias);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar categoria", description = "Busca pelo ID uma categoria do usuário autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Categoria encontrada."),
            @ApiResponse(responseCode = "404", description = "Categoria não encontrada.")
    })
    public ResponseEntity<CategoriaResponse> buscarPorId(
            @PathVariable Long id,
            @AuthenticationPrincipal UsuarioDetails usuario) {
        Categoria categoria = categoriaService.buscarPorId(id, usuario.getId());
        return ResponseEntity.ok(paraResposta(categoria));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar categoria",
            description = "Atualiza uma categoria pertencente ao usuário autenticado.",
            parameters = @Parameter(name = "X-CSRF-TOKEN", in = ParameterIn.HEADER,
                    description = "Token obtido em GET /auth/csrf.", required = true))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Categoria atualizada."),
            @ApiResponse(responseCode = "400", description = "Dados inválidos."),
            @ApiResponse(responseCode = "404", description = "Categoria não encontrada.")
    })
    public ResponseEntity<CategoriaResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody CategoriaRequest request,
            @AuthenticationPrincipal UsuarioDetails usuario) {
        Categoria dadosAtualizados = new Categoria(null, request.getNome(), request.getDescricao());
        Categoria categoriaAtualizada = categoriaService.atualizar(id, dadosAtualizados, usuario.getId());

        return ResponseEntity.ok(paraResposta(categoriaAtualizada));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir categoria",
            description = "Exclui uma categoria própria que não esteja vinculada a assinaturas.",
            parameters = @Parameter(name = "X-CSRF-TOKEN", in = ParameterIn.HEADER,
                    description = "Token obtido em GET /auth/csrf.", required = true))
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Categoria excluída."),
            @ApiResponse(responseCode = "404", description = "Categoria não encontrada."),
            @ApiResponse(responseCode = "409", description = "Categoria vinculada a assinaturas.")
    })
    public ResponseEntity<Void> excluir(@PathVariable Long id, @AuthenticationPrincipal UsuarioDetails usuario) {
        categoriaService.excluir(id, usuario.getId());
        return ResponseEntity.noContent().build();
    }

    private static CategoriaResponse paraResposta(Categoria categoria) {
        return new CategoriaResponse(categoria.getId(), categoria.getNome(), categoria.getDescricao());
    }
}
