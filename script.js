// window.onload = paprikaApi

const apiKey = ''; // Chave da API
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
    let urlFinal = url + 'coins/';
    // const headers = {'Authorization': apiKey}

    fetch(urlFinal).then(response => response.json())
    .then(data => {
        const fetchPromises = data.slice(0, 5).map(coin => {
            // Faz uma nova requisição para detalhes da moeda
            return fetch(`${url}coins/${coin.id}`)
                .then(response => response.json());
        });

        // Aguarda todas as requisições serem completadas
        Promise.all(fetchPromises).then(detailsArray => {
            // Ordena as moedas pelo rank (crescente)
            detailsArray.sort((a, b) => a.rank - b.rank);
            
            const list = document.querySelector('.listcoin');
            list.innerHTML = ''; // Limpa a lista

            // Adiciona as moedas ordenadas à lista
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
        }).catch(error => console.error('Erro ao carregar detalhes das moedas:', error));
    })
    .catch(error => console.error('Erro ao buscar dados:', error));
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
