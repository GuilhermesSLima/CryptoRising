window.alternarMenu = function() {
  var menuNavegacao = document.getElementById("menuNavegacao");
  menuNavegacao.classList.toggle("responsive");
};
let pAntes = window.scrollY;

window.onscroll = function () {
    let pDepois = window.scrollY;
    let navbar = document.querySelector("nav");

    if (pAntes > pDepois) {
        navbar.style.top = "0";
    } else {
        navbar.style.top = "-100px";
    }
    pAntes = pDepois;
};