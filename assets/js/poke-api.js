const pokeApi = {};

/**
 * Converte os detalhes de um Pokémon da PokéAPI em um objeto Pokemon
 * @param {Object} pokeDetail - Dados brutos do Pokémon retornados pela API
 * @returns {Pokemon} - Objeto Pokemon formatado
 */
function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon();
    
    pokemon.number = pokeDetail.id || 0;
    pokemon.name = pokeDetail.name || 'Unknown';

    // Valida e mapeia os tipos
    const types = pokeDetail.types?.map((typeSlot) => typeSlot.type.name) || [];
    pokemon.types = types;
    pokemon.type = types[0] || 'normal'; // Tipo padrão se não houver

    // Valida e mapeia as habilidades
    const abilities = pokeDetail.abilities?.map((abilitieSlot) => abilitieSlot.ability.name) || [];
    pokemon.abilities = abilities;
    pokemon.ability = abilities[0] || 'none'; // Habilidade padrão se não houver

    // Atributos básicos com validação
    pokemon.baseExperience = pokeDetail.base_experience ?? 0;
    pokemon.height = pokeDetail.height ?? 0;
    pokemon.weight = pokeDetail.weight ?? 0;
    
    // Valida a existência da imagem
    pokemon.photo = pokeDetail.sprites?.other?.dream_world?.front_default || 
                   pokeDetail.sprites?.front_default || 
                   'https://via.placeholder.com/96'; // Fallback para imagem

    return pokemon;
}

/**
 * Obtém os detalhes de um Pokémon a partir de sua URL
 * @param {Object} pokemon - Objeto com a URL do Pokémon
 * @returns {Promise<Pokemon>} - Objeto Pokemon formatado
 */
pokeApi.getPokemonDetail = async (pokemon) => {
    try {
        const response = await fetch(pokemon.url);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        const pokeDetail = await response.json();
        return convertPokeApiDetailToPokemon(pokeDetail);
    } catch (error) {
        console.error(`Erro ao obter detalhes do Pokémon ${pokemon.name}:`, error);
        // Retorna um Pokémon "vazio" para não quebrar a lista
        const fallbackPokemon = new Pokemon();
        fallbackPokemon.name = pokemon.name || 'Erro';
        fallbackPokemon.photo = 'https://via.placeholder.com/96';
        return fallbackPokemon;
    }
};

/**
 * Obtém uma lista de Pokémon com detalhes da PokéAPI
 * @param {number} offset - Deslocamento para paginação
 * @param {number} limit - Limite de Pokémon por requisição
 * @returns {Promise<Pokemon[]>} - Lista de objetos Pokemon
 */
pokeApi.getPokemons = async (offset = 0, limit = 10) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }
        const jsonBody = await response.json();
        const pokemons = jsonBody.results || [];
        
        // Mapeia as requisições de detalhes e aguarda todas
        const detailRequests = pokemons.map(pokeApi.getPokemonDetail);
        const pokemonsDetails = await Promise.all(detailRequests);
        
        return pokemonsDetails;
    } catch (error) {
        console.error('Erro ao buscar Pokémon:', error);
        // Retorna uma lista vazia para evitar quebra no frontend
        return [];
    }
};