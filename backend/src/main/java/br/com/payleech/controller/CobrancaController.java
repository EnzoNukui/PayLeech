package br.com.payleech.controller;

import br.com.payleech.dto.CobrancaPagamentoRequest;
import br.com.payleech.dto.CobrancaResponse;
import br.com.payleech.entity.Cobranca;
import br.com.payleech.enums.StatusCobranca;
import br.com.payleech.security.UsuarioDetails;
import br.com.payleech.service.CobrancaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/cobrancas")
@Tag(name = "Cobranças", description = "Previsões e histórico de pagamentos das assinaturas.")
@SecurityRequirement(name = "sessionCookie")
public class CobrancaController {

    private final CobrancaService cobrancaService;

    public CobrancaController(CobrancaService cobrancaService) {
        this.cobrancaService = cobrancaService;
    }

    @GetMapping
    @Operation(summary = "Listar cobranças",
            description = "Lista despesas e próximas cobranças do usuário autenticado. Vencimentos até hoje são considerados pagos automaticamente na data prevista.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cobranças retornadas."),
            @ApiResponse(responseCode = "400", description = "Status inválido.")
    })
    public ResponseEntity<List<CobrancaResponse>> listar(
            @Parameter(description = "Filtra pelo status da cobrança.", example = "PAGA")
            @RequestParam(name = "status", required = false) StatusCobranca status,
            @AuthenticationPrincipal UsuarioDetails usuario) {
        List<CobrancaResponse> cobrancas = cobrancaService.listar(usuario.getId(), status)
                .stream()
                .map(CobrancaController::paraResposta)
                .toList();
        return ResponseEntity.ok(cobrancas);
    }

    @PatchMapping("/{id}/pagar")
    @Operation(summary = "Confirmar pagamento",
            description = "Confirma uma cobrança prevista. Se valorPago ou dataPagamento não forem informados, usa o valor previsto e a data atual.",
            parameters = @Parameter(name = "X-CSRF-TOKEN", in = ParameterIn.HEADER,
                    description = "Token obtido em GET /auth/csrf.", required = true))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Pagamento confirmado."),
            @ApiResponse(responseCode = "400", description = "Cobrança já confirmada ou dados inválidos."),
            @ApiResponse(responseCode = "404", description = "Cobrança não encontrada para o usuário autenticado.")
    })
    public ResponseEntity<CobrancaResponse> confirmarPagamento(
            @PathVariable @Positive(message = "O ID da cobrança deve ser maior que zero.") Long id,
            @Valid @RequestBody(required = false) CobrancaPagamentoRequest request,
            @AuthenticationPrincipal UsuarioDetails usuario) {
        CobrancaPagamentoRequest dados = request == null ? new CobrancaPagamentoRequest() : request;
        Cobranca cobranca = cobrancaService.confirmarPagamento(
                id,
                usuario.getId(),
                dados.getValorPago(),
                dados.getDataPagamento());
        return ResponseEntity.ok(paraResposta(cobranca));
    }

    private static CobrancaResponse paraResposta(Cobranca cobranca) {
        Long assinaturaId = cobranca.getAssinatura() == null
                ? null
                : cobranca.getAssinatura().getCodigo();

        return new CobrancaResponse(
                cobranca.getId(),
                assinaturaId,
                cobranca.getNomeAssinatura(),
                cobranca.getCategoriaNome(),
                cobranca.getDataPrevista(),
                cobranca.getValorPrevisto(),
                cobranca.getDataPagamento(),
                cobranca.getValorPago(),
                cobranca.getStatus());
    }
}
