// Configuração do Firebase
const firebaseConfig = {
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
const auth = firebase.auth();

// Verificar o estado de autenticação do usuário
auth.onAuthStateChanged((user) => {
    if (user) {
        // Usuário autenticado - mostrar a página de perfil
        document.getElementById("perfilUsuario").style.display = "block";
        document.getElementById('emailAtual').value = user.email; // Preencher o campo de email com o email do usuário
    } else {
        // Se o usuário não estiver logado, redirecionar para a página de login
        alert("Você precisa estar logado para acessar essa página.");
        window.location.href = '../login/login.html'; // Redirecionar para a página de login
    }
});

// Atualizar email e senha do usuário
document.getElementById('btnAtualizar').addEventListener("click", function() {
    const novoEmail = document.getElementById('novoEmail').value;
    const novaSenha = document.getElementById('novaSenha').value;
    const user = auth.currentUser;

    // Atualizar o email
    if (novoEmail !== "" && novoEmail !== user.email) {
        user.updateEmail(novoEmail).then(() => {
            alert("Email atualizado com sucesso!");
            document.getElementById('emailAtual').value = novoEmail; // Atualiza o campo com o novo email
        }).catch((error) => {
            alert("Erro ao atualizar o email: " + error.message);
        });
    }

    // Atualizar a senha
    if (novaSenha !== "") {
        user.updatePassword(novaSenha).then(() => {
            alert("Senha atualizada com sucesso!");
        }).catch((error) => {
            alert("Erro ao atualizar a senha: " + error.message);
        });
    }
});

// Deletar a conta do usuário
document.getElementById('btnDeletarConta').addEventListener("click", function() {
    const confirmacao = confirm("Tem certeza que deseja deletar sua conta?");
    
    if (confirmacao) {
        const user = auth.currentUser;
        user.delete().then(() => {
            alert("Conta deletada com sucesso!");
            window.location.href = '../../index.html';    // Redirecionar após deletar
        }).catch((error) => {
            alert("Erro ao deletar conta: " + error.message);
        });
    } else {
        alert("Ação cancelada.");
    }
});

// Função para redirecionar para a página de login
document.getElementById('btnVoltar').addEventListener('click', function() {
    window.location.href = '../../pdlogin.html'; // Redirecionar para a página de login
});