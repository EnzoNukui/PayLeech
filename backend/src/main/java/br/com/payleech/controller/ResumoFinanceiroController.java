package br.com.payleech.controller;

import br.com.payleech.dto.ResumoFinanceiroResponse;
import br.com.payleech.service.AssinaturaService;
import br.com.payleech.security.UsuarioDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/resumo")
@Tag(name = "Resumo financeiro", description = "Consultas de custos equivalentes das assinaturas ativas.")
@SecurityRequirement(name = "sessionCookie")
public class ResumoFinanceiroController {

    private final AssinaturaService assinaturaService;

    public ResumoFinanceiroController(AssinaturaService assinaturaService) {
        this.assinaturaService = assinaturaService;
    }

    @GetMapping
    @Operation(summary = "Obter resumo financeiro",
            description = "Retorna o custo mensal equivalente, o custo anual estimado e a quantidade de assinaturas ativas do usuário autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Resumo financeiro retornado.")
    })
    public ResponseEntity<ResumoFinanceiroResponse> buscarResumo(@AuthenticationPrincipal UsuarioDetails usuario) {
        return ResponseEntity.ok(assinaturaService.gerarResumoFinanceiro(usuario.getId()));
    }
}
