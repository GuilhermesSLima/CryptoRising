window.onload = paprikaApi;

const url = 'https://api.coinpaprika.com/v1/';
let pAntes = window.scrollY;
let chart; // Variável para armazenar o gráfico

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

function paprikaApi() {
    const urlFinal = url + 'coins/';
    const cacheKey = 'cryptoData';
    const cacheExpiryKey = 'cryptoDataExpiry';
    const now = Date.now();

    const cachedData = localStorage.getItem(cacheKey);
    const cachedExpiry = localStorage.getItem(cacheExpiryKey);

    if (cachedData && cachedExpiry && now < cachedExpiry) {
        displayData(JSON.parse(cachedData));
    } else {
        fetch(urlFinal)
            .then(response => response.json())
            .then(data => {
                const fetchPromises = data.slice(0, 5).map(coin => {
                    return fetch(`${url}coins/${coin.id}`)
                        .then(response => response.json());
                });

                Promise.all(fetchPromises).then(detailsArray => {
                    detailsArray.sort((a, b) => a.rank - b.rank);
                    localStorage.setItem(cacheKey, JSON.stringify(detailsArray));
                    localStorage.setItem(cacheExpiryKey, now + 3600000);

                    displayData(detailsArray);
                }).catch(error => console.error('Erro ao carregar detalhes das moedas:', error));
            })
            .catch(error => console.error('Erro ao buscar dados:', error));
    }
}

function displayData(detailsArray) {
    const list = document.querySelector('.listcoin');
    list.innerHTML = '';

    detailsArray.forEach(details => {
        const listItem = document.createElement('li');
        listItem.className = 'moedas';
        listItem.innerHTML = `
            <img src="${details.logo}" alt="${details.name} logo" style="width: 30px; height: 30px;">
            <strong>${details.rank} - ${details.name} (${details.symbol})</strong>
            <p>Última atualização: ${new Date(details.last_data_at).toLocaleString()}</p>
        `;

        // Ao clicar em uma moeda, carregue os dados históricos
        listItem.addEventListener('click', () => loadChartData(details.id, details.name));

        list.appendChild(listItem);
    });
}

function loadChartData(coinId, coinName) {
    const today = new Date();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(today.getDate() - 2);

    const urlHistorical = `${url}coins/${coinId}/ohlcv/historical?start=${twoDaysAgo.toISOString().split('T')[0]}&end=${today.toISOString().split('T')[0]}`;

    fetch(urlHistorical)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Verifica se a resposta é um array válido
            if (!Array.isArray(data)) {
                throw new TypeError('A resposta não é um array.');
            }

            // Extrai as datas e os preços de fechamento
            const labels = data.map(entry => new Date(entry.time_open).toLocaleDateString());
            const prices = data.map(entry => entry.close);

            // Exibe o gráfico com os dados
            displayChart(coinName, labels, prices);
        })
        .catch(error => console.error('Erro ao carregar dados históricos:', error));
}

function displayChart(coinName, labels, prices) {
    const ctx = document.getElementById('myChart').getContext('2d');

    if (chart) {
        chart.destroy(); // Destroi o gráfico anterior, se houver
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, // Datas
            datasets: [{
                label: `Preço de ${coinName}`,
                data: prices, // Preços
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
                fill: true
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}
