-- Adiciona o limite mensal de assinaturas por usuário, com valor inicial de R$ 500,00.
-- Execute uma única vez no banco payleech antes de iniciar a aplicação.

USE payleech;

ALTER TABLE usuarios
    ADD COLUMN limite_mensal_assinaturas DECIMAL(10, 2) NOT NULL DEFAULT 500.00;
