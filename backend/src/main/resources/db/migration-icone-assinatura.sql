-- Adiciona o ícone escolhido para cada serviço cadastrado.
-- Execute uma vez no banco payleech antes de iniciar a aplicação atualizada.

USE payleech;

ALTER TABLE assinaturas
    ADD COLUMN icone VARCHAR(100) NULL;
