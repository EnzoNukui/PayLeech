package br.com.payleech.dto;

import br.com.payleech.enums.Periodicidade;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ProximaCobrancaResponse {

    private Long assinaturaId;
    private String nomeAssinatura;
    private BigDecimal valor;
    private Periodicidade periodicidade;
    private LocalDate dataProximaCobranca;
    private String categoriaNome;

    public ProximaCobrancaResponse(Long assinaturaId, String nomeAssinatura, BigDecimal valor, Periodicidade periodicidade, LocalDate dataProximaCobranca, String categoriaNome) {
        this.assinaturaId = assinaturaId;
        this.nomeAssinatura = nomeAssinatura;
        this.valor = valor;
        this.periodicidade = periodicidade;
        this.dataProximaCobranca = dataProximaCobranca;
        this.categoriaNome = categoriaNome;
    }

    public Long getAssinaturaId() {
        return assinaturaId;
    }

    public String getNomeAssinatura() {
        return nomeAssinatura;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public Periodicidade getPeriodicidade() {
        return periodicidade;
    }

    public LocalDate getDataProximaCobranca() {
        return dataProximaCobranca;
    }

    public String getCategoriaNome() {
        return categoriaNome;
    }
}
