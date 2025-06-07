function loadingTemplate() {
  return `<div class="loadingoverlay">
  <dotlottie-player id="myLottie"
  src="https://lottie.host/5a7fef23-9622-4031-b761-9b681e4aa963/pDZJWOPmuY.lottie"
  background="transparent"
  speed="2"
  style="width: 300px; height: 300px"
  loop
  autoplay>
  </dotlottie-player>
  </div>
  <h1>Page loading...</h1>`

}

function pokemonRenderTemplate(data) {
  let html = "";

  for (let index = 0; index < data.length; index++) {
    let p = data[index];
    let typesHtml = p.type.map(t => {
      let typeName = t.type.name;
      let iconUrl = `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${typeName}.svg`;
      return `<img src="${iconUrl}" alt="${typeName}" title="${typeName}" style="width: 24px; height: 24px; margin-right: 4px; filter: drop-shadow(0 0 2px rgba(0,0,0,0.4));">`;
    }).join("");

   html += `
  <div class="pokecard" onclick='renderPokeStats(${JSON.stringify(p)})' style="border-color: ${p.color};">
    <div>
      <h1>${p.name}</h1>
      <img class="images" src="${p.image}" alt="${p.name}" />
      <h3>Type: ${typesHtml}</h3>
    </div>
  </div>
`;
  }

  return html;
}

function renderPokeStats(p){
  let statsRender = document.getElementById("statsrender");
  statsRender.innerHTML = `<div class="overlaystats" onclick="closeStatsRender()" id="overlayrenderid">
                            <div class="statsrender">
                            <h1>${p.name}</h1>
                            <p>Abilities: ${p.abilities.map(a => a.ability.name).join(", ")}</p>
                            </div>                          
  </div>`
}