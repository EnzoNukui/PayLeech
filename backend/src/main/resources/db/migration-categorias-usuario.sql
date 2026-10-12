-- Etapa 2: execute depois de cadastrar o primeiro usuário.
-- Troque o e-mail abaixo pelo e-mail da conta criada na API.

USE payleech;

SET @email_dono = LOWER(TRIM('seu-email-cadastrado@example.com'));
SET @usuario_id = (
    SELECT id
    FROM usuarios
    WHERE LOWER(TRIM(email)) = @email_dono
    LIMIT 1
);

SELECT @usuario_id AS usuario_id_que_recebera_as_categorias_existentes;

DELIMITER //

CREATE PROCEDURE migrar_categorias_para_usuario()
BEGIN
    IF @usuario_id IS NULL THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'E-mail nao encontrado em usuarios; nenhuma categoria foi alterada.';
    END IF;

    UPDATE categorias
    SET usuario_id = @usuario_id
    WHERE usuario_id IS NULL;

    ALTER TABLE categorias
        MODIFY COLUMN usuario_id BIGINT NOT NULL;

    ALTER TABLE categorias
        ADD CONSTRAINT fk_categorias_usuarios
            FOREIGN KEY (usuario_id) REFERENCES usuarios (id);
END //

CALL migrar_categorias_para_usuario() //
DROP PROCEDURE migrar_categorias_para_usuario //

DELIMITER ;
