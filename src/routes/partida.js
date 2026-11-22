var express = require("express");
var router = express.Router();

var partidaController = require("../controllers/partidaController");

router.get("/listar", function (req, res) {
    partidaController.listar(req, res);
});

router.get("/listar/:idUsuario", function (req, res) {
    partidaController.listarPorUsuario(req, res);
});

router.post("/cadastrar/:fkTime", function (req, res) {
    partidaController.cadastrar(req, res);
});

router.delete("/deletar/:idpartida", function (req, res) {
    partidaController.deletar(req, res);
});

module.exports = router;