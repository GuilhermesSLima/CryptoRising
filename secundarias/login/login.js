// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

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

document.addEventListener("DOMContentLoaded", function() {
    // Função para alternar o menu
    window.alternarMenu = function() {
        var menuNavegacao = document.getElementById("menuNavegacao");
        menuNavegacao.classList.toggle("responsive");
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

    // Inicializar o login por padrão
    mostrarLogin();
});

// Evento para capturar Enter e submeter os formulários de Login e Cadastro
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        // Verifica se está no formulário de login
        if (document.getElementById('formLogin').style.opacity == 1) {
            document.getElementById('submit').click();
        }
        // Verifica se está no formulário de registro
        else if (document.getElementById('formRegistro').style.opacity == 1) {
            document.getElementById('submitCadastro').click();
        }
    }
});

// Função de submissão de registro
document.getElementById('submitCadastro').addEventListener("click", function(event) {
    event.preventDefault();

    // Obter valores dos inputs
    const email = document.getElementById('emailCadastro').value;
    const password = document.getElementById('senhaCadastro').value;

    // Criar usuário com email e senha
    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            mostrarLogin();  // Mostra o formulário de login após cadastro
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert("Erro: " + errorMessage);
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
        .then(() => {
            window.location.href = '../../pdlogin.html'; // Redirecionar para a página inicial
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert("Erro: " + errorMessage);
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
                const errorMessage = error.message;
                alert("Erro ao enviar e-mail de recuperação: " + errorMessage);
            });
    } else {
        alert("Por favor, insira um endereço de e-mail válido.");
    }
};