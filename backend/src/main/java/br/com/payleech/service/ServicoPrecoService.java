package br.com.payleech.service;

import br.com.payleech.dto.ServicoPlanoPrecoResponse;
import br.com.payleech.dto.ServicoPrecoResponse;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ServicoPrecoService {

    private static final Duration CACHE_DURATION = Duration.ofHours(12);
    private static final Map<String, String> PROVIDERS = Map.of(
            "netflix", "netflix",
            "spotify", "spotify",
            "adobe creative cloud", "adobe",
            "adobe", "adobe",
            "disney+", "disney-plus",
            "disney plus", "disney-plus",
            "youtube premium", "youtube-premium",
            "revolut", "revolut");
    private static final ParameterizedTypeReference<ApiEnvelope<List<WpiPlan>>> PLAN_RESPONSE = new ParameterizedTypeReference<>() {};
    private static final ParameterizedTypeReference<ApiEnvelope<List<WpiPrice>>> PRICE_RESPONSE = new ParameterizedTypeReference<>() {};

    private final RestClient restClient;
    private final String apiKey;
    private final ConcurrentHashMap<String, CacheEntry<List<ServicoPlanoPrecoResponse>>> planCache = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, CacheEntry<List<ServicoPrecoResponse>>> priceCache = new ConcurrentHashMap<>();

    public ServicoPrecoService(@Value("${world-price-index.api-key:}") String apiKey) {
        this.restClient = RestClient.create("https://api.worldpriceindex.org");
        this.apiKey = apiKey;
    }

    public List<ServicoPlanoPrecoResponse> listarPlanos(String nomeServico) {
        String provider = providerFor(nomeServico);
        requireApiKey();
        return cached(planCache, provider, () -> {
            ApiEnvelope<List<WpiPlan>> response = call(provider + "/plans", PLAN_RESPONSE);
            if (response.data() == null) return List.of();
            return response.data().stream()
                    .filter(plan -> plan.slug() != null && plan.name() != null)
                    .map(plan -> new ServicoPlanoPrecoResponse(plan.slug(), plan.name()))
                    .toList();
        });
    }

    public ServicoPrecoResponse buscarPreco(String nomeServico, String slugPlano, String codigoPais) {
        String provider = providerFor(nomeServico);
        requireApiKey();
        if (slugPlano == null || !slugPlano.matches("[a-zA-Z0-9-]{1,80}")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O plano informado é inválido.");
        }
        String country = codigoPais == null ? "BRA" : codigoPais.trim().toUpperCase(Locale.ROOT);
        if (!country.matches("[A-Z]{3}")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O país deve ser informado com o código ISO de três letras.");
        }
        String cacheKey = provider + ":" + slugPlano + ":" + country;
        List<ServicoPrecoResponse> prices = cached(priceCache, cacheKey, () -> {
            String path = provider + "/plans/" + slugPlano + "/prices?country=" + country + "&history=false";
            ApiEnvelope<List<WpiPrice>> response = call(path, PRICE_RESPONSE);
            if (response.data() == null) return List.of();
            return response.data().stream()
                    .filter(price -> price.price() != null)
                    .map(price -> new ServicoPrecoResponse(
                            provider,
                            price.planSlug(),
                            price.planName(),
                            price.country(),
                            price.currency(),
                            price.price(),
                            price.priceText(),
                            price.billingPeriod(),
                            price.billingCadence(),
                            price.sourceUrl(),
                            price.sourceObservedAt()))
                    .toList();
        });
        return prices.stream().findFirst().orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Não há preço disponível para esse plano e país."));
    }

    private String providerFor(String name) {
        if (name == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe o serviço.");
        String provider = PROVIDERS.get(name.trim().toLowerCase(Locale.ROOT));
        if (provider == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "A consulta automática ainda não cobre esse serviço.");
        }
        return provider;
    }

    private void requireApiKey() {
        if (apiKey == null || apiKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Configure WORLD_PRICE_INDEX_API_KEY no backend para habilitar a busca de preços.");
        }
    }

    private <T> ApiEnvelope<T> call(String path, ParameterizedTypeReference<ApiEnvelope<T>> responseType) {
        try {
            return restClient.get()
                    .uri("/v1/" + path)
                    .header("Authorization", "Bearer " + apiKey)
                    .retrieve()
                    .body(responseType);
        } catch (RestClientResponseException exception) {
            throw new ResponseStatusException(exception.getStatusCode().value() == 429
                    ? HttpStatus.SERVICE_UNAVAILABLE : HttpStatus.BAD_GATEWAY,
                    exception.getStatusCode().value() == 429
                            ? "O limite de consultas de preço foi atingido. Tente novamente mais tarde."
                            : "A fonte de preços não respondeu à consulta.");
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Não foi possível consultar a fonte de preços.");
        }
    }

    private <T> T cached(ConcurrentHashMap<String, CacheEntry<T>> cache, String key, java.util.function.Supplier<T> loader) {
        CacheEntry<T> entry = cache.get(key);
        if (entry != null && entry.expiresAt().isAfter(Instant.now())) return entry.value();
        T value = loader.get();
        cache.put(key, new CacheEntry<>(value, Instant.now().plus(CACHE_DURATION)));
        return value;
    }

    private record CacheEntry<T>(T value, Instant expiresAt) {}
    private record ApiEnvelope<T>(T data) {}
    private record WpiPlan(String slug, String name) {}
    private record WpiPrice(
            @JsonProperty("plan_slug") String planSlug,
            @JsonProperty("plan_name") String planName,
            String country,
            String currency,
            BigDecimal price,
            @JsonProperty("price_text") String priceText,
            @JsonProperty("billing_period") String billingPeriod,
            @JsonProperty("billing_cadence") String billingCadence,
            @JsonProperty("source_url") String sourceUrl,
            @JsonProperty("source_observed_at") LocalDate sourceObservedAt) {}
}
