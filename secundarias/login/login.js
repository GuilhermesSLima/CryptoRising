// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA2NiyJpxz9SJQb5sO6cIns7bsk_7JJQ2s",
    authDomain: "cryptorisinge.firebaseapp.com",
    projectId: "cryptorisinge",
    storageBucket: "cryptorisinge.appspot.com",
    messagingSenderId: "381416354910",
    appId: "1:381416354910:web:d1fbd32daff769fe1cb0cf",
    measurementId: "G-Q7BV6RP4LM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); // Inicializando o Firestore

document.addEventListener("DOMContentLoaded", function() {
    // Função para alternar o menu
    window.alternarMenu = function() {
        var menuNavegacao = document.getElementById("menuNavegacao");
        if (menuNavegacao.classList.contains("nav-menu")) {
            menuNavegacao.classList.add("responsive");
        } else {
            menuNavegacao.classList.remove("responsive");
        }
    };

    // Função para mostrar o login
    window.mostrarLogin = function() {
        var formLogin = document.getElementById("formLogin");
        var formRegistro = document.getElementById("formRegistro");
        var botaoLogin = document.getElementById("botaoLogin");
        var botaoRegistro = document.getElementById("botaoRegistro");

        formLogin.style.left = "4px";
        formRegistro.style.right = "-520px";
        botaoLogin.classList.add("white-btn");
        botaoRegistro.classList.remove("white-btn");
        formLogin.style.opacity = 1;
        formRegistro.style.opacity = 0;
    };

    // Função para mostrar o registro
    window.mostrarRegistro = function() {
        var formLogin = document.getElementById("formLogin");
        var formRegistro = document.getElementById("formRegistro");
        var botaoLogin = document.getElementById("botaoLogin");
        var botaoRegistro = document.getElementById("botaoRegistro");

        formLogin.style.left = "-510px";
        formRegistro.style.right = "5px";
        botaoLogin.classList.remove("white-btn");
        botaoRegistro.classList.add("white-btn");
        formLogin.style.opacity = 0;
        formRegistro.style.opacity = 1;
    };

    // Inicializar menu e mostrar login por padrão
    alternarMenu();
    mostrarLogin();
});

// Função de submissão de registro
document.getElementById('submitCadastro').addEventListener("click", function(event) {
    event.preventDefault();

    // Obter valores dos inputs
    const nome = document.getElementById('nomeCadastro').value;  // Obter o nome do usuário
    const email = document.getElementById('emailCadastro').value;
    const password = document.getElementById('senhaCadastro').value;

    // Criar usuário com email e senha
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Usuário criado
            const user = userCredential.user;

            // Salvar o nome e email do usuário no Firestore
            return setDoc(doc(db, "users", user.uid), {
                nome: nome,
                email: email
            });
        })
        .then(() => {
            alert("Conta criada com sucesso!");
            window.location.href = 'login.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert("Erro: " + errorMessage);
            console.error("Erro ao criar conta:", errorCode, errorMessage);
        });
});

// Função de submissão de login
document.getElementById('submit').addEventListener("click", function(event) {
    event.preventDefault();

    // Obter valores dos inputs
    const email = document.getElementById('emailLogin').value;
    const password = document.getElementById('senhaLogin').value;

    // Fazer login com email e senha
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Login bem-sucedido
            const user = userCredential.user;
            window.location.href = '../../pdlogin.html'; // Redirecionar para a página inicial
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert("Erro: " + errorMessage);
            console.error("Erro ao fazer login:", errorCode, errorMessage);
        });
});

// Função para recuperação de senha
window.recuperarSenha = function() {
    const email = prompt("Por favor, insira o seu email para recuperação de senha:");

    if (email) {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("Um e-mail de recuperação de senha foi enviado para " + email);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert("Erro ao enviar e-mail de recuperação: " + errorMessage);
                console.error("Erro ao enviar e-mail de recuperação:", errorCode, errorMessage);
            });
    } else {
        alert("Por favor, insira um endereço de e-mail válido.");
    }
};
