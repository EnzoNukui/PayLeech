package br.com.payleech.entity;

import br.com.payleech.enums.Periodicidade;
import br.com.payleech.enums.StatusAssinatura;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "assinaturas")
public class Assinatura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long codigo;

    @NotBlank(message = "O nome da assinatura é obrigatório.")
    @Size(max = 100, message = "O nome da assinatura deve ter no máximo 100 caracteres.")
    @Column(nullable = false, length = 100)
    private String nome;

    @NotNull(message = "O valor da assinatura é obrigatório.")
    @Positive(message = "O valor da assinatura deve ser maior que zero.")
    @Digits(integer = 8, fraction = 2, message = "O valor deve ter até 8 dígitos inteiros e 2 casas decimais.")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @NotNull(message = "A periodicidade é obrigatória.")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Periodicidade periodicidade;

    @NotNull(message = "A data da primeira cobrança é obrigatória.")
    @Column(name = "data_primeira_cobranca", nullable = false)
    private LocalDate dataPrimeiraCobranca;

    @NotNull(message = "O status da assinatura é obrigatório.")
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private StatusAssinatura statusAssinatura;

    @Pattern(regexp = "^simple-icons:[a-z0-9-]+$", message = "O ícone deve ser uma referência válida do Simple Icons.")
    @Column(length = 100)
    private String icone;

    @NotNull(message = "A categoria da assinatura é obrigatória.")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    public Assinatura() {
    }

    public Assinatura(Long codigo, String nome, BigDecimal valor, Periodicidade periodicidade, LocalDate dataPrimeiraCobranca, StatusAssinatura statusAssinatura, Categoria categoria) {
        this(codigo, nome, valor, periodicidade, dataPrimeiraCobranca, statusAssinatura, categoria, null);
    }

    public Assinatura(Long codigo, String nome, BigDecimal valor, Periodicidade periodicidade, LocalDate dataPrimeiraCobranca, StatusAssinatura statusAssinatura, Categoria categoria, String icone) {
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
        return this.codigo;
    }
    public void setCodigo(Long codigo) {
        this.codigo = codigo;
    }
    public String getNome() {
        return this.nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public BigDecimal getValor() {
        return this.valor;
    }
    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }
    public Periodicidade getPeriodicidade() {
        return this.periodicidade;
    }
    public void setPeriodicidade(Periodicidade periodicidade) {
        this.periodicidade = periodicidade;
    }
    public LocalDate getDataPrimeiraCobranca() {
        return this.dataPrimeiraCobranca;
    }
    public void setDataPrimeiraCobranca(LocalDate dataPrimeiraCobranca) {
        this.dataPrimeiraCobranca = dataPrimeiraCobranca;
    }
    public StatusAssinatura getStatusAssinatura() {
        return this.statusAssinatura;
    }
    public void setStatusAssinatura(StatusAssinatura statusAssinatura) {
        this.statusAssinatura = statusAssinatura;
    }
    public String getIcone() {
        return this.icone;
    }
    public void setIcone(String icone) {
        this.icone = icone;
    }
    public Categoria getCategoria() {
        return this.categoria;
    }
    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }
}
