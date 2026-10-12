package br.com.payleech.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

@Entity
@Table(
        name = "usuarios",
        uniqueConstraints = @UniqueConstraint(name = "uk_usuarios_email", columnNames = "email")
)
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do usuário é obrigatório.")
    @Size(max = 100, message = "O nome do usuário deve ter no máximo 100 caracteres.")
    @Column(nullable = false, length = 100)
    private String nome;

    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "Informe um e-mail válido.")
    @Size(max = 254, message = "O e-mail deve ter no máximo 254 caracteres.")
    @Column(nullable = false, length = 254)
    private String email;

    @NotBlank(message = "O hash da senha é obrigatório.")
    @Size(max = 255, message = "O hash da senha deve ter no máximo 255 caracteres.")
    @Column(name = "senha_hash", nullable = false, length = 255)
    private String senhaHash;

    @NotNull(message = "O limite mensal é obrigatório.")
    @DecimalMin(value = "0.00", message = "O limite mensal não pode ser negativo.")
    @Digits(integer = 8, fraction = 2, message = "O limite mensal deve ter até 8 dígitos inteiros e 2 decimais.")
    @Column(name = "limite_mensal_assinaturas", nullable = false, precision = 10, scale = 2)
    private BigDecimal limiteMensalAssinaturas = new BigDecimal("500.00");

    public Usuario() {
    }

    public Usuario(Long id, String nome, String email, String senhaHash) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senhaHash = senhaHash;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getSenhaHash() {
        return senhaHash;
    }
    public void setSenhaHash(String senhaHash) {
        this.senhaHash = senhaHash;
    }

    public BigDecimal getLimiteMensalAssinaturas() {
        return limiteMensalAssinaturas;
    }

    public void setLimiteMensalAssinaturas(BigDecimal limiteMensalAssinaturas) {
        this.limiteMensalAssinaturas = limiteMensalAssinaturas;
    }
}
