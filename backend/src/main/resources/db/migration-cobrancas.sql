-- Adiciona previsões de cobrança e registros de pagamentos confirmados.
-- Execute uma vez no banco payleech antes de iniciar a aplicação.

USE payleech;

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
