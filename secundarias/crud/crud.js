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
var storage = firebase.storage();

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
            document.getElementById('profilePic').src = '/src/images/user-black.png'; // Defina o caminho da imagem padrão
        }
    } else {
        alert("Você precisa estar logado para acessar essa página.");
        window.location.href = '../login/login.html';
    }
});

// Função para buscar criptomoeda na API CoinPaprika pelo nome
document.getElementById('btnSearch').addEventListener('click', function() {
    const searchCrypto = document.getElementById('searchCrypto').value.trim();

    // Primeiro, buscar a lista de todas as moedas
    fetch(`https://api.coinpaprika.com/v1/coins`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar a lista de criptomoedas.");
            }
            return response.json();
        })
        .then(coins => {
            // Filtrar a moeda pelo nome
            const filteredCoin = coins.find(coin => coin.name.toLowerCase() === searchCrypto.toLowerCase() || coin.symbol.toLowerCase() === searchCrypto.toLowerCase());

            if (filteredCoin) {
                console.log("Moeda encontrada:", filteredCoin); // Debug: moeda encontrada

                // Buscar o preço da moeda usando o endpoint de preços
                return fetch(`https://api.coinpaprika.com/v1/tickers/${filteredCoin.id}`);
            } else {
                throw new Error("Criptomoeda não encontrada.");
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Detalhes da criptomoeda não encontrados.");
            }
            return response.json();
        })
        .then(data => {
            console.log("Detalhes da criptomoeda:", data); // Debug: detalhes da criptomoeda

            // Verifica se 'quotes' e 'USD' estão definidos
            if (data.quotes && data.quotes.USD) {
                // Buscar a imagem da moeda
                return fetch(`https://api.coinpaprika.com/v1/coins/${data.id}`)
                    .then(response => response.json())
                    .then(coinData => {
                        const cryptoData = {
                            id: data.id,
                            name: data.name,
                            price: data.quotes.USD.price, // Acesso correto ao preço
                            image: coinData.logo || 'default-image-url', // Usar a logo da moeda ou uma imagem padrão
                        };

                        console.log("Informações da criptomoeda:", cryptoData); // Exibe informações da moeda

                        const quantity = prompt('Quantos dessa moeda você tem?');
                        if (quantity && !isNaN(quantity)) {
                            cryptoData.quantity = parseInt(quantity);
                            userCryptos.push(cryptoData); // Adiciona a moeda ao array de criptomoedas
                            displayCryptos(); // Atualiza a exibição
                        } else {
                            alert("Por favor, insira uma quantidade válida.");
                        }
                    });
            } else {
                throw new Error("Dados de preço da criptomoeda não encontrados.");
            }
        })
        .catch(error => {
            alert(error.message);
        });
});

// Função para exibir as criptomoedas
function displayCryptos() {
    const cryptoList = document.getElementById('cryptoList');
    cryptoList.innerHTML = ''; // Limpa a lista antes de exibir

    userCryptos.forEach((crypto, index) => {
        const cryptoItem = document.createElement('div');
        cryptoItem.className = 'cryptoItem';
        cryptoItem.innerHTML = `
            <img src="${crypto.image}" alt="${crypto.name}">
            <div>
                <strong>${crypto.name}</strong> - R$ ${(crypto.price * crypto.quantity).toFixed(2)} <br>
                <span>(Qnt: ${crypto.quantity})</span>
            </div>
            <div class="btn-group-vertical"> <!-- Agrupar botões em coluna -->
                <button onclick="updateQuantity(${index})" class="btn btn-link btn-sm">
                    <i class="bi bi-pencil"></i> <!-- Ícone de edição -->
                </button>
                <button onclick="deleteCrypto(${index})" class="btn btn-trash btn-sm">
                    <i class="bi bi-trash"></i> <!-- Ícone de lixeira -->
                </button>
            </div>
        `;
        cryptoList.appendChild(cryptoItem);
    });
}

// Função para atualizar a quantidade da criptomoeda
function updateQuantity(index) {
    const newQuantity = prompt("Insira a nova quantidade para " + userCryptos[index].name + ":");

    if (newQuantity && !isNaN(newQuantity)) {
        userCryptos[index].quantity = parseInt(newQuantity); // Atualiza a quantidade
        displayCryptos(); // Atualiza a exibição
    } else {
        alert("Por favor, insira uma quantidade válida.");
    }
}

// Função para deletar criptomoeda
function deleteCrypto(index) {
    userCryptos.splice(index, 1); // Remove a moeda do array
    displayCryptos(); // Atualiza a exibição
}

// Função para fazer upload da foto de perfil e atualizar no Firebase
var fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', function(event) {
    var file = event.target.files[0];

    if (auth.currentUser) {
        var userId = auth.currentUser.uid;
        var storageRef = storage.ref('profilePictures/' + userId + '.jpg');

        storageRef.put(file).then(function() {
            storageRef.getDownloadURL().then(function(url) {
                auth.currentUser.updateProfile({
                    photoURL: url
                }).then(function() {
                    document.getElementById('profilePic').src = url;
                    alert("Foto de perfil atualizada com sucesso!");
                }).catch(function(error) {
                    alert("Erro ao atualizar o perfil: " + error.message);
                });
            });
        }).catch(function(error) {
            alert("Erro ao enviar a foto: " + error.message);
        });
    }
});

// Função para alterar a senha do usuário
document.getElementById('btnAtualizar').addEventListener('click', function() {
    var novaSenha = document.getElementById('novaSenha').value;
    var user = auth.currentUser;

    if (novaSenha) {
        // Atualizar a senha do usuário
        user.updatePassword(novaSenha).then(function() {
            alert("Senha atualizada com sucesso!");
            // Limpar o campo de nova senha após a atualização
            document.getElementById('novaSenha').value = '';
        }).catch(function(error) {
            alert("Erro ao atualizar a senha: " + error.message);
        });
    } else {
        alert("Por favor, insira uma nova senha.");
    }
});

// Função de logout do usuário
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
