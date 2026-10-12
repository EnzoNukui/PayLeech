package br.com.payleech.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "PayLeech API",
                version = "1.0.0",
                description = """
                        API REST para gerenciamento de assinaturas recorrentes, cobranças, categorias e resumo financeiro.

                        **Sessão e proteção CSRF:** a sessão HTTP é identificada pelo cookie `JSESSIONID`; o cadastro não autentica automaticamente. """
                        + "Para chamadas protegidas, preserve esse cookie. Antes de cada operação POST, PUT ou DELETE, consulte `GET /auth/csrf` "
                        + "e envie o valor de `token` no cabeçalho indicado por `headerName` (atualmente `X-CSRF-TOKEN`). Operações PATCH também exigem esse cabeçalho. "
                        + "O login renova a sessão; consulte novamente `/auth/csrf` após autenticar.\n\n"
                        + "**Dados por usuário:** categorias pertencem ao usuário autenticado. Assinaturas herdam o proprietário da categoria. "
                        + "Os endpoints não recebem `usuarioId` do cliente; IDs de registros de outro usuário retornam 404. "
                        + "Cobranças previstas são criadas para assinaturas ativas e ficam no histórico quando o usuário confirma o pagamento."))
@SecurityScheme(
        name = "sessionCookie",
        type = SecuritySchemeType.APIKEY,
        in = SecuritySchemeIn.COOKIE,
        paramName = "JSESSIONID",
        description = "Cookie de sessão criado pelo cadastro ou login. Clientes como Insomnia devem preservar esse cookie entre requisições.")
public class OpenApiConfig {

    @Bean
    public OpenApiCustomizer documentarLogout() {
        return openApi -> openApi.path("/auth/logout", new PathItem().post(new Operation()
                .operationId("logout")
                .summary("Encerrar sessão")
                .description("Encerra a sessão autenticada e invalida o cookie de sessão.")
                .addTagsItem("Autenticação")
                .addSecurityItem(new SecurityRequirement().addList("sessionCookie"))
                .addParametersItem(new Parameter()
                        .in("header")
                        .name("X-CSRF-TOKEN")
                        .required(true)
                        .description("Token obtido em GET /auth/csrf."))
                .responses(new ApiResponses()
                        .addApiResponse("204", new ApiResponse().description("Sessão encerrada."))
                        .addApiResponse("401", new ApiResponse().description("Sessão ausente ou expirada."))
                        .addApiResponse("403", new ApiResponse().description("Token CSRF ausente ou inválido.")))));
    }
}
