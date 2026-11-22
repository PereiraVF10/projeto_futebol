-- ==================================
-- ETAPA 1 - criar database e tabelas
-- ==================================

CREATE DATABASE projeto1;
USE projeto1;

CREATE TABLE usuario (
	id INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(50),
	email VARCHAR(50) NOT NULL UNIQUE,
	senha VARCHAR(50)
);

CREATE TABLE time (
id_time INT PRIMARY KEY AUTO_INCREMENT,
meu_team VARCHAR(45),
cor_camisa INT,
escudo INT,
fk_usuario INT UNIQUE NOT NULL,
CONSTRAINT cadastros FOREIGN KEY (fk_usuario) REFERENCES usuario(id),
CONSTRAINT opcoes_escudo CHECK(escudo IN(1, 2, 3, 4, 5)),
CONSTRAINT opcoes_cor CHECK(cor_camisa IN(1, 2, 3, 4, 5))
);

CREATE TABLE partidas (
id_partida INT PRIMARY KEY AUTO_INCREMENT,
team_adv VARCHAR(45)NOT NULL,
gols_pro INT NOT NULL,
gols_sofrido INT NOT NULL,
data_pt DATE NOT NULL,
pontos INT NOT NULL,
fk_time INT NOT NULL,
CONSTRAINT confronto FOREIGN KEY (fk_time) REFERENCES time (id_time),
CONSTRAINT casa CHECK (gols_pro >= 0),
CONSTRAINT fora CHECK (gols_sofrido >= 0),
CONSTRAINT chk_pontos_placar CHECK (
(gols_pro > gols_sofrido AND pontos = 3) OR
(gols_pro = gols_sofrido AND pontos = 1) OR
(gols_pro < gols_sofrido AND pontos = 0))
);

-- ==================================
-- ETAPA 2 - Inserts para testes do projeto
-- ==================================

INSERT INTO usuario (nome, email, senha) VALUES 
('Victor Pereira', 'victor@email.com', 'Vp06!');

INSERT INTO time (meu_team, cor_camisa, escudo, fk_usuario) VALUES 
('Máquina FC', 1, 2, 1);

INSERT INTO partidas (team_adv, gols_pro, gols_sofrido, data_pt, pontos, fk_time) VALUES 
('Rival FC', 6, 3, '2026-06-01', 3, 1);

-- ==================================
-- ETAPA 3 - Selects para os dados que vai fornecer para o projeto
-- ==================================

SELECT COUNT(id_partida) AS total_jogos,
IFNULL (SUM(CASE WHEN pontos = 3 THEN 1 ELSE 0 END),0) AS total_vitorias,
IFNULL (SUM(CASE WHEN pontos = 1 THEN 1 ELSE 0 END),0) AS total_empates,
IFNULL (SUM(CASE WHEN pontos = 0 THEN 1 ELSE 0 END), 0) AS total_derrotas,
IFNULL (SUM(gols_pro),0) AS total_gols,
IFNULL (SUM(pontos),0) AS total_pontos
FROM partidas WHERE fk_time = 1;