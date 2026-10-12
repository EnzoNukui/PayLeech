-- Etapa 1: prepare um banco existente para permitir o cadastro do primeiro usuário.
-- Execute este arquivo uma única vez antes de iniciar a aplicação.

USE payleech;

ALTER TABLE categorias
    ADD COLUMN usuario_id BIGINT NULL;
