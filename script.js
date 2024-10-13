window.onload = paprikaApi;

const url = 'https://api.coinpaprika.com/v1/';
let pAntes = window.scrollY;
let chart; // Variável para armazenar o gráfico

window.onscroll = function () {
    let pDepois = window.scrollY;
    let navbar = document.querySelector("header");
    let links = document.querySelector("link")

    if (pAntes > pDepois) {
        navbar.style.top = "0";
        links.style.color = "#fff";
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

    // Ordenar moedas pelo rank antes de exibir
    detailsArray.sort((a, b) => a.rank - b.rank);

    detailsArray.forEach(details => {
        const listItem = document.createElement('li');
        listItem.className = 'moedas';
        listItem.innerHTML = `
            <img src="${details.logo}" alt="${details.name} logo" style="width: 30px; height: 30px;">
            <strong>${details.rank} - ${details.name} (${details.symbol})</strong>
            <p>Última atualização: ${new Date(details.last_data_at).toLocaleDateString()}</p>
        `;

        // Adiciona evento de clique para exibir o gráfico e as informações
        listItem.addEventListener('click', () => loadChart(details.id, details.name));
        list.appendChild(listItem);
    });
}


// Salva os dados no banco e atualiza o gráfico apenas a cada 3 dias (em milissegundos)
const threeDaysInMs = 24 * 60 * 60 * 1000;

function saveCryptoData() {
    fetch('get_crypto_data.php')
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.error('Erro ao salvar os dados:', error));
}

// Executa a função imediatamente e depois a cada 3 dias
saveCryptoData();
setInterval(saveCryptoData, threeDaysInMs); // Atualiza a cada 3 dias


// Assumindo que você terá uma lista de criptomoedas preenchida
document.addEventListener('DOMContentLoaded', () => {
    fetchCoins();
});

// Função para buscar criptomoedas e preencher a lista
function fetchCoins() {
    fetch('get_crypto_data.php') // Um script que você precisará criar para obter todas as moedas
        .then(response => response.json())
        .then(coins => {
            const list = document.querySelector('.listcoin');
            coins.forEach(coin => {
                const li = document.createElement('li');
                li.innerHTML = `${coin.rank} - ${coin.name} (${coin.symbol})`;
                li.setAttribute('data-coin-id', coin.id);
                li.addEventListener('click', () => loadChart(coin.id, coin.name, coin.price, coin.market_cap, coin.percent_change_24h));
                list.appendChild(li);
            });
        });
}
function loadChart(coinId, name) {
    // Atualiza o nome da criptomoeda imediatamente
    document.getElementById('cryptoName').textContent = name;

    // Busca detalhes da criptomoeda na API CoinPaprika
    fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
        .then(response => response.json())
        .then(data => {
            // Atualiza as informações da criptomoeda no card
            document.getElementById('cryptoPrice').textContent = data.quotes.USD.price.toFixed(2) + ' USD';
            document.getElementById('cryptoMarketCap').textContent = data.quotes.USD.market_cap + ' USD';
            document.getElementById('cryptoChange').textContent = data.quotes.USD.percent_change_24h + '%';
        })
        .catch(error => console.error('Erro ao carregar detalhes da moeda:', error));

    // A lógica do gráfico permanece a mesma
    fetch(`get_crypto_data.php?coin_id=${coinId}`)
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('cryptoChart').getContext('2d');
            if (window.chartInstance) {
                window.chartInstance.destroy();
            }
            window.chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Preço',
                        data: data.prices,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fill: false
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: false,
                            ticks: {
                                color: '#fff'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#fff'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: '#fff'
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    let date = new Date(tooltipItem.label);
                                    let formattedDate = date.toLocaleString();
                                    return `Preço: ${tooltipItem.raw} (em ${formattedDate})`;
                                }
                            }
                        }
                    }
                }
            });

            // Exibe o gráfico
            document.getElementById('cryptoChart').style.display = 'block';
        })
        .catch(error => console.error('Erro ao carregar dados do gráfico:', error));
}
