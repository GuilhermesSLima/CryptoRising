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

// Intervalo para verificar se o valor deve ser apagado (3 dias em milissegundos)
const threeDaysInMs = 24 * 60 * 60 * 1000;

// Função para salvar os dados de todas as moedas no banco de dados
function saveCryptoData() {
    // Obter dados reais da API CoinPaprika
    fetch('https://api.coinpaprika.com/v1/tickers')  // Tickers contém os dados de várias criptomoedas
        .then(response => response.json())
        .then(data => {
            // Para cada criptomoeda retornada, vamos salvá-la no banco de dados
            data.forEach(crypto => {
                const moeda = crypto.symbol;  // Ex: BTC, ETH, etc.
                const valor = crypto.quotes.USD.price;  // Valor da moeda em USD

                // Cria os dados para enviar ao PHP
                const dadosMoeda = new URLSearchParams({
                    'moeda': moeda,
                    'valor': valor
                });

                // Enviar para o PHP salvar no banco de dados
                fetch('get_crypto_data.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: dadosMoeda
                })
                .then(response => response.text())
                .then(result => console.log(`Dados de ${moeda} salvos: ${result}`))
                .catch(error => console.error(`Erro ao salvar ${moeda}:`, error));
            });
        })
        .catch(error => console.error('Erro ao obter dados da API:', error));
}

// Função para apagar dados antigos após 3 dias
function deleteOldData() {
    fetch('get_crypto_data.php?delete=true', {
        method: 'GET'
    })
    .then(response => response.text())
    .then(result => console.log('Dados antigos apagados:', result))
    .catch(error => console.error('Erro ao apagar dados antigos:', error));
}

// Executa a função imediatamente para salvar os valores de hoje
saveCryptoData();

// Configura a função para ser executada automaticamente a cada 24 horas (1 dia)
setInterval(saveCryptoData, 24 * 60 * 60 * 1000); // Salva dados diariamente
setInterval(deleteOldData, threeDaysInMs); // Apaga dados antigos a cada 3 dias

// Função para atualizar o gráfico com os dados do banco de dados
function atualizarGrafico() {
    fetch('get_crypto_data.php', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        let moedas = [...new Set(data.map(item => item.moeda))];  // Todas as moedas no banco de dados
        let datasets = moedas.map(moeda => {
            let valoresMoeda = data.filter(item => item.moeda === moeda);
            let labels = valoresMoeda.map(item => item.data);  // Datas no eixo X
            let valores = valoresMoeda.map(item => item.valor);  // Valores no eixo Y

            return {
                label: moeda,  // Nome da moeda no gráfico
                data: valores,
                borderColor: randomColor(),  // Cor aleatória para cada moeda
                borderWidth: 1,
                fill: false
            };
        });

        // Atualizar o gráfico com todas as moedas
        const ctx = document.getElementById('meuGrafico').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: [...new Set(data.map(item => item.data))],  // Datas únicas
                datasets: datasets
            },
            options: {
                scales: {
                    x: { type: 'time', time: { unit: 'day' } },
                    y: { beginAtZero: false }
                }
            }
        });
    })
    .catch(error => console.error('Erro ao atualizar o gráfico:', error));
}

// Função para gerar cores aleatórias para as moedas no gráfico
function randomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, 1)`;
}

// Executa a função imediatamente para salvar os valores de hoje
saveCryptoData();
atualizarGrafico();

// Configura a função para ser executada automaticamente a cada 3 dias
setInterval(saveCryptoData, threeDaysInMs);  // Salva dados a cada 3 dias
