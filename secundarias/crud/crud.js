// Configuração do Firebase
var firebaseConfig = {
    apiKey: "AIzaSyA2NiyJpxz9SJQb5sO6cIns7bsk_7JJQ2s",
    authDomain: "cryptorisinge.firebaseapp.com",
    projectId: "cryptorisinge",
    storageBucket: "cryptorisinge.appspot.com",
    messagingSenderId: "381416354910",
    appId: "1:381416354910:web:d1fbd32daff769fe1cb0cf",
    measurementId: "G-Q7BV6RP4LM"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var database = firebase.database(); // Adiciona o Realtime Database

// Armazena as criptomoedas do usuário na memória
let userCryptos = [];

// Verificar o estado de autenticação do usuário
auth.onAuthStateChanged(function(user) {
    if (user) {
        document.getElementById("perfilUsuario").style.display = "block";
        document.getElementById('emailAtual').value = user.email;

        if (user.photoURL) {
            document.getElementById('profilePic').src = user.photoURL;
        } else {
            document.getElementById('profilePic').src = '/src/images/user-black.png'; // Imagem padrão
        }

        // Carregar as criptomoedas do usuário no Firebase
        const userId = user.uid;
        database.ref('users/' + userId + '/cryptos').once('value')
            .then(snapshot => {
                const cryptos = snapshot.val();
                if (cryptos) {
                    userCryptos = cryptos;
                    displayCryptos();
                }
            })
            .catch(error => {
                console.error('Erro ao carregar criptomoedas: ', error);
            });
    } else {
        alert("Você precisa estar logado para acessar essa página.");
        window.location.href = '../login/login.html';
    }
});

// Função para buscar criptomoeda na API CoinPaprika
document.getElementById('btnSearch').addEventListener('click', function() {
    const searchCrypto = document.getElementById('searchCrypto').value.trim();

    fetch(`https://api.coinpaprika.com/v1/coins`)
        .then(response => response.json())
        .then(coins => {
            const filteredCoin = coins.find(coin => coin.name.toLowerCase() === searchCrypto.toLowerCase() || coin.symbol.toLowerCase() === searchCrypto.toLowerCase());
            if (filteredCoin) {
                return fetch(`https://api.coinpaprika.com/v1/tickers/${filteredCoin.id}`);
            } else {
                throw new Error("Criptomoeda não encontrada.");
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.quotes && data.quotes.USD) {
                return fetch(`https://api.coinpaprika.com/v1/coins/${data.id}`)
                    .then(response => response.json())
                    .then(coinData => {
                        const cryptoData = {
                            id: data.id,
                            name: data.name,
                            price: data.quotes.USD.price,
                            image: coinData.logo || 'default-image-url',
                        };
                        const quantity = prompt('Quantos dessa moeda você tem?');
                        if (quantity && !isNaN(quantity)) {
                            cryptoData.quantity = parseFloat(quantity); // Permitir decimal
                            userCryptos.push(cryptoData);
                            displayCryptos();
                            saveCryptosToFirebase(); // Salvar no Firebase
                        } else {
                            alert("Por favor, insira uma quantidade válida.");
                        }
                    });
            } else {
                throw new Error("Dados de preço da criptomoeda não encontrados.");
            }
        })
        .catch(error => alert(error.message));
});

// Função para exibir criptomoedas
async function displayCryptos() {
    const cryptoList = document.getElementById('cryptoList');
    cryptoList.innerHTML = '';

    const exchangeRate = await getExchangeRate(); // Obtém a taxa de câmbio

    userCryptos.forEach((crypto, index) => {
        const totalValue = (crypto.price * exchangeRate * crypto.quantity).toFixed(2); // Cálculo correto
        const cryptoItem = document.createElement('div');
        cryptoItem.className = 'cryptoItem';
        cryptoItem.innerHTML = `
            <img src="${crypto.image}" alt="${crypto.name}">
            <div>
                <strong>${crypto.name}</strong> - R$ ${totalValue} <br>
                <span>(Qnt: ${crypto.quantity})</span>
            </div>
            <div class="btn-group-vertical">
                <button onclick="updateQuantity(${index})" class="btn btn-link btn-sm">
                    <i class="bi bi-pencil"></i>
                </button>
                <button onclick="deleteCrypto(${index})" class="btn btn-trash btn-sm">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        cryptoList.appendChild(cryptoItem);
    });
}

// Função para obter a taxa de câmbio USD para BRL
async function getExchangeRate() {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    return data.rates.BRL; // Retorna a taxa de câmbio
}

// Função para atualizar a quantidade
function updateQuantity(index) {
    const newQuantity = prompt("Insira a nova quantidade para " + userCryptos[index].name + ":");
    if (newQuantity && !isNaN(newQuantity)) {
        userCryptos[index].quantity = parseFloat(newQuantity); // Permitir decimal
        displayCryptos();
        saveCryptosToFirebase(); // Salvar no Firebase
    } else {
        alert("Por favor, insira uma quantidade válida.");
    }
}

// Função para deletar criptomoeda
function deleteCrypto(index) {
    userCryptos.splice(index, 1);
    displayCryptos();
    saveCryptosToFirebase(); // Salvar no Firebase
}

// Função para salvar criptomoedas no Firebase
function saveCryptosToFirebase() {
    const userId = auth.currentUser.uid;
    database.ref('users/' + userId + '/cryptos').set(userCryptos)
        .then(() => console.log('Criptomoedas salvas com sucesso!'))
        .catch(error => console.error('Erro ao salvar as criptomoedas: ', error));
}

// Logout
document.getElementById('btnLogout').addEventListener('click', function() {
    auth.signOut().then(function() {
        alert("Logout realizado com sucesso.");
        window.location.href = '../login/login.html';
    }).catch(function(error) {
        alert("Erro ao realizar logout: " + error.message);
    });
});

// Função para redirecionar
document.getElementById('btnVoltar').addEventListener('click', function() {
    window.location.href = '../../pdlogin.html';
});
