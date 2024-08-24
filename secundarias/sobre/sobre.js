//header
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
//

let deslizador = document.querySelector('.slider .list');
let itens = document.querySelectorAll('.slider .list .item');
let proximo = document.getElementById('next');
let anterior = document.getElementById('prev');
let pontos = document.querySelectorAll('.slider .dots li');

let totalItens = itens.length - 1;
let ativo = 0;
proximo.onclick = function(){
    ativo = ativo + 1 <= totalItens ? ativo + 1 : 0;
    recarregarDeslizador();
}
anterior.onclick = function(){
    ativo = ativo - 1 >= 0 ? ativo - 1 : totalItens;
    recarregarDeslizador();
}
let intervaloAtualizacao = setInterval(()=> {proximo.click()}, 3000);
function recarregarDeslizador(){
    deslizador.style.left = -itens[ativo].offsetLeft + 'px';
    
    let ultimoPontoAtivo = document.querySelector('.slider .dots li.active');
    ultimoPontoAtivo.classList.remove('active');
    pontos[ativo].classList.add('active');

    clearInterval(intervaloAtualizacao);
    intervaloAtualizacao = setInterval(()=> {proximo.click()}, 4000);
}

pontos.forEach((li, chave) => {
    li.addEventListener('click', ()=>{
         ativo = chave;
         recarregarDeslizador();
    })
})
window.onresize = function(evento) {
    evento.reloadSlider();
};


