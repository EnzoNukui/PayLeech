package br.com.payleech.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ServicoPrecoResponse(
        String servico,
        String plano,
        String nomePlano,
        String pais,
        String moeda,
        BigDecimal valor,
        String precoFormatado,
        String periodicidade,
        String cadenciaCobranca,
        String fonte,
        LocalDate observadoEm) {
}
