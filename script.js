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
let pokemonArray = [];
async function renderFunc(){
    loadingScreen();
    fetchPokemons();
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
      color: COLOR_MAP[speciesData.color.name] || "#bdc3c7"
      });
  }
  console.log(pokemonArray.abilities)
  renderPokemons(pokemonArray);
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