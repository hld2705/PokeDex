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

const POKEMON_LIMIT = 10;

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
  let buttonRender = document.getElementById("buttonmore");
  buttonRender.innerHTML = renderButtonMoreTemplate();
  let loadMoreBtn = document.getElementById("loadmorepokemons");
  loadMoreBtn.onclick = loadMorePokemons;
}

async function loadingScreen() {
  let loadingscreen = document.getElementById("loadingscreen");
  loadingscreen.innerHTML = loadingTemplate();
  await new Promise(resolve => setTimeout(resolve, 2000));
  loadingscreen.innerHTML = "";
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
  const input = document.getElementById("searchInput");
  const suggestionsList = document.getElementById("suggestionsList");
  const button = document.getElementById("button-addon2");

  input.addEventListener("input", () => handleInput(input, suggestionsList));
  button.addEventListener("click", () => handleSearch(input.value.trim()));
  document.addEventListener("click", (e) => handleClickOutside(e, input, suggestionsList));
}

function handleInput(input, suggestionsList) {
  const search = input.value.toLowerCase();
  suggestionsList.innerHTML = "";
  if (!search) {
    renderPokemons(pokemonArray);
    document.getElementById("buttonmore").innerHTML = '';
    return;}
  const matches = pokemonArray.filter(p =>
    p.name.toLowerCase().includes(search));
  renderSuggestions(matches.slice(0, 5), input, suggestionsList);
}

function renderSuggestions(matches, input, suggestionsList) {
  matches.forEach(match => {
    const li = document.createElement("li");
    li.className = "list-group-item list-group-item-action";
    li.textContent = match.name;
    li.onclick = () => {
      input.value = match.name;
      suggestionsList.innerHTML = "";
    };
    suggestionsList.appendChild(li);
  });
}

function handleSearch(searchName) {
  const result = pokemonArray.find(p => p.name.toLowerCase() === searchName);
  const speciesRender = document.getElementById("speciesrender");
  const buttonMore = document.getElementById("buttonmore");

  if (result) {
    speciesRender.innerHTML = pokemonRenderTemplate([result]);
  } else {
    speciesRender.innerHTML = `<h3>No Pokémon found.</h3>`;
  }
  buttonMore.innerHTML = "";
}

function handleClickOutside(e, input, suggestionsList) {
  if (!suggestionsList.contains(e.target) && e.target !== input) {
    suggestionsList.innerHTML = "";
  }
}

function pokemonRenderTemplate(data) {
  return data.map(p => {
    const types = p.type.map(t => {
      const name = t.type.name;
      return `<img src="https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${name}.svg" alt="${name}" title="${name}" style="width:24px;height:24px;margin-right:4px;filter:drop-shadow(0 0 2px rgba(0,0,0,0.4));">`;
    }).join("");
    return pokemonCardTemplateTemplate(p, types);
  }).join("");
}

async function loadMorePokemons() {
  loadingScreen();
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${currentPokemonIndex}&limit=10`;
  let response = await fetch(url);
  let data = (await response.json()).results;

  if (data.length === 0) {
    document.getElementById("loadmorepokemons").style.display = "none";
    return;
  }
  await pokemonLoad(data);
  renderPokemons(pokemonArray);
  currentPokemonIndex += 10;
}