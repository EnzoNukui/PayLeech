package br.com.payleech;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class PayleechApplicationTests {

    @LocalServerPort
    private int port;

    @Test
    void contextLoads() {
    }

    @Test
    void openApiDeveDisponibilizarDocumentacaoJson() throws Exception {
        HttpRequest requisicao = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:" + port + "/v3/api-docs"))
                .GET()
                .build();
        HttpResponse<String> resposta = HttpClient.newHttpClient()
                .send(requisicao, HttpResponse.BodyHandlers.ofString());

        assertEquals(200, resposta.statusCode());
        assertNotNull(resposta.body());
        assertTrue(resposta.body().contains("PayLeech API"));
        assertTrue(resposta.body().contains("/assinaturas"));
        assertTrue(resposta.body().contains("/auth/csrf"));
        assertTrue(resposta.body().contains("/auth/logout"));
        assertTrue(resposta.body().contains("sessionCookie"));
        assertTrue(resposta.body().contains("X-CSRF-TOKEN"));
        assertTrue(resposta.body().contains("usuarioId"));
    }
}
