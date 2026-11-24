var idUsuario = sessionStorage.ID_USUARIO;
var idTime = 0;
var escudoEscolhido = 0;
var corEscolhida = 0;

var mensagemTime = document.getElementById("mensagem_time");
var mensagemPartida = document.getElementById("mensagem_partida");
var mensagemHistorico = document.getElementById("mensagem_historico");

function destacarOpcao(idGrupo, numero) {
    var botoes = document.getElementById(idGrupo).getElementsByTagName("button");

    for (var i = 0; i < botoes.length; i++) {
        botoes[i].className = i + 1 === numero ? "ativo" : "";
    }
}

function escolherEscudo(numero) {
    escudoEscolhido = numero;
    destacarOpcao("opcoes_escudo", numero);
}

function escolherCor(numero) {
    corEscolhida = numero;
    destacarOpcao("opcoes_camisa", numero);
}

function CarregarTime() {
    return fetch("/times/buscar/" + idUsuario)
        .then(function (resposta) {
            if (!resposta.ok) {
                throw new Error("Não foi possível carregar o time.");
            }

            return resposta.json();
        })
        .then(function (time) {
            if (time === null) {
                idTime = 0;
                document.getElementById("time_topo").hidden = true;
                return;
            }

            idTime = time.id_time;
            document.getElementById("casa").value = time.meu_team;

            escolherEscudo(Number(time.escudo));
            escolherCor(Number(time.cor_camisa));

            document.getElementById("nome_time_topo").textContent = time.meu_team;
            document.getElementById("escudo_topo").src =
                "/assets/icon/escudos/escudo-" + time.escudo + ".svg";
            document.getElementById("camisa_topo").src =
                "/assets/icon/camisas/camisa-" + time.cor_camisa + ".svg";
            document.getElementById("time_topo").hidden = false;
        });
}

function SalvarTime() {
    var nomeTime = document.getElementById("casa").value.trim();

    if (nomeTime === "" || nomeTime.length > 45) {
        mensagemTime.textContent = "Informe um nome de time com até 45 caracteres.";
        return;
    }

    if (escudoEscolhido < 1 || escudoEscolhido > 5 ||
        corEscolhida < 1 || corEscolhida > 4) {
        mensagemTime.textContent = "Escolha um escudo e uma cor de camisa.";
        return;
    }

    mensagemTime.textContent = "";

    fetch("/times/salvar/" + idUsuario, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            meuTeam: nomeTime,
            escudo: escudoEscolhido,
            corCamisa: corEscolhida
        })
    }).then(function (resposta) {
        if (!resposta.ok) {
            throw new Error("Não foi possível salvar o time.");
        }

        mensagemTime.textContent = "Time salvo.";

        return CarregarTime().catch(function () {
            mensagemTime.textContent = "Time salvo. Recarregue a página para atualizar o topo.";
        });
    }).catch(function () {
        mensagemTime.textContent = "Não foi possível salvar o time.";
    });
}

function placarValido(gols) {
    return gols !== "" && Number.isInteger(Number(gols)) && Number(gols) >= 0;
}

function atualizarResultado() {
    var golsPro = document.getElementById("gols_pro").value;
    var golsSofridos = document.getElementById("gols_sofrido").value;
    var cartoes = document.getElementsByClassName("card_resultado");
    var cartaoAtivo = -1;

    if (placarValido(golsPro) && placarValido(golsSofridos)) {
        if (Number(golsPro) > Number(golsSofridos)) {
            cartaoAtivo = 0;
        } else if (Number(golsPro) === Number(golsSofridos)) {
            cartaoAtivo = 1;
        } else {
            cartaoAtivo = 2;
        }
    }

    for (var i = 0; i < cartoes.length; i++) {
        cartoes[i].className = i === cartaoAtivo
            ? "card_resultado ativo"
            : "card_resultado";
    }
}

function SalvarPartida() {
    var data = document.getElementById("date").value;
    var adversario = document.getElementById("fora").value.trim();
    var golsPro = document.getElementById("gols_pro").value;
    var golsSofridos = document.getElementById("gols_sofrido").value;

    if (!idTime) {
        mensagemPartida.textContent = "Salve seu time primeiro.";
        return;
    }

    if (data === "" || adversario === "" || adversario.length > 45) {
        mensagemPartida.textContent = "Informe a data e um adversário com até 45 caracteres.";
        return;
    }

    if (!placarValido(golsPro) || !placarValido(golsSofridos)) {
        mensagemPartida.textContent = "Informe os gols como números inteiros a partir de zero.";
        return;
    }

    mensagemPartida.textContent = "";

    fetch("/partidas/cadastrar/" + idTime, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            dataPt: data,
            teamAdv: adversario,
            golsPro: Number(golsPro),
            golsSofrido: Number(golsSofridos)
        })
    }).then(function (resposta) {
        if (!resposta.ok) {
            throw new Error("Não foi possível salvar a partida.");
        }

        mensagemPartida.textContent = "Partida salva.";
        document.getElementById("date").value = "";
        document.getElementById("fora").value = "";
        document.getElementById("gols_pro").value = "";
        document.getElementById("gols_sofrido").value = "";

        atualizarResultado();
        return carregarHistorico();
    }).catch(function () {
        mensagemPartida.textContent = "Não foi possível salvar a partida.";
    });
}

function carregarHistorico() {
    var corpo = document.getElementById("corpo_historico");

    return fetch("/partidas/listar/" + idUsuario)
        .then(function (resposta) {
            if (resposta.status === 204) {
                return [];
            }

            if (!resposta.ok) {
                throw new Error("Não foi possível carregar o histórico.");
            }

            return resposta.json();
        })
        .then(function (partidas) {
            corpo.textContent = "";
            mensagemHistorico.textContent = partidas.length === 0
                ? "Nenhuma partida registrada."
                : "";

            for (var i = 0; i < partidas.length; i++) {
                var partida = partidas[i];
                var data = partida.data_pt.slice(0, 10).split("-");
                var resultado = "Derrota";

                if (Number(partida.pontos) === 3) {
                    resultado = "Vitória";
                } else if (Number(partida.pontos) === 1) {
                    resultado = "Empate";
                }

                var valores = [
                    data[2] + "/" + data[1] + "/" + data[0],
                    partida.team_adv,
                    partida.gols_pro + " × " + partida.gols_sofrido,
                    resultado,
                    partida.pontos,
                    partida.gols_pro
                ];

                var linha = corpo.insertRow();

                for (var j = 0; j < valores.length; j++) {
                    linha.insertCell().textContent = valores[j];
                }
            }
        })
        .catch(function () {
            mensagemHistorico.textContent = "Não foi possível carregar o histórico.";
        });
}

function sairDaConta() {
    sessionStorage.clear();
}

if (!idUsuario) {
    window.location = "login.html";
} else {
    document.getElementById("gols_pro").oninput = atualizarResultado;
    document.getElementById("gols_sofrido").oninput = atualizarResultado;
    atualizarResultado();

    CarregarTime().catch(function () {
        mensagemTime.textContent = "Não foi possível carregar o time.";
    });

    carregarHistorico();
}