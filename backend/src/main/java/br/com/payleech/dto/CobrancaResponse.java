package br.com.payleech.dto;

import br.com.payleech.enums.StatusCobranca;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CobrancaResponse {

    private Long id;
    private Long assinaturaId;
    private String nomeAssinatura;
    private String categoriaNome;
    private LocalDate dataPrevista;
    private BigDecimal valorPrevisto;
    private LocalDate dataPagamento;
    private BigDecimal valorPago;
    private StatusCobranca status;

    public CobrancaResponse(Long id, Long assinaturaId, String nomeAssinatura, String categoriaNome,
                            LocalDate dataPrevista, BigDecimal valorPrevisto, LocalDate dataPagamento,
                            BigDecimal valorPago, StatusCobranca status) {
        this.id = id;
        this.assinaturaId = assinaturaId;
        this.nomeAssinatura = nomeAssinatura;
        this.categoriaNome = categoriaNome;
        this.dataPrevista = dataPrevista;
        this.valorPrevisto = valorPrevisto;
        this.dataPagamento = dataPagamento;
        this.valorPago = valorPago;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Long getAssinaturaId() {
        return assinaturaId;
    }

    public String getNomeAssinatura() {
        return nomeAssinatura;
    }

    public String getCategoriaNome() {
        return categoriaNome;
    }

    public LocalDate getDataPrevista() {
        return dataPrevista;
    }

    public BigDecimal getValorPrevisto() {
        return valorPrevisto;
    }

    public LocalDate getDataPagamento() {
        return dataPagamento;
    }

    public BigDecimal getValorPago() {
        return valorPago;
    }

    public StatusCobranca getStatus() {
        return status;
    }
}
