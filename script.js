window.onload = paprikaApi;

const url = 'https://api.coinpaprika.com/v1/';
let pAntes = window.scrollY;

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
    const cacheKey = 'cryptoData'; // Chave para armazenar dados no localStorage
    const cacheExpiryKey = 'cryptoDataExpiry'; // Chave para armazenar o timestamp de expiração

    // Verifica se os dados estão no cache e se não expiraram
    const cachedData = localStorage.getItem(cacheKey);
    const cachedExpiry = localStorage.getItem(cacheExpiryKey);
    const now = Date.now();

    if (cachedData && cachedExpiry && now < cachedExpiry) {
        // Dados válidos em cache
        displayData(JSON.parse(cachedData));
    } else {
        // Faz a requisição à API
        fetch(urlFinal)
            .then(response => response.json())
            .then(data => {
                const fetchPromises = data.slice(0, 5).map(coin => {
                    return fetch(`${url}coins/${coin.id}`)
                        .then(response => response.json());
                });

                Promise.all(fetchPromises).then(detailsArray => {
                    detailsArray.sort((a, b) => a.rank - b.rank);
                    
                    // Armazenar dados no localStorage
                    localStorage.setItem(cacheKey, JSON.stringify(detailsArray));
                    localStorage.setItem(cacheExpiryKey, now + 3600000); // Expira em 1 hora

                    displayData(detailsArray);
                }).catch(error => console.error('Erro ao carregar detalhes das moedas:', error));
            })
            .catch(error => console.error('Erro ao buscar dados:', error));
    }
}

function displayData(detailsArray) {
    const list = document.querySelector('.listcoin');
    list.innerHTML = ''; // Limpa a lista

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
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

// Verificar se o usuário está autenticado
onAuthStateChanged(auth, (user) => {
    if (user) {
        const userRef = doc(db, "users", user.uid);
        getDoc(userRef).then((docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data();
                document.getElementById('userName').innerText = userData.nome; // Exibir o nome do usuário
            } else {
                console.log("Nenhum dado de usuário encontrado!");
            }
        }).catch((error) => {
            console.error("Erro ao buscar dados do usuário:", error);
        });
    } else {
        // Usuário não está autenticado
        window.location.href = 'login.html'; // Redirecionar para a página de login
    }
});
