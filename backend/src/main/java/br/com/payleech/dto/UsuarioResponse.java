package br.com.payleech.dto;

import br.com.payleech.entity.Usuario;

import java.math.BigDecimal;

public class UsuarioResponse {

    private Long id;
    private String nome;
    private String email;
    private BigDecimal limiteMensalAssinaturas;

    public UsuarioResponse() {
    }

    public UsuarioResponse(Long id, String nome, String email, BigDecimal limiteMensalAssinaturas) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.limiteMensalAssinaturas = limiteMensalAssinaturas;
    }

    public UsuarioResponse(Long id, String nome, String email) {
        this(id, nome, email, new BigDecimal("500.00"));
    }

    public static UsuarioResponse de(Usuario usuario) {
        return new UsuarioResponse(usuario.getId(), usuario.getNome(), usuario.getEmail(),
                usuario.getLimiteMensalAssinaturas());
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }

    public BigDecimal getLimiteMensalAssinaturas() {
        return limiteMensalAssinaturas;
    }
}
