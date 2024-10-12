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


        list.appendChild(listItem);
    });
}

fetch('fetch_data.php')
  .then(response => response.json())
  .then(data => {
    const labels = data.map(entry => new Date(entry.date).toLocaleDateString());
    const prices = data.map(entry => entry.price);

    const ctx = document.getElementById('myChart').getContext('2d');
    new chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Preço das Criptomoedas',
          data: prices,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 1
        }]
      }
    });
  });


function saveCryptoData() {
    // Faz uma requisição AJAX ao servidor para salvar os dados no banco
    fetch('salvar_valores.php')
        .then(response => response.text())
        .then(result => console.log(result))  // Exibe a resposta no console
        .catch(error => console.error('Erro ao salvar os dados:', error));
}

// Executa a função imediatamente e depois a cada 5 minutos
saveCryptoData();
setInterval(saveCryptoData, 5 * 60 * 1000);  // 5 minutos
