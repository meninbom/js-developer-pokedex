const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

const maxRecords = 151; // Limite para a primeira geração
const limit = 12;
let offset = 0;

/**
 * Converte um objeto Pokémon em um elemento HTML <li>
 * @param {Pokemon} pokemon - Objeto Pokémon
 * @returns {string} - String HTML para o Pokémon
 */
function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type || 'normal'}" aria-label="Pokémon ${pokemon.name}">
            <div class="pokemon-header">
                <span class="name">${pokemon.name}</span>
                <span class="number">#${pokemon.number || '???'}</span>
            </div>

            <ol class="stats">
                <li>Height: ${(pokemon.height / 10) || 0} m</li>
                <li>Weight: ${(pokemon.weight / 10) || 0} kg</li>
                <li>Base XP: ${pokemon.baseExperience || 0}</li>
            </ol>

            <div class="detail">
                <ol class="types">
                    <span class="types-label">Types</span>
                    ${(pokemon.types?.map((type) => `<li class="type ${type}">${type}</li>`) || ['<li class="type normal">normal</li>']).join('')}
                </ol>
                <ol class="abilities">
                    <span class="abilities-label">Abilities</span>
                    ${(pokemon.abilities?.map((ability) => `<li class="ability">${ability}</li>`) || ['<li class="ability">none</li>']).join('')}
                </ol>
                <img src="${pokemon.photo || 'https://via.placeholder.com/96'}" alt="${pokemon.name}" loading="lazy">
            </div>
        </li>
    `;
}

/**
 * Carrega e renderiza Pokémon na lista
 * @param {number} offset - Deslocamento para paginação
 * @param {number} limit - Limite de Pokémon por requisição
 */
function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit)
        .then((pokemons = []) => {
            if (pokemons.length === 0 && offset === 0) {
                pokemonList.innerHTML = '<p class="error">Não foi possível carregar os Pokémon. Tente novamente.</p>';
                return;
            }
            const newHtml = pokemons.map(convertPokemonToLi).join('');
            pokemonList.innerHTML += newHtml;
        })
        .catch((error) => {
            console.error('Erro ao carregar Pokémon:', error);
            pokemonList.innerHTML += '<p class="error">Erro ao carregar os Pokémon. Tente novamente mais tarde.</p>';
        });
}

// Carrega a primeira página de Pokémon
loadPokemonItens(offset, limit);

/**
 * Lida com o clique no botão "Load More"
 */
loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNextPage = offset + limit;

    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);
        loadMoreButton.disabled = true; // Desabilita antes de remover
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');

    function toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    themeToggle.addEventListener('click', toggleTheme);

    let initialTheme = localStorage.getItem('theme');
    if (!initialTheme) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            initialTheme = 'dark';
        } else {
            initialTheme = 'light';
        }
    }

    if (initialTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
});