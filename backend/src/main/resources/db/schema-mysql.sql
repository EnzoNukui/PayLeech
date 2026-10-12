CREATE DATABASE IF NOT EXISTS payleech
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE payleech;

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    limite_mensal_assinaturas DECIMAL(10, 2) NOT NULL DEFAULT 500.00,
    PRIMARY KEY (id),
    CONSTRAINT uk_usuarios_email UNIQUE (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categorias (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    usuario_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_categorias_usuarios
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS assinaturas (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    periodicidade VARCHAR(20) NOT NULL,
    data_primeira_cobranca DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    icone VARCHAR(100),
    categoria_id BIGINT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_assinaturas_categorias
        FOREIGN KEY (categoria_id) REFERENCES categorias (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cobrancas (
    id BIGINT NOT NULL AUTO_INCREMENT,
    assinatura_id BIGINT NULL,
    usuario_id BIGINT NOT NULL,
    nome_assinatura VARCHAR(100) NOT NULL,
    categoria_nome VARCHAR(100),
    data_prevista DATE NOT NULL,
    valor_previsto DECIMAL(10, 2) NOT NULL,
    data_pagamento DATE,
    valor_pago DECIMAL(10, 2),
    status VARCHAR(20) NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_cobrancas_usuario_data (usuario_id, data_prevista),
    CONSTRAINT fk_cobrancas_assinaturas
        FOREIGN KEY (assinatura_id) REFERENCES assinaturas (id) ON DELETE SET NULL,
    CONSTRAINT fk_cobrancas_usuarios
        FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
) ENGINE=InnoDB;
