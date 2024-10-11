window.onload = loadChartData;

const url = 'https://api.coinpaprika.com/v1/';
let pAntes = window.scrollY;
let chart; // Variável global para armazenar o gráfico

window.onscroll = function () {
    let pDepois = window.scrollY;
    let navbar = document.querySelector("header");

    if (pAntes > pDepois) {
        navbar.style.top = "0";
    } else {
        navbar.style.top = "-100px";
    }
    pAntes = pDepois;
};

function loadChartData() {
    fetch('get_crypto_data.php') // Faz requisição ao arquivo PHP
        .then(response => response.json())
        .then(data => {
            const coinNames = [...new Set(data.map(item => item.nome))]; // Extrai os nomes únicos das moedas
            coinNames.forEach(coinName => {
                const coinData = data.filter(item => item.nome === coinName);
                const labels = coinData.map(item => new Date(item.data_registro).toLocaleDateString());
                const prices = coinData.map(item => item.valor);

                // Exibir o gráfico para cada moeda
                displayChart(coinName, labels, prices);
            });
        })
        .catch(error => console.error('Erro ao carregar dados:', error));
}

function displayChart(coinName, labels, prices) {
    const ctx = document.getElementById('myChart').getContext('2d');

    if (chart) {
        chart.destroy(); // Destrói o gráfico anterior, se houver
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, // Datas (hoje, ontem, dois dias atrás)
            datasets: [{
                label: `Preço de ${coinName}`, // Nome da criptomoeda
                data: prices, // Preços das criptomoedas
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
                fill: true
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false // Iniciar o gráfico a partir do menor valor
                }
            }
        }
    });
}
