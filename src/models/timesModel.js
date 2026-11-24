var database = require("../database/config");

function buscarTime(idUsuario) {
    var instrucaoSql = `
        SELECT id_time, meu_team, cor_camisa, escudo
        FROM time
        WHERE fk_usuario = ?;
    `;

    return database.executar(instrucaoSql, [idUsuario]);
}

function salvarTime(meuTeam, corCamisa, escudo, idUsuario) {
    var instrucaoSql = `
        INSERT INTO time (meu_team, cor_camisa, escudo, fk_usuario)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE meu_team = ?, cor_camisa = ?, escudo = ?;
    `;

    return database.executar(instrucaoSql, [
        meuTeam, corCamisa, escudo, idUsuario,
        meuTeam, corCamisa, escudo
    ]);
}

module.exports = {
    buscarTime,
    salvarTime
};