package br.com.payleech.controller;

import br.com.payleech.dto.ServicoPlanoPrecoResponse;
import br.com.payleech.dto.ServicoPrecoResponse;
import br.com.payleech.service.ServicoPrecoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/servicos/precos")
@Tag(name = "Preços de serviços", description = "Consulta preços públicos de planos conhecidos.")
@SecurityRequirement(name = "sessionCookie")
public class ServicoPrecoController {

    private final ServicoPrecoService servicoPrecoService;

    public ServicoPrecoController(ServicoPrecoService servicoPrecoService) {
        this.servicoPrecoService = servicoPrecoService;
    }

    @GetMapping("/planos")
    @Operation(summary = "Listar planos disponíveis para consulta de preço")
    public ResponseEntity<List<ServicoPlanoPrecoResponse>> listarPlanos(@RequestParam String servico) {
        return ResponseEntity.ok(servicoPrecoService.listarPlanos(servico));
    }

    @GetMapping
    @Operation(summary = "Consultar preço atual de um plano em um país")
    public ResponseEntity<ServicoPrecoResponse> buscarPreco(
            @RequestParam String servico,
            @RequestParam String plano,
            @RequestParam(defaultValue = "BRA") String pais) {
        return ResponseEntity.ok(servicoPrecoService.buscarPreco(servico, plano, pais));
    }
}
