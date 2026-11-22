var partidaModel = require("../models/partidaModel");

function listar(req, res) {
    partidaModel.listar().then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as partidas: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function listarPorUsuario(req, res) {
    var idUsuario = req.params.idUsuario;

    partidaModel.listarPorUsuario(idUsuario)
        .then(
            function (resultado) {
                if (resultado.length > 0) {
                    res.status(200).json(resultado);
                } else {
                    res.status(204).send("Nenhum resultado encontrado!");
                }
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log(
                    "Houve um erro ao buscar as partidas: ",
                    erro.sqlMessage
                );
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function cadastrar(req, res) {
    var teamAdv = req.body.teamAdv;
    var golsPro = Number(req.body.golsPro);
    var golsSofrido = Number(req.body.golsSofrido);
    var dataPt = req.body.dataPt;
    var fkTime = req.params.fkTime;

    if (teamAdv == undefined) {
        res.status(400).send("O adversário está indefinido!");
    } else if (isNaN(golsPro) || golsPro < 0) {
        res.status(400).send("Os gols prós são inválidos!");
    } else if (isNaN(golsSofrido) || golsSofrido < 0) {
        res.status(400).send("Os gols sofridos são inválidos!");
    } else if (dataPt == undefined) {
        res.status(400).send("A data está indefinida!");
    } else if (fkTime == undefined) {
        res.status(403).send("O id do time está indefinido!");
    } else {
    
        var pontos = 0;
        if (golsPro > golsSofrido) {
            pontos = 3;
        } else if (golsPro === golsSofrido) {
            pontos = 1;
        } else {
            pontos = 0;
        }

        partidaModel.cadastrar(teamAdv, golsPro, golsSofrido, dataPt, pontos, fkTime)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            )
            .catch(
                function (erro) {
                    console.log(erro);
                    console.log("Houve um erro ao realizar o cadastro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function deletar(req, res) {
    var idpartida = req.params.idpartida;

    partidaModel.deletar(idpartida)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao deletar a partida: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

module.exports = {
    listar,
    listarPorUsuario,
    cadastrar,
    deletar
}