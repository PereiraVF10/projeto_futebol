var express = require("express");
var router = express.Router();
var timesController = require("../controllers/timesController");

router.get("/buscar/:idUsuario", function (req, res) {
    timesController.buscarTime(req, res);
});

router.post("/salvar/:idUsuario", function (req, res) {
    timesController.salvarTime(req, res);
});

module.exports = router;