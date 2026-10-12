package br.com.payleech.dto;

import br.com.payleech.enums.Periodicidade;
import br.com.payleech.enums.StatusAssinatura;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class AssinaturaRequest {

    @NotBlank(message = "O nome da assinatura é obrigatório.")
    @Size(max = 100, message = "O nome da assinatura deve ter no máximo 100 caracteres.")
    private String nome;

    @NotNull(message = "O valor da assinatura é obrigatório.")
    @Positive(message = "O valor da assinatura deve ser maior que zero.")
    @Digits(integer = 8, fraction = 2,
            message = "O valor deve ter até 8 dígitos inteiros e 2 casas decimais.")
    private BigDecimal valor;

    @NotNull(message = "A periodicidade é obrigatória.")
    private Periodicidade periodicidade;

    @NotNull(message = "A data da primeira cobrança é obrigatória.")
    private LocalDate dataPrimeiraCobranca;

    @NotNull(message = "O status da assinatura é obrigatório.")
    private StatusAssinatura statusAssinatura;

    @NotNull(message = "A categoria da assinatura é obrigatória.")
    @Positive(message = "O ID da categoria deve ser maior que zero.")
    private Long categoriaId;

    @Pattern(regexp = "^simple-icons:[a-z0-9-]+$", message = "O ícone deve ser uma referência válida do Simple Icons.")
    private String icone;

    public AssinaturaRequest() {
    }

    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public BigDecimal getValor() {
        return valor;
    }
    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }
    public Periodicidade getPeriodicidade() {
        return periodicidade;
    }
    public void setPeriodicidade(Periodicidade periodicidade) {
        this.periodicidade = periodicidade;
    }
    public LocalDate getDataPrimeiraCobranca() {
        return dataPrimeiraCobranca;
    }
    public void setDataPrimeiraCobranca(LocalDate dataPrimeiraCobranca) {
        this.dataPrimeiraCobranca = dataPrimeiraCobranca;
    }
    public StatusAssinatura getStatusAssinatura() {
        return statusAssinatura;
    }
    public void setStatusAssinatura(StatusAssinatura statusAssinatura) {
        this.statusAssinatura = statusAssinatura;
    }
    public Long getCategoriaId() {
        return categoriaId;
    }
    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
    }
    public String getIcone() {
        return icone;
    }
    public void setIcone(String icone) {
        this.icone = icone;
    }
}
