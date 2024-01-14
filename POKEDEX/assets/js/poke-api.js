
const pokeApi = {}


function convertPokemonApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon();

    // Atribuição direta dos atributos
    pokemon.number = pokeDetail.id;
    pokemon.name = pokeDetail.name;
    pokemon.height = pokeDetail.height;
    pokemon.weight = pokeDetail.weight;
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

    // Mapeamento direto dos tipos
    pokemon.types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    pokemon.type = pokemon.types[0]; // Assumindo que o primeiro tipo é o principal

    // Mapeamento direto dos movimentos
    pokemon.moves = pokeDetail.moves.map((moveSlot) => moveSlot.move.name);

    // Mapeamento direto das estatísticas
    pokemon.stats = pokeDetail.stats.map((statsSlot) => {
        const name = statsSlot.stat.name.toUpperCase();
        const base_stat = statsSlot.base_stat;
        return `<thead><tr><th>${name}</th></tr></thead><tbody><tr><td>${base_stat}</td></tr></tbody>`;
    });

    // Mapeamento direto das habilidades
    pokemon.abilities = pokeDetail.abilities.map((abilitySlot) => {
        const ability = abilitySlot.ability.name.toUpperCase();
        return `<tbody><tr><td>${ability}</td></tr></tbody>`;
    });

    // Atribuição direta das versões
    pokemon.versions = pokeDetail.sprites.versions;

    // Adiciona a tag de fechamento para movimentos
    pokemon.moves = pokemon.moves.length ? `<ol class="listMoves">${pokemon.moves.map(move => `<li class="listMove">${move.toUpperCase()}</li>`).join('')}</ol>` : '';

    return pokemon;
}


pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)// Novo fetch com a url do pokemon que estou querendo acessar 
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            return response.json();
        })
        .then((pokeDetail) => {

            if (!pokeDetail) {
                throw new Error('Detalhes do Pokémon não disponíveis');
            }
            return convertPokemonApiDetailToPokemon(pokeDetail);
        });


}

pokeApi.getPokemons = (offset, limit ) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    
    // Se você ainda não tem uma lista, inicialize-a como um array vazio.
    if (!pokeApi.pokemonList) {
        pokeApi.pokemonList = [];
    }

    return fetch(url) // buscando a lista
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            return response.json();
        })
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => {
            // Armazene os Pokémon mais antigos e adicione os novos à lista existente.
            pokeApi.pokemonList = [...pokeApi.pokemonList, ...pokemons];
            
            // Retorne apenas a quantidade desejada de Pokémon, começando do índice 0.
            return pokeApi.pokemonList.slice(0, limit);
        })
        .then((detailRequests) => detailRequests.map(pokeApi.getPokemonDetail))
        .then((detailPromises) => Promise.all(detailPromises))
        .then((pokemonsDetails) => pokemonsDetails)
        .catch((error) => {
            console.error(`Erro ao obter lista de pokémons: ${error.message}`);
            throw error;
        });
};