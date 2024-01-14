
const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const pokemonContainer = document.getElementById('pokemonContainer')
const maxRecords = 151;
const limit = 6;
let offset = 0;


function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) => {
            return `
                <li id="pokemon-${pokemon.number}" class="pokemon ${pokemon.type}">
                    <span class="number">#${pokemon.number}</span>
                    <span class="name">${pokemon.name}</span>

                    <div class="detail">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                        </ol>

                        <img src="${pokemon.photo}" alt="${pokemon.name}">
                    </div>
                </li>
            `;
        }).join('');

        pokemonList.innerHTML += newHtml;

        // Adiciona um ouvinte de evento a cada elemento <li> gerado
        pokemons.forEach((pokemon) => {
            const elementId = `pokemon-${pokemon.number}`;
            const listItem = document.getElementById(elementId);

            if (listItem) {
                listItem.addEventListener('click', () => handlePokemonClick(pokemon));
            }
        });
    });
}
// Função chamada quando um Pokémon é clicado
// Função chamada quando um Pokémon é clicado
function handlePokemonClick(pokemon) {
    const mappedVersions = mapVersions(pokemon);
    const bodyContent = generateBodyContent(pokemon, mappedVersions);
    renderContent(bodyContent);
}

function mapVersions(pokemon) {
    const mappedVersions = [];

    for (const generation in pokemon.versions) {
        if (pokemon.versions.hasOwnProperty(generation)) {
            const formattedGeneration = formatGeneration(generation);
            const versionsDetails = mapVersionDetails(pokemon.versions[generation]);

            const formattedGenerationString = `<h3>${formattedGeneration}</h3> 
                <ul>
                    <li>${versionsDetails.join('</li><li>')}</li>
                </ul>`;

            mappedVersions.push(formattedGenerationString);
        }
    }

    return mappedVersions;
}

function formatGeneration(generation) {
    return generation.replace(/-/g, ' ').toUpperCase();
}

function mapVersionDetails(versionDetails) {
    const detailsArray = [];

    for (const version in versionDetails) {
        if (versionDetails.hasOwnProperty(version)) {
            const details = versionDetails[version].details;
            const frontDefaultUrl = versionDetails[version].front_default;

            const versionInfo = details ? `${version}: ${details}` : version;
            detailsArray.push(`
                <table>
                    <thead>
                        <tr>
                            <th>${versionInfo}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><img class="imgGenerations" src="${frontDefaultUrl}" alt="${version} Image"></td>
                        </tr>
                    </tbody>
                </table>`);
        }
    }

    return detailsArray;
}

function generateBodyContent(pokemon, mappedVersions) {
    return `
        <div id="pokemonDetail" class="${pokemon.type}" >
            <h2 class="pokeTitle">${pokemon.name.toUpperCase()}</h2>
            <img class="pokePhoto" src="${pokemon.photo}" alt="${pokemon.name}">
            <div class="pokeDetails">
                <h3>Detalhes</h3>

                <table class="tbDetails">
                    <thead>
                        <tr class="${pokemon.type}">
                            <th>Número:</th>
                            <th>Nome:</th>
                            <th>Altura:</th>
                            <th>Peso</th>
                            <th>Tipo(s):</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="pokeName">#${pokemon.number}</td>
                            <td class="pokeName">${pokemon.name}</td>
                            <td class="pokeHight">${(pokemon.height / 10).toFixed(2)}</td>
                            <td>${(pokemon.weight / 10).toFixed(2)}Kg</td>
                            <td>${pokemon.types.map((type) => `${type}`).join(', ')}</td>
                        </tr>
                    </tbody>
                </table> 
                
                <h3>Status:</h3>
                <table>${pokemon.stats.map(stat => `<tr><td>${stat}</td></tr>`).join('')}</table>
                
                <h3>Movimentos:</h3>
                <ol class="listMoves">${pokemon.moves.map(move => `<li class="listMove">${move.toUpperCase()}</li>`).join('')}</ol>
                
                <table>
                    <thead>
                        <tr>
                            <th>HABILIDADES</th>
                        </tr>
                    </thead>
                    ${pokemon.abilities.map((ability) => `<tr><td>${ability}</td></tr>`).join('')}
                </table>
                
                <h3>GERAÇÕES</h3>
                ${mappedVersions.join('')}
            </div>
            
            <button class="btnReturn ${pokemon.type}" onclick="voltar()"> <i class="material-icons">home</i></button>
        </div>
    `;
}

function renderContent(content) {
    const body = document.body;
    body.innerHTML = content;
}

function voltar() {
    // Redireciona para a página principal ou realiza a ação desejada
    location.reload(); // Atualiza a página, você pode ajustar conforme necessário
}

function voltar() {
    // Redireciona para a página principal ou realiza a ação desejada
    location.reload(); // Atualiza a página, você pode ajustar conforme necessário
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)
        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

