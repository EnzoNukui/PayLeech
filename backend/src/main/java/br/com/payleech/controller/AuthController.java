package br.com.payleech.controller;

import br.com.payleech.dto.CadastroUsuarioRequest;
import br.com.payleech.dto.AtualizarLimiteMensalRequest;
import br.com.payleech.dto.CsrfTokenResponse;
import br.com.payleech.dto.LoginRequest;
import br.com.payleech.dto.UsuarioResponse;
import br.com.payleech.entity.Usuario;
import br.com.payleech.security.UsuarioDetails;
import br.com.payleech.service.AuthService;
import br.com.payleech.service.UsuarioService;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticação", description = "Cadastro, login por sessão HTTP e consulta do token CSRF.")
public class AuthController {

    private final UsuarioService usuarioService;
    private final AuthService authService;

    public AuthController(UsuarioService usuarioService, AuthService authService) {
        this.usuarioService = usuarioService;
        this.authService = authService;
    }

    @PostMapping("/cadastro")
    @Operation(
            summary = "Cadastrar usuário",
            description = "Cria uma conta. Preserve o cookie de sessão e envie o token CSRF obtido em GET /auth/csrf.",
            parameters = @Parameter(name = "X-CSRF-TOKEN", in = ParameterIn.HEADER,
                    description = "Valor do campo token retornado por GET /auth/csrf.", required = true))
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Conta criada."),
            @ApiResponse(responseCode = "400", description = "Dados inválidos."),
            @ApiResponse(responseCode = "403", description = "Token CSRF ausente ou inválido."),
            @ApiResponse(responseCode = "409", description = "E-mail já cadastrado.")
    })
    public ResponseEntity<UsuarioResponse> cadastrar(@Valid @RequestBody CadastroUsuarioRequest request) {
        Usuario usuario = usuarioService.cadastrar(
                request.getNome(),
                request.getEmail(),
                request.getSenha());

        return ResponseEntity.status(HttpStatus.CREATED).body(UsuarioResponse.de(usuario));
    }

    @PostMapping("/login")
    @Operation(
            summary = "Entrar",
            description = "Autentica por e-mail e senha e cria a sessão JSESSIONID. Após o login, consulte GET /auth/csrf novamente.",
            parameters = @Parameter(name = "X-CSRF-TOKEN", in = ParameterIn.HEADER,
                    description = "Valor do campo token retornado por GET /auth/csrf.", required = true))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login realizado."),
            @ApiResponse(responseCode = "400", description = "Dados inválidos."),
            @ApiResponse(responseCode = "401", description = "E-mail ou senha inválidos."),
            @ApiResponse(responseCode = "403", description = "Token CSRF ausente ou inválido.")
    })
    public UsuarioResponse login(@Valid @RequestBody LoginRequest request,
                                 HttpServletRequest httpRequest,
                                 HttpServletResponse httpResponse) {
        UsuarioDetails usuario = authService.autenticar(
                request.getEmail(), request.getSenha(), httpRequest, httpResponse);
        return new UsuarioResponse(usuario.getId(), usuario.getNome(), usuario.getEmail(),
                usuario.getLimiteMensalAssinaturas());
    }

    @GetMapping("/me")
    @Operation(summary = "Consultar sessão atual", security = @SecurityRequirement(name = "sessionCookie"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuário autenticado."),
            @ApiResponse(responseCode = "401", description = "Sessão ausente ou expirada.")
    })
    public UsuarioResponse usuarioAtual(@AuthenticationPrincipal UsuarioDetails usuario) {
        return UsuarioResponse.de(usuarioService.buscarPorId(usuario.getId()));
    }

    @PatchMapping("/limite-mensal")
    @Operation(summary = "Atualizar limite mensal de assinaturas",
            description = "Salva o limite mensal configurado pelo usuário autenticado.",
            parameters = @Parameter(name = "X-CSRF-TOKEN", in = ParameterIn.HEADER,
                    description = "Token obtido em GET /auth/csrf.", required = true))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Limite atualizado."),
            @ApiResponse(responseCode = "400", description = "Limite inválido."),
            @ApiResponse(responseCode = "401", description = "Sessão ausente ou expirada.")
    })
    public UsuarioResponse atualizarLimiteMensal(
            @Valid @RequestBody AtualizarLimiteMensalRequest request,
            @AuthenticationPrincipal UsuarioDetails usuario) {
        Usuario atualizado = usuarioService.atualizarLimiteMensal(
                usuario.getId(), request.getLimiteMensalAssinaturas());
        return UsuarioResponse.de(atualizado);
    }

    @GetMapping("/csrf")
    @Operation(summary = "Obter token CSRF",
            description = "Retorna o token e o nome do cabeçalho para enviar operações POST, PUT e DELETE. Preserve o cookie JSESSIONID da resposta.")
    @ApiResponse(responseCode = "200", description = "Token CSRF e nome do cabeçalho retornados.")
    public CsrfTokenResponse csrf(CsrfToken csrfToken) {
        return new CsrfTokenResponse(csrfToken.getToken(), csrfToken.getHeaderName());
    }
}
