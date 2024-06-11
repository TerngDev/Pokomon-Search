const searchBox = document.querySelector(".search-box")
const button = document.querySelector('#searchButton')
const toCheckIfHover = document.getElementById("searchButton");
const resultContainer = document.querySelector('.container-result')
var audio = new Audio('soundtrack/Pokemon.mp3');
const selecType = document.getElementById('type')
const errorContext = document.querySelector('.error-context');

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
let allTypes = [];
let allPokemonData = {};

async function fetchAllPokemon() {
    try {
        let res = await fetch(`https://pokeapi.co/api/v2/pokemon/?limit=1000`)
        let data = await res.json();
        allPokemon = data.results;

        const promises = allPokemon.map(async (pokemon) => {
            const response = await fetch(pokemon.url);
            const pokemonData = await response.json();

            const speciesResponse = await fetch(pokemonData.species.url);
            const speciesData = await speciesResponse.json();

            pokemonData.habitat = speciesData.habitat ? speciesData.habitat.name : "Unknown"

            allPokemonData[pokemon.name] = pokemonData;
        });
        await Promise.all(promises);
        console.log(Object.values(allPokemonData));
        displayPokemon(Object.values(allPokemonData));

    } catch (error) {
        console.error("Error Fetching Pokemon list:", error)
    }
}
async function fetchAllType() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/type');
        const data = await response.json();
        allTypes = data.results;
        populateTypeDropdown(allTypes);
    } catch (error) {
        console.error("Error Fetching Pokemon Type:", error)
    }
}


function populateTypeDropdown(types) {
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type.name;
        option.textContent = type.name.charAt(0).toUpperCase() + type.name.slice(1);
        selecType.appendChild(option);
    });
}

fetchAllType();
fetchAllPokemon();

searchBox.addEventListener("submit", (event) => {
    event.preventDefault()
    filterPokemon()
});

async function filterPokemon() {
    const query = searchBox.input.value.toLowerCase()
    const typeSelect = selecType.value;
    resultContainer.innerHTML = '';
    errorContext.style.display = 'none';

    let filteredPokemon = Object.values(allPokemonData);

    if (query.length > 0 && filteredPokemon.length >= 1) {
        filteredPokemon = filteredPokemon.filter(pokemon => pokemon.name.includes(query));
    }

    if (typeSelect !== 'all') {

        console.log('Selected type:', typeSelect);
        console.log('Filtered Pokemon before type filtering:', filteredPokemon);
        filteredPokemon = filteredPokemon.filter(pokemon => {
            if (!pokemon.types) {
                console.error('Pokemon types not defined for:', pokemon.name);
                return false;
            }
            return pokemon.types.some(typeInfo => typeInfo.type.name === typeSelect);
        });
        console.log('Filtered Pokemon after type filtering:', filteredPokemon);
    }

    if (!filteredPokemon || filteredPokemon.length === 0) {
        errorContext.style.display = 'block';
        return;
    }
    displayPokemon(filteredPokemon)
}

async function displayPokemon(pokemonList) {
    resultContainer.innerHTML = '';


    pokemonList.forEach(pokemon => {
        const pokemonElement = document.createElement('div');
        pokemonElement.classList.add('result');

        const filteredStats = pokemon.stats.filter(statInfo =>
            statInfo.stat.name !== 'special-attack' &&
            statInfo.stat.name !== 'special-defense')

        const statsHtml = filteredStats.map(statInfo => {
            return `
                    <div class="stat">
                        <span>${statInfo.stat.name.charAt(0).toUpperCase() + statInfo.stat.name.slice(1)}:</span>
                        <div class="stat-bar">
                            <div class="stat-bar-inner" data-value="${statInfo.base_stat}">
                            </div>
                        </div>
                    </div>
                `;
        }).join('');



        document.querySelector('.container-result').style.display = 'flex'
        document.querySelector('.error-context').style.display = 'none'
        pokemonElement.innerHTML = `
            <h5 class="id-pokemon">#${pokemon.id}</h5>
          <img src="${pokemon.sprites.front_default}" class="pokemon-pic">
            <h2>${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</h2>
            <h5>Type: ${pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</h5 >
            <h5>Location: ${pokemon.habitat}</h5>
            <div class="stats">${statsHtml}</div>
                </div>`



        resultContainer.appendChild(pokemonElement);
    });
    animateStats();
};

function animateStats() {
    const statBars = document.querySelectorAll('.stat-bar-inner');
    statBars.forEach(bar => {
        const value = bar.getAttribute('data-value');
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = value + '%';
        }, 100);
    });
}











