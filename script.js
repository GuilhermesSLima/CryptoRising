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
        console.log(data.slice(0,5))

         if (data && data['rank']) {
            console.log('Rank:', data.rank);
        } else {
            console.log('Não foi encontrado o rank');
        }
    })
}
