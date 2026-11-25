let idUsuario = sessionStorage.ID_USUARIO;

if (!idUsuario) {
    window.location = "login.html";
} else {
    let nome = sessionStorage.NOME_USUARIO || "jogador";
    document.getElementById("jogador_mvp").textContent = "Olá, " + nome + "!";

    document.querySelector(".Sair a").onclick = function () {
        sessionStorage.clear();
    };

    carregarDashboard();
}

function carregarDashboard() {
    fetch("/partidas/listar/" + idUsuario)
        .then(function (resposta) {
            if (resposta.status === 204) {
                return [];
            }

            if (!resposta.ok) {
                throw new Error("Não foi possível buscar as partidas.");
            }

            return resposta.json();
        })
        .then(function (partidas) {
            preencherDashboard(partidas);
        })
        .catch(function (erro) {
            document.querySelector(".principal > p").textContent =
                "Não foi possível carregar os dados da temporada.";
            console.error(erro);
        });
}

function preencherDashboard(partidas) {
    // A rota do histórico traz a partida mais recente primeiro.
    partidas.reverse();

    let totalPartidas = partidas.length;
    let pontos = 0;
    let gols = 0;
    let vitorias = 0;
    let empates = 0;
    let derrotas = 0;
    let maxGol = 0;
    let partidasDaMelhorMarca = [];
    let rotulos = [];
    let golsPorPartida = [];

    for (let i = 0; i < totalPartidas; i++) {
        let numeroPartida = i + 1;
        let golsDaPartida = Number(partidas[i].gols_pro);
        let pontosDaPartida = Number(partidas[i].pontos);

        rotulos.push(numeroPartida + "ª");
        golsPorPartida.push(golsDaPartida);

        gols += golsDaPartida;
        pontos += pontosDaPartida;

        if (pontosDaPartida === 3) {
            vitorias++;
        } else if (pontosDaPartida === 1) {
            empates++;
        } else if (pontosDaPartida === 0) {
            derrotas++;
        }

        if (golsDaPartida > maxGol) {
            maxGol = golsDaPartida;
            partidasDaMelhorMarca = [];
        }

        if (golsDaPartida === maxGol) {
            partidasDaMelhorMarca.push(numeroPartida);
        }
    }

    let media = 0;
    if (totalPartidas > 0) {
        media = gols / totalPartidas;
    }

    document.getElementById("pts").textContent = pontos;
    document.getElementById("total_pts").textContent = totalPartidas * 3;
    document.getElementById("time_gols").textContent = gols;
    document.getElementById("media_gols").textContent =
        media.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
    document.getElementById("vitorias_time").textContent = vitorias;
    document.getElementById("empates_time").textContent = empates;
    document.getElementById("derrotas_time").textContent = derrotas;
    document.getElementById("total_pt").textContent = totalPartidas;
    document.getElementById("pts_pizza").textContent = pontos;
    document.getElementById("max_gol").textContent = maxGol;
    document.getElementById("pt_marcas").textContent =
        partidasDaMelhorMarca.join(", ") || "—";

    if (totalPartidas === 0) {
        document.querySelector(".principal > p").textContent =
            "Nenhuma partida registrada. Cadastre uma partida no perfil.";
        return;
    }

    new Chart(document.getElementById("gols"), {
        type: "bar",
        data: {
            labels: rotulos,
            datasets: [{
                label: "Gols marcados",
                data: golsPorPartida,
                borderWidth: 2,
                borderColor: "#121212",
                backgroundColor: "#199a5ec3"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, precision: 0 }
                }
            }
        }
    });

    new Chart(document.getElementById("jogos_dash"), {
        type: "doughnut",
        data: {
            labels: ["Vitórias", "Empates", "Derrotas"],
            datasets: [{
                label: "Partidas",
                data: [vitorias, empates, derrotas],
                backgroundColor: ["#199a5ec3", "#d6da01", "#ce0505c9"],
                hoverOffset: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "right", align: "end" }
            },
            cutout: "50%"
        }
    });
}


// Variavel para todos os graficos
// const labels = ['1ª', '2ª', '3ª', '4ª', '5ª', '6ª', '7ª', '8ª'];

// // Grafico colunas para quantidade de gols por jogo
// const ctx_gols = document.getElementById('gols');
// let gol_pro = [2, 1, 0, 3, 2, 2, 1, 3];

// new Chart(ctx_gols, {
//     type: 'bar',
//     data: {
//         labels: labels,
//         datasets: [
//             {
//                 label: 'Saldo de gols',
//                 data: gol_pro,
//                 borderWidth: 2,
//                 borderColor: '#121212',
//                 backgroundColor: '#199a5ec3'
//             }
//         ]
//     },
//     options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         scales: {
//             y: {
//                 beginAtZero: true,
//                 ticks: {
//                     stepSize: 1,
//                     precision: 0
//                 }
//             }
//         }
//     }
// });

// // Variáveis partidas para o gráfico
// const jogos = ['Vitórias', 'Empates', 'Derrotas'];
// const temporada = document.getElementById('jogos_dash');
// let game = [3, 1, 3];

// // Grafico donuts para quantidade de partidas com seu desempenho
// new Chart(temporada, {
//     type: 'doughnut',
//     data: {
//         labels: jogos,
//         datasets: [
//             {
//                 label: 'partidas',
//                 data: game,
//                 backgroundColor: ['#199a5ec3', '#d6da01', '#ce0505c9'],
//                 hoverOffset: 3
//             }
//         ]
//     },
//     options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 position: 'right',
//                 align: 'end'
//             }
//         },
//         cutout: '50%'
//     }
// });