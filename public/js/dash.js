// Variavel para todos os graficos
const labels = ['1ª', '2ª', '3ª', '4ª', '5ª', '6ª', '7ª', '8ª'];

// Grafico colunas para quantidade de gols por jogo 
const ctx_gols = document.getElementById('gols');
let gol_pro = [2, 1, 0, 3, 2, 2, 1, 3];

new Chart(ctx_gols, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: {
            label: 'ctx_gols',
            data: gol_pro,
            borderWidth: 1,
            borderColor: '#244A36',
            backgroundColor: '#244A36'
        }
    }
});