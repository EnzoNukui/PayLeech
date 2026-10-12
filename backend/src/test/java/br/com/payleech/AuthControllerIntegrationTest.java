package br.com.payleech;

import br.com.payleech.entity.Usuario;
import br.com.payleech.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.net.CookieManager;
import java.net.CookiePolicy;
import java.net.HttpCookie;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AuthControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void cadastroELoginDevemArmazenarHashEProtegerASessao() throws Exception {
        CookieManager cookieManager = new CookieManager(null, CookiePolicy.ACCEPT_ALL);
        HttpClient client = HttpClient.newBuilder().cookieHandler(cookieManager).build();
        String email = "login-" + UUID.randomUUID() + "@example.com";
        String senha = "Teste-Seguro-92!";

        Csrf csrfInicial = buscarCsrf(client);
        String sessaoAntesDoLogin = valorCookie(cookieManager, "JSESSIONID");
        String dadosCadastro = "{\"nome\":\"Teste PayLeech\",\"email\":\"" + email
                + "\",\"senha\":\"" + senha + "\"}";

        HttpResponse<String> cadastroSemCsrf = enviarJsonSemCsrf(client, "/auth/cadastro", dadosCadastro);
        assertEquals(403, cadastroSemCsrf.statusCode(), "O cadastro deve rejeitar requisições sem CSRF.");

        HttpResponse<String> cadastro = enviarJson(client, "/auth/cadastro", csrfInicial,
                dadosCadastro);

        assertEquals(201, cadastro.statusCode());
        assertFalse(cadastro.body().contains(senha), "A resposta de cadastro não deve devolver a senha.");

        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email).orElseThrow();
        assertNotEquals(senha, usuario.getSenhaHash(), "A senha não pode ser armazenada em texto puro.");
        assertTrue(passwordEncoder.matches(senha, usuario.getSenhaHash()),
                "O hash armazenado deve validar a senha informada.");

        HttpResponse<String> semSessao = client.send(HttpRequest.newBuilder()
                        .uri(uri("/auth/me"))
                        .GET()
                        .build(), HttpResponse.BodyHandlers.ofString());
        assertEquals(401, semSessao.statusCode(), "A sessão deve exigir autenticação antes do login.");

        Csrf csrfLoginInvalido = buscarCsrf(client);
        HttpResponse<String> senhaIncorreta = enviarJson(client, "/auth/login", csrfLoginInvalido,
                "{\"email\":\"" + email + "\",\"senha\":\"Senha-Errada-93!\"}");
        assertEquals(401, senhaIncorreta.statusCode());

        Csrf csrfSenhaLonga = buscarCsrf(client);
        HttpResponse<String> senhaExcessivamenteLonga = enviarJson(client, "/auth/login", csrfSenhaLonga,
                "{\"email\":\"" + email + "\",\"senha\":\"" + "x".repeat(1000) + "\"}");
        assertEquals(400, senhaExcessivamenteLonga.statusCode(),
                "O login deve rejeitar senhas muito longas antes de tentar autenticá-las.");

        Csrf csrfLogin = buscarCsrf(client);
        HttpResponse<String> login = enviarJson(client, "/auth/login", csrfLogin,
                "{\"email\":\"" + email + "\",\"senha\":\"" + senha + "\"}");

        assertEquals(200, login.statusCode());
        assertFalse(login.body().contains(senha), "A resposta de login não deve devolver a senha.");
        assertFalse(login.body().toLowerCase().contains("senhahash"),
                "A resposta de login não deve expor o hash da senha.");
        assertNotEquals(sessaoAntesDoLogin, valorCookie(cookieManager, "JSESSIONID"),
                "O identificador da sessão deve ser renovado após autenticar.");

        HttpResponse<String> sessaoAutenticada = client.send(HttpRequest.newBuilder()
                        .uri(uri("/auth/me"))
                        .GET()
                        .build(), HttpResponse.BodyHandlers.ofString());
        assertEquals(200, sessaoAutenticada.statusCode());
        assertTrue(sessaoAutenticada.body().contains(email));
    }

    private Csrf buscarCsrf(HttpClient client) throws Exception {
        HttpResponse<String> resposta = client.send(HttpRequest.newBuilder()
                        .uri(uri("/auth/csrf"))
                        .GET()
                        .build(), HttpResponse.BodyHandlers.ofString());

        assertEquals(200, resposta.statusCode());
        Matcher token = Pattern.compile("\"token\"\\s*:\\s*\"([^\"]+)\"").matcher(resposta.body());
        Matcher headerName = Pattern.compile("\"headerName\"\\s*:\\s*\"([^\"]+)\"")
                .matcher(resposta.body());
        assertTrue(token.find(), "A resposta CSRF deve incluir o token.");
        String nomeCabecalho = headerName.find() ? headerName.group(1) : "X-CSRF-TOKEN";
        return new Csrf(token.group(1), nomeCabecalho);
    }

    private HttpResponse<String> enviarJson(HttpClient client, String caminho, Csrf csrf, String json)
            throws Exception {
        return client.send(HttpRequest.newBuilder()
                        .uri(uri(caminho))
                        .header("Content-Type", "application/json")
                        .header(csrf.headerName(), csrf.token())
                        .POST(HttpRequest.BodyPublishers.ofString(json, StandardCharsets.UTF_8))
                        .build(), HttpResponse.BodyHandlers.ofString());
    }

    private HttpResponse<String> enviarJsonSemCsrf(HttpClient client, String caminho, String json)
            throws Exception {
        return client.send(HttpRequest.newBuilder()
                        .uri(uri(caminho))
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(json, StandardCharsets.UTF_8))
                        .build(), HttpResponse.BodyHandlers.ofString());
    }

    private String valorCookie(CookieManager cookieManager, String nome) {
        return cookieManager.getCookieStore().getCookies().stream()
                .filter(cookie -> cookie.getName().equals(nome))
                .map(HttpCookie::getValue)
                .findFirst()
                .orElseThrow(() -> new AssertionError("Cookie " + nome + " não foi emitido."));
    }

    private URI uri(String caminho) {
        return URI.create("http://localhost:" + port + caminho);
    }

    private record Csrf(String token, String headerName) {
    }
}
