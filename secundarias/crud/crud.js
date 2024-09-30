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
    const currentPassword = prompt("Por favor, digite sua senha atual para reautenticação:");

    if (currentPassword) {
        const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);

        // Reautenticar o usuário com a senha atual
        user.reauthenticateWithCredential(credential).then(() => {
            // Verificar se o email atual está verificado
            if (user.emailVerified) {
                // Verificar se o novo email é válido e diferente do atual
                if (novoEmail !== "" && novoEmail !== user.email) {
                    // Tentar atualizar o email
                    user.updateEmail(novoEmail).then(() => {
                        // Após a atualização do email, enviar email de verificação
                        user.sendEmailVerification().then(() => {
                            alert("Email de verificação enviado para o novo email. Verifique sua caixa de entrada.");
                            document.getElementById('emailAtual').value = novoEmail; // Atualiza o campo com o novo email
                        }).catch((error) => {
                            alert("Erro ao enviar o email de verificação: " + error.message);
                        });
                    }).catch((error) => {
                        if (error.code === 'auth/email-already-in-use') {
                            alert("O email inserido já está em uso por outra conta.");
                        } else if (error.code === 'auth/invalid-email') {
                            alert("O email inserido é inválido.");
                        } else {
                            alert("Erro ao atualizar o email: " + error.message);
                        }
                    });
                }
            } else {
                alert("O email atual precisa ser verificado antes de alterá-lo.");
            }

            // Atualizar a senha
            if (novaSenha !== "") {
                user.updatePassword(novaSenha).then(() => {
                    alert("Senha atualizada com sucesso!");
                }).catch((error) => {
                    alert("Erro ao atualizar a senha: " + error.message);
                });
            }
        }).catch((error) => {
            if (error.code === 'auth/wrong-password') {
                alert("Senha incorreta. Tente novamente.");
            } else {
                alert("Erro na reautenticação: " + error.message);
            }
        });
    } else {
        alert("Senha atual não fornecida. A atualização não pode ser realizada.");
    }
});

// Função para logout do usuário
document.getElementById('btnLogout').addEventListener("click", function() {
    auth.signOut().then(() => {
        // Redirecionar para a página de login ou outra página após o logout
        alert("Logout realizado com sucesso.");
        window.location.href = '../login/login.html'; // Redireciona para a página de login
    }).catch((error) => {
        alert("Erro ao realizar logout: " + error.message);
    });
});


// Função para redirecionar para a página de login
document.getElementById('btnVoltar').addEventListener('click', function() {
    window.location.href = '../../pdlogin.html'; // Redirecionar para a página de login
});
