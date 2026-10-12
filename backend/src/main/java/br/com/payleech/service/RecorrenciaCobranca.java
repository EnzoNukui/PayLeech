package br.com.payleech.service;

import br.com.payleech.entity.Assinatura;
import br.com.payleech.enums.Periodicidade;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

final class RecorrenciaCobranca {

    private RecorrenciaCobranca() {
    }

    static LocalDate proximaData(Assinatura assinatura, LocalDate referencia) {
        LocalDate primeiraCobranca = assinatura.getDataPrimeiraCobranca();
        if (!primeiraCobranca.isBefore(referencia)) {
            return primeiraCobranca;
        }

        int intervaloMeses = mesesPorCobranca(assinatura.getPeriodicidade());
        long mesesDesdePrimeiraCobranca = ChronoUnit.MONTHS.between(
                primeiraCobranca.withDayOfMonth(1),
                referencia.withDayOfMonth(1));
        long numeroDeCobrancas = mesesDesdePrimeiraCobranca / intervaloMeses;
        LocalDate proximaCobranca = primeiraCobranca.plusMonths(numeroDeCobrancas * intervaloMeses);

        while (proximaCobranca.isBefore(referencia)) {
            numeroDeCobrancas++;
            proximaCobranca = primeiraCobranca.plusMonths(numeroDeCobrancas * intervaloMeses);
        }

        return proximaCobranca;
    }

    static LocalDate dataSeguinte(Assinatura assinatura, LocalDate cobrancaAtual) {
        LocalDate primeiraCobranca = assinatura.getDataPrimeiraCobranca();
        int intervaloMeses = mesesPorCobranca(assinatura.getPeriodicidade());
        long mesesDesdePrimeiraCobranca = ChronoUnit.MONTHS.between(
                primeiraCobranca.withDayOfMonth(1),
                cobrancaAtual.withDayOfMonth(1));
        long numeroDaProximaCobranca = mesesDesdePrimeiraCobranca / intervaloMeses + 1;

        return primeiraCobranca.plusMonths(numeroDaProximaCobranca * intervaloMeses);
    }

    static int mesesPorCobranca(Periodicidade periodicidade) {
        return switch (periodicidade) {
            case MENSAL -> 1;
            case TRIMESTRAL -> 3;
            case ANUAL -> 12;
        };
    }
}
