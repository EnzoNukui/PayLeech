package br.com.payleech.dto;

import br.com.payleech.enums.Periodicidade;
import br.com.payleech.enums.StatusAssinatura;

import java.math.BigDecimal;
import java.time.LocalDate;

public class AssinaturaResponse {

    private Long codigo;
    private String nome;
    private BigDecimal valor;
    private Periodicidade periodicidade;
    private LocalDate dataPrimeiraCobranca;
    private StatusAssinatura statusAssinatura;
    private CategoriaResponse categoria;
    private String icone;

    public AssinaturaResponse(Long codigo, String nome, BigDecimal valor, Periodicidade periodicidade, LocalDate dataPrimeiraCobranca, StatusAssinatura statusAssinatura, CategoriaResponse categoria) {
        this(codigo, nome, valor, periodicidade, dataPrimeiraCobranca, statusAssinatura, categoria, null);
    }

    public AssinaturaResponse(Long codigo, String nome, BigDecimal valor, Periodicidade periodicidade, LocalDate dataPrimeiraCobranca, StatusAssinatura statusAssinatura, CategoriaResponse categoria, String icone) {
        this.codigo = codigo;
        this.nome = nome;
        this.valor = valor;
        this.periodicidade = periodicidade;
        this.dataPrimeiraCobranca = dataPrimeiraCobranca;
        this.statusAssinatura = statusAssinatura;
        this.categoria = categoria;
        this.icone = icone;
    }

    public Long getCodigo() {
        return codigo;
    }
    public String getNome() {
        return nome;
    }
    public BigDecimal getValor() {
        return valor;
    }
    public Periodicidade getPeriodicidade() {
        return periodicidade;
    }
    public LocalDate getDataPrimeiraCobranca() {
        return dataPrimeiraCobranca;
    }
    public StatusAssinatura getStatusAssinatura() {
        return statusAssinatura;
    }
    public CategoriaResponse getCategoria() {
        return categoria;
    }
    public String getIcone() {
        return icone;
    }
}
