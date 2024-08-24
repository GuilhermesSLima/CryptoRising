let pAntes = window.scrollY;

window.onscroll = function() {
    let pDepois = window.scrollY;
    let navbar = document.querySelector("header");

    if (pAntes > pDepois) {
        navbar.style.top = "0";
    } else {
        navbar.style.top = "-100px"; 
    }
    pAntes = pDepois;
};