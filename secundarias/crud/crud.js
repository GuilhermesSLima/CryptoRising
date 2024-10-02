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
var storage = firebase.storage(); // Adiciona o Firebase Storage

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
        loadUserCryptos(user.uid);
    } else {
        alert("Você precisa estar logado para acessar essa página.");
        window.location.href = '../login/login.html';
    }
});

// Função para carregar as criptomoedas do usuário
function loadUserCryptos(userId) {
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
}

// Função para buscar criptomoeda na API CoinPaprika
document.getElementById('btnSearch').addEventListener('click', function() {
    const searchCrypto = document.getElementById('searchCrypto').value.trim();

    fetch(`https://api.coinpaprika.com/v1/coins`)
        .then(response => response.json())
        .then(coins => {
            const filteredCoin = coins.find(coin => coin.name.toLowerCase() === searchCrypto.toLowerCase() || coin.symbol.toLowerCase() === searchCrypto.toLowerCase());
            if (filteredCoin) {
                // Buscar informações detalhadas, incluindo o logo da criptomoeda
                return fetch(`https://api.coinpaprika.com/v1/coins/${filteredCoin.id}`);
            } else {
                throw new Error("Criptomoeda não encontrada.");
            }
        })
        .then(response => response.json())
        .then(coinDetails => {
            // Usar o ID da criptomoeda para buscar dados de preço
            return fetch(`https://api.coinpaprika.com/v1/tickers/${coinDetails.id}`)
                .then(response => response.json())
                .then(tickerData => {
                    if (tickerData.quotes && tickerData.quotes.USD) {
                        const cryptoData = {
                            id: tickerData.id,
                            name: coinDetails.name,
                            price: tickerData.quotes.USD.price,
                            image: coinDetails.logo ? coinDetails.logo : 'default-image-url', // Usar logo da CoinPaprika ou uma imagem padrão
                        };

                        const quantity = prompt('Quantos dessa moeda você tem?');
                        if (quantity && !isNaN(quantity)) {
                            cryptoData.quantity = parseFloat(quantity);
                            userCryptos.push(cryptoData);
                            displayCryptos();
                            saveCryptosToFirebase(); // Salvar no Firebase
                        } else {
                            alert("Por favor, insira uma quantidade válida.");
                        }
                    } else {
                        throw new Error("Dados de preço da criptomoeda não encontrados.");
                    }
                });
        })
        .catch(error => alert(error.message));
});


// Função para exibir criptomoedas
function displayCryptos() {
    const cryptoList = document.getElementById('cryptoList');
    cryptoList.innerHTML = '';

    userCryptos.forEach((crypto, index) => {
        const cryptoItem = document.createElement('div');
        cryptoItem.className = 'cryptoItem';
        const totalValue = (crypto.price * crypto.quantity).toFixed(2); // Cálculo total
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

// Função para atualizar a quantidade
function updateQuantity(index) {
    const newQuantity = prompt("Insira a nova quantidade para " + userCryptos[index].name + ":");
    if (newQuantity && !isNaN(newQuantity)) {
        userCryptos[index].quantity = parseFloat(newQuantity);
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

// Função para deletar a conta do usuário
document.getElementById('btnDeletarConta').addEventListener('click', function() {
    var user = auth.currentUser;

    if (confirm("Você tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.")) {
        user.delete().then(function() {
            alert("Conta deletada com sucesso!");
            window.location.href = '../login/login.html';
        }).catch(function(error) {
            alert("Erro ao deletar a conta: " + error.message);
        });
    }
});

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
