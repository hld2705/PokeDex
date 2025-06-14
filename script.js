const BASIC_URL = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=9"
const COLOR_MAP = {
  black: "#2c3e50",
  blue: "#2980b9",
  brown: "#8e6e53",
  gray: "#7f8c8d",
  green: "#27ae60",
  pink: "#fd79a8",
  purple: "#9b59b6",
  red: "#e74c3c",
  white: "#ecf0f1",
  yellow: "#f1c40f",
};

let currentPokemonIndex = 0;

let pokemonArray = [];

async function renderFunc(){
    loadingScreen();
    fetchPokemons();
    searchBar();
}

async function fetchPokemons() {
  let response = await fetch(BASIC_URL);
  let responseToJson = await response.json();
  let data = responseToJson.results;
  pokemonLoad(data);
}

async function pokemonLoad(data) {
  for (let index = 0; index < data.length; index++) {
    let pokemon = data[index];
    let details = await fetch(pokemon.url);
    let detailData = await details.json();
    let speciesResponse = await fetch(detailData.species.url);
    let speciesData = await speciesResponse.json();
    let evolutionChainRes = await fetch(speciesData.evolution_chain.url);
    let evolutionChainData = await evolutionChainRes.json();
    let evolutions = await extractEvolutions(evolutionChainData.chain);
    pokemonArray.push(
      {
      name: detailData.name,
      id: detailData.order,
      abilities: detailData.abilities,
      stats: detailData.stats,
      height: detailData.height,
      weight: detailData.weight,
      type: detailData.types,
      base_experience: detailData.base_experience,
      image: detailData.sprites.front_default,
      color: COLOR_MAP[speciesData.color.name] || "#bdc3c7",
      evolution_chain: evolutions
      });
  }
  renderPokemons(pokemonArray);
}

async function extractEvolutions(chain) {
  let evolutions = [];
  while (chain) {
    let name = chain.species.name;
    let urlParts = chain.species.url.split("/");
    let id = urlParts[urlParts.length - 2];
    let image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    evolutions.push({ name, image });
    chain = chain.evolves_to[0];
  }
  return evolutions;
}

async function renderPokemons(data){
  let pokemonRender = document.getElementById("speciesrender");
  await new Promise (resolve => setTimeout(resolve, 2100));
  pokemonRender.innerHTML = pokemonRenderTemplate(data);
}

async function loadingScreen() {
  let loadingscreen = document.getElementById("loadingscreen");
  loadingscreen.innerHTML = loadingTemplate();
  await new Promise(resolve => setTimeout(resolve, 2000));
  loadingscreen.remove();
}

function closeStatsRender(){
  document.getElementById("overlayrenderid").style.display = "none";
}

function navigationPoke(direction) {
  let container = document.getElementById("pokemonContainer");
  if (!container) return;
  const currentPokemonName = container.querySelector('h1').textContent;
  const currentIndex = pokemonArray.findIndex(pokemon => pokemon.name === currentPokemonName);
  let nextIndex;
  if (direction === "right") {
    nextIndex = (currentIndex + 1) % pokemonArray.length;
  } else {
    nextIndex = (currentIndex - 1 + pokemonArray.length) % pokemonArray.length;
  }
  container.style.transition = "transform 0.3s ease";
  container.style.transform = direction === "right" ? "translateX(-100%)" : "translateX(100%)";
  setTimeout(() => {
    renderPokeStats(pokemonArray[nextIndex]);
    container.style.transition = "none";
    container.style.transform = "translateX(0)";
  }, 300);
}

function searchBar() {
    const searchInput = document.querySelector('.form-control');
    const searchButton = document.getElementById('button-addon2');
    const autocompleteContainer = document.createElement('div');
    autocompleteContainer.className = 'autocomplete-container';
    searchInput.parentElement.appendChild(autocompleteContainer);
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        searchPokemon(searchTerm);
        autocompleteContainer.style.display = 'none';
    });
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase().trim();
        if (!searchTerm) {
            autocompleteContainer.style.display = 'none';
            renderPokemons(pokemonArray);
            return;
        }
        const matches = pokemonArray.filter(pokemon => 
            pokemon.name.toLowerCase().includes(searchTerm)
        );
        if (matches.length > 0) {
            autocompleteContainer.innerHTML = matches
                .map(pokemon => `
                    <div class="autocomplete-item" onclick="selectPokemon('${pokemon.name}')">
                        ${pokemon.name}
                    </div>
                `)
                .join('');
            autocompleteContainer.style.display = 'block';
        } else {
            autocompleteContainer.style.display = 'none';
        }
        const filteredPokemon = pokemonArray.filter(pokemon => 
            pokemon.name.toLowerCase().includes(searchTerm) ||
            pokemon.type.some(type => type.type.name.toLowerCase().includes(searchTerm))
        );
        if (filteredPokemon.length === 0) {
            const pokemonRender = document.getElementById("speciesrender");
            pokemonRender.innerHTML = `
                <div class="pokecard" style="width: 100%; text-align: center;">
                    <h2>No Pokemon found matching "${searchTerm}"</h2>
                    <p>Try searching by name or type</p>
                </div>
            `;
        } else {
            renderPokemons(filteredPokemon);
        }
    });
    document.addEventListener('click', (event) => {
        if (!searchInput.contains(event.target) && !autocompleteContainer.contains(event.target)) {
            autocompleteContainer.style.display = 'none';
        }
    });
}

function selectPokemon(pokemonName) {
    const searchInput = document.querySelector('.form-control');
    searchInput.value = pokemonName;
    searchPokemon(pokemonName);
    document.querySelector('.autocomplete-container').style.display = 'none';
}

function searchPokemon(searchTerm) {
    if (!searchTerm) {
        renderPokemons(pokemonArray);
        return;
    }

    const filteredPokemon = pokemonArray.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm) ||
        pokemon.type.some(type => type.type.name.toLowerCase().includes(searchTerm))
    );

    if (filteredPokemon.length === 0) {
        const pokemonRender = document.getElementById("speciesrender");
        pokemonRender.innerHTML = `
            <div class="pokecard" style="width: 100%; text-align: center;">
                <h2>No Pokemon found matching "${searchTerm}"</h2>
                <p>Try searching by name or type</p>
            </div>
        `;
    } else {
        renderPokemons(filteredPokemon);
    }
}
