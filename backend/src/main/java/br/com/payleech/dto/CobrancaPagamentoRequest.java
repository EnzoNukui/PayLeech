package br.com.payleech.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CobrancaPagamentoRequest {

    @DecimalMin(value = "0.00", message = "O valor pago não pode ser negativo.")
    @Digits(integer = 8, fraction = 2,
            message = "O valor pago deve ter até 8 dígitos inteiros e 2 casas decimais.")
    private BigDecimal valorPago;

    private LocalDate dataPagamento;

    public BigDecimal getValorPago() {
        return valorPago;
    }

    public void setValorPago(BigDecimal valorPago) {
        this.valorPago = valorPago;
    }

    public LocalDate getDataPagamento() {
        return dataPagamento;
    }

    public void setDataPagamento(LocalDate dataPagamento) {
        this.dataPagamento = dataPagamento;
    }
}
