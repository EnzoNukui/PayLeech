package br.com.payleech.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class AtualizarLimiteMensalRequest {

    @NotNull(message = "Informe o limite mensal.")
    @DecimalMin(value = "0.00", message = "O limite mensal não pode ser negativo.")
    @Digits(integer = 8, fraction = 2,
            message = "O limite mensal deve ter até 8 dígitos inteiros e 2 decimais.")
    private BigDecimal limiteMensalAssinaturas;

    public BigDecimal getLimiteMensalAssinaturas() {
        return limiteMensalAssinaturas;
    }

    public void setLimiteMensalAssinaturas(BigDecimal limiteMensalAssinaturas) {
        this.limiteMensalAssinaturas = limiteMensalAssinaturas;
    }
}
