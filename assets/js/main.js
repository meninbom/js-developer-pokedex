const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
        
        <div class="NN">
        <span class="name">${pokemon.name}</span> 
        <span class="number">#${pokemon.number}</span>
        </div>

        <ol class="stats">
        Height:${pokemon.height}   
        Weight:${pokemon.weight} 
        Experience:${pokemon.baseExperience}</ol>    

        <div class="detail">
        
                <ol class="types">
                <span class="TypesStyle"> Types </span> 
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <ol class="habilidades">
                <span class="Hability"> Abilities </span>
             ${pokemon.abilities.map((ability) => `<li class="habilidade" ${ability}">${ability}</li>`).join('')}
                
            </ol> 
                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})