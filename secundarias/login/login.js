function alternarMenu() {
    var menuNavegacao = document.getElementById("menuNavegacao");

    if (menuNavegacao.className === "nav-menu") {
        menuNavegacao.className += " responsive";
    } else {
        menuNavegacao.className = "nav-menu";
    }
}

var botaoLogin = document.getElementById("botaoLogin");
var botaoRegistro = document.getElementById("botaoRegistro");
var formLogin = document.getElementById("formLogin");
var formRegistro = document.getElementById("formRegistro");

function mostrarLogin() {
    formLogin.style.left = "4px";
    formRegistro.style.right = "-520px";
    botaoLogin.className += " white-btn";
    botaoRegistro.className = "btn";
    formLogin.style.opacity = 1;
    formRegistro.style.opacity = 0;
}

function mostrarRegistro() {
    formLogin.style.left = "-510px";
    formRegistro.style.right = "5px";
    botaoLogin.className = "btn";
    botaoRegistro.className += " white-btn";
    formLogin.style.opacity = 0;
    formRegistro.style.opacity = 1;
}
