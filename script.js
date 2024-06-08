const searchBox = document.querySelector(".search-box")
const button = document.querySelector('#searchButton')
const toCheckIfHover = document.getElementById("searchButton");
const resultContainer = document.querySelector('.container-result')
var audio = new Audio('soundtrack/Pokemon.mp3');

setInterval(function () {
    if (!toCheckIfHover.matches(':hover')) {
        const searchButton = document.getElementById('searchButton');
        searchButton.style.backgroundImage = "url('images/pokeball-closed.png')"
    }
})

document.addEventListener('DOMContentLoaded', () => {
    searchButton.addEventListener('mouseover', () => {
        searchButton.style.backgroundImage = "url('images/pokeball-open.png')";

    })
    searchButton.addEventListener('click', () => {
        searchButton.style.backgroundImage = "url('images/pokeball-fullyopen.png')";
        audio.play();
    });
});

let allPokemon = [];

async function fetchAllPokemon() {
    let res = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=1000`)
    let data = await res.json();
    allPokemon = data.results;
}

fetchAllPokemon();

searchBox.addEventListener("submit", filterAndDisplay);
typeSelect.addEventListener('change', filterAndDisplay);

async function filterAndDisplay(e) {
    e.preventDefault()
    const query = searchBox.input.value.toLowerCase()
    resultContainer.innerHTML = '';


    let filteredPokemon = allPokemon;

    if (query.length === 0) {

    }
    if (query.length > 0 && filteredPokemon.length >= 1) {
        filteredPokemon = filteredPokemon.filter(pokemon => pokemon.name.includes(query));
    }
    if (filteredPokemon.length === 0) {
        const error = document.querySelector('.error-context');
        error.style.display = 'block';
    }
    filteredPokemon.forEach(async (pokemon) => {
        const response = await fetch(pokemon.url);

        const pokemonData = await response.json();
        const pokemonElement = document.createElement('div');

        pokemonElement.classList.add('result');
        document.querySelector('.container-result').style.display = 'flex'
        document.querySelector('.error-context').style.display = 'none'
        pokemonElement.innerHTML = `
          <img src="${pokemonData.sprites.front_default}" class="pokemon-pic">
            <h2>${pokemonData.name[0].toUpperCase() + pokemonData.name.slice(1)}</h2>
            <h5>${pokemonData.types.map(typeInfo => typeInfo.type.name).join(', ')}</h5>`

        document.querySelector('.container-result').appendChild(pokemonElement);


    })
}



















