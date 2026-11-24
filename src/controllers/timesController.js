var timesModel = require("../models/timesModel");

function buscarTime(req, res) {
    var idUsuario = Number(req.params.idUsuario);

    if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
        return res.status(400).send("Usuário inválido.");
    }

    timesModel.buscarTime(idUsuario)
        .then(function (resultado) {
            return res.json(resultado[0] || null);
        })
        .catch(function (erro) {
            console.log(erro);
            return res.status(500).send("Não foi possível buscar o time.");
        });
}

function salvarTime(req, res) {
    var idUsuario = Number(req.params.idUsuario);
    var dados = req.body || {};
    var meuTeam = dados.meuTeam;
    var corCamisa = Number(dados.corCamisa);
    var escudo = Number(dados.escudo);

    if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
        return res.status(400).send("Usuário inválido.");
    }

    if (typeof meuTeam !== "string" || meuTeam.trim() === "" || meuTeam.trim().length > 45) {
        return res.status(400).send("Informe um nome com até 45 caracteres.");
    }

    if (!Number.isInteger(corCamisa) || corCamisa < 1 || corCamisa > 4) {
        return res.status(400).send("Escolha uma cor de camisa.");
    }

    if (!Number.isInteger(escudo) || escudo < 1 || escudo > 5) {
        return res.status(400).send("Escolha um escudo.");
    }

    timesModel.salvarTime(meuTeam.trim(), corCamisa, escudo, idUsuario)
        .then(function () {
            return res.json({ mensagem: "Time salvo." });
        })
        .catch(function (erro) {
            console.log(erro);
            return res.status(500).send("Não foi possível salvar o time.");
        });
}

module.exports = {
    buscarTime,
    salvarTime
};