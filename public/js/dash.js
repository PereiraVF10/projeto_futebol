// Variavel para todos os graficos
const labels = ['1ª', '2ª', '3ª', '4ª', '5ª', '6ª', '7ª', '8ª'];

// Grafico colunas para quantidade de gols por jogo 
const ctx_gols = document.getElementById('gols');
let gol_pro = [2, 1, 0, 3, 2, 2, 1, 3];

new Chart(ctx_gols, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [
            {
                label: 'Saldo de gols',
                data: gol_pro,
                borderWidth: 2,
                borderColor: '#121212',
                backgroundColor: '#199a5ec3'
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    precision: 0 
                }
            }
        }
    }
});

// Variáveis partidas para o gráfico 
const jogos = ['Vitórias', 'Empates', 'Derrotas'];
const temporada = document.getElementById('jogos_dash');
let game = [3, 1, 3];

// Grafico donuts para quantidade de partidas com seu desempenho 
new Chart(temporada, {
    type: 'doughnut',
    data: {
        labels: jogos,
        datasets: [
            {
                label: 'partidas',
                data: game,
                backgroundColor: ['#199a5ec3', '#d6da01', '#ce0505c9'],
                hoverOffset: 3
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                align: 'end'
            }
        },
        cutout: '50%'
    }
});