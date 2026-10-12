package br.com.payleech.dto;

import java.math.BigDecimal;

public class ResumoFinanceiroResponse {

    private BigDecimal custoMensalEquivalente;
    private BigDecimal custoAnualEstimado;
    private long quantidadeAssinaturasAtivas;

    public ResumoFinanceiroResponse(BigDecimal custoMensalEquivalente, BigDecimal custoAnualEstimado, long quantidadeAssinaturasAtivas) {
        this.custoMensalEquivalente = custoMensalEquivalente;
        this.custoAnualEstimado = custoAnualEstimado;
        this.quantidadeAssinaturasAtivas = quantidadeAssinaturasAtivas;
    }

    public BigDecimal getCustoMensalEquivalente() {
        return custoMensalEquivalente;
    }
    public BigDecimal getCustoAnualEstimado() {
        return custoAnualEstimado;
    }
    public long getQuantidadeAssinaturasAtivas() {
        return quantidadeAssinaturasAtivas;
    }
}
