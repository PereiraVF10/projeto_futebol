var database = require("../database/config");

function listar() {
    console.log("ACESSEI O PARTIDA MODEL \n");
    var instrucaoSql = `
        SELECT 
            p.id_partida,
            p.team_adv,
            p.gols_pro,
            p.gols_sofrido,
            p.data_pt,
            p.pontos,
            p.fk_time,
            t.meu_team
        FROM partidas p
            INNER JOIN time t
                ON p.fk_time = t.id_time
                ORDER BY p.data_pt DESC, p.id_partida DESC;
    `;
    return database.executar(instrucaoSql);
}

function listarPorUsuario(idUsuario) {
    console.log("ACESSEI O PARTIDA MODEL \n");
    var instrucaoSql = `
        SELECT 
            p.id_partida,
            p.team_adv,
            p.gols_pro,
            p.gols_sofrido,
            p.data_pt,
            p.pontos,
            p.fk_time,
            t.meu_team
        FROM partidas p
            INNER JOIN time t
                ON p.fk_time = t.id_time
        WHERE t.fk_usuario = ?
        ORDER BY p.data_pt DESC, p.id_partida DESC;
    `;
    return database.executar(instrucaoSql, [idUsuario]);
}

function cadastrar(teamAdv, golsPro, golsSofrido, dataPt, pontos, fkTime) {
    console.log("ACESSEI O PARTIDA MODEL \n");
    var instrucaoSql = `
        INSERT INTO partidas (team_adv, gols_pro, gols_sofrido, data_pt, pontos, fk_time) 
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    return database.executar(instrucaoSql, [teamAdv, golsPro, golsSofrido, dataPt, pontos, fkTime]);
}

function deletar(idPartida) {
    console.log("ACESSEI O PARTIDA MODEL \n");
    var instrucaoSql = `
        DELETE FROM partidas WHERE id_partida = ?;
    `;
    return database.executar(instrucaoSql, [idPartida]);
}

module.exports = {
    listar,
    listarPorUsuario,
    cadastrar,
    deletar
}