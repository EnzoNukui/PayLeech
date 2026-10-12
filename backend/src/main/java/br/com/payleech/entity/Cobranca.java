package br.com.payleech.entity;

import br.com.payleech.enums.StatusCobranca;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(
        name = "cobrancas",
        indexes = @Index(name = "idx_cobrancas_usuario_data", columnList = "usuario_id, data_prevista")
)
public class Cobranca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nullable so a subscription can be deleted without erasing its payment history.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "assinatura_id",
            foreignKey = @ForeignKey(name = "fk_cobrancas_assinaturas")
    )
    private Assinatura assinatura;

    @NotNull(message = "O usuário proprietário da cobrança é obrigatório.")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "usuario_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_cobrancas_usuarios")
    )
    private Usuario usuario;

    @NotNull(message = "O nome da assinatura na cobrança é obrigatório.")
    @Size(max = 100, message = "O nome da assinatura deve ter no máximo 100 caracteres.")
    @Column(name = "nome_assinatura", nullable = false, length = 100)
    private String nomeAssinatura;

    @Size(max = 100, message = "O nome da categoria deve ter no máximo 100 caracteres.")
    @Column(name = "categoria_nome", length = 100)
    private String categoriaNome;

    @NotNull(message = "A data prevista da cobrança é obrigatória.")
    @Column(name = "data_prevista", nullable = false)
    private LocalDate dataPrevista;

    @NotNull(message = "O valor previsto da cobrança é obrigatório.")
    @PositiveOrZero(message = "O valor previsto não pode ser negativo.")
    @Digits(integer = 8, fraction = 2, message = "O valor previsto deve ter até 8 dígitos inteiros e 2 casas decimais.")
    @Column(name = "valor_previsto", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorPrevisto;

    @Column(name = "data_pagamento")
    private LocalDate dataPagamento;

    @PositiveOrZero(message = "O valor pago não pode ser negativo.")
    @Digits(integer = 8, fraction = 2, message = "O valor pago deve ter até 8 dígitos inteiros e 2 casas decimais.")
    @Column(name = "valor_pago", precision = 10, scale = 2)
    private BigDecimal valorPago;

    @NotNull(message = "O status da cobrança é obrigatório.")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatusCobranca status;

    public Cobranca() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Assinatura getAssinatura() {
        return assinatura;
    }

    public void setAssinatura(Assinatura assinatura) {
        this.assinatura = assinatura;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getNomeAssinatura() {
        return nomeAssinatura;
    }

    public void setNomeAssinatura(String nomeAssinatura) {
        this.nomeAssinatura = nomeAssinatura;
    }

    public String getCategoriaNome() {
        return categoriaNome;
    }

    public void setCategoriaNome(String categoriaNome) {
        this.categoriaNome = categoriaNome;
    }

    public LocalDate getDataPrevista() {
        return dataPrevista;
    }

    public void setDataPrevista(LocalDate dataPrevista) {
        this.dataPrevista = dataPrevista;
    }

    public BigDecimal getValorPrevisto() {
        return valorPrevisto;
    }

    public void setValorPrevisto(BigDecimal valorPrevisto) {
        this.valorPrevisto = valorPrevisto;
    }

    public LocalDate getDataPagamento() {
        return dataPagamento;
    }

    public void setDataPagamento(LocalDate dataPagamento) {
        this.dataPagamento = dataPagamento;
    }

    public BigDecimal getValorPago() {
        return valorPago;
    }

    public void setValorPago(BigDecimal valorPago) {
        this.valorPago = valorPago;
    }

    public StatusCobranca getStatus() {
        return status;
    }

    public void setStatus(StatusCobranca status) {
        this.status = status;
    }
}
