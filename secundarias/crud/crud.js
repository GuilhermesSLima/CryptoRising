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
document.getElementById('btnAtualizar').addEventListener("click", function() {
    const novoEmail = document.getElementById('novoEmail').value;
    const user = auth.currentUser;

    if (user) {
        const currentPassword = prompt("Por favor, digite sua senha atual para reautenticação:");

        if (currentPassword) {
            const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);

            // Reautenticar o usuário com a senha atual
            user.reauthenticateWithCredential(credential).then(() => {
                // Verificar se o novo e-mail é válido
                if (novoEmail !== "" && novoEmail !== user.email) {
                    // Enviar verificação para o novo e-mail
                    user.updateEmail(novoEmail).then(() => {
                        user.sendEmailVerification().then(() => {
                            alert("Um e-mail de verificação foi enviado para " + novoEmail + ". Verifique sua caixa de entrada.");

                            // Desconectar o usuário após o envio do e-mail de verificação
                            auth.signOut().then(() => {
                                alert("Você foi desconectado. Faça login novamente após verificar o novo e-mail.");
                                window.location.href = '../login/login.html'; // Redireciona para a página de login
                            });
                        }).catch((error) => {
                            alert("Erro ao enviar o e-mail de verificação: " + error.message);
                        });
                    }).catch((error) => {
                        if (error.code === 'auth/email-already-in-use') {
                            alert("O email inserido já está em uso por outra conta.");
                        } else if (error.code === 'auth/invalid-email') {
                            alert("O email inserido é inválido.");
                        } else if (error.code === 'auth/requires-recent-login') {
                            alert("A reautenticação é necessária para atualizar o email.");
                        } else {
                            alert("Erro ao atualizar o email: " + error.message);
                        }
                    });
                } else {
                    alert("Insira um novo e-mail diferente do atual.");
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
    } else {
        alert("Usuário não autenticado. Faça login e tente novamente.");
    }
});


// Função para deletar a conta do usuário
document.getElementById('btnDeletarConta').addEventListener("click", function() {
    const confirmacao = confirm("Tem certeza que deseja deletar sua conta? Esta ação é irreversível.");
    
    if (confirmacao) {
        const user = auth.currentUser;

        if (user) {
            // Reautenticar o usuário antes de deletar
            const currentPassword = prompt("Por favor, digite sua senha atual para confirmar a deleção:");

            if (currentPassword) {
                const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);

                user.reauthenticateWithCredential(credential).then(() => {
                    // Deletar a conta
                    user.delete().then(() => {
                        alert("Conta deletada com sucesso!");
                        // Atualizar o DOM
                        document.getElementById('perfilUsuario').style.display = "none"; // Esconder o perfil do usuário
                        window.location.href = '../../index.html'; // Redirecionar após deletar
                    }).catch((error) => {
                        alert("Erro ao deletar conta: " + error.message);
                    });
                }).catch((error) => {
                    alert("Erro na reautenticação: " + error.message);
                });
            } else {
                alert("Senha atual não fornecida. A deleção não pode ser realizada.");
            }
        } else {
            alert("Usuário não autenticado.");
        }
    } else {
        alert("Ação cancelada.");
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
