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
  <div>
  <h1 style="margin-top:20px;">Page loading...</h1>
  </div>
  </div>
  `

}

function renderButtonMoreTemplate() {
  return `<button id="loadmorepokemons" class="btn btn-primary">Load more Pokemons</button>`;
}


function pokemonCardTemplateTemplate(p, types) {
  return `
    <div class="pokecard" onclick='renderPokeStats(${JSON.stringify(p)})' style="border-color:${p.color};">
      <div>
        <h1>${p.name}</h1>
        <img class="images" src="${p.image}" alt="${p.name}" />
        <h3>Type: ${types}</h3>
      </div>
    </div>
  `;
}
function renderPokeStats(p) {
  let statsHtml = p.stats.map(s => `${s.stat.name}: ${s.base_stat}`).join(", ");
  let typesHtml = p.type.map(t => t.type.name).join(", ");
  let evoHTML = p.evolution_chain.map(evo => `
  <div class="evo-box">
    <img src="${evo.image}" alt="${evo.name}">
    <p>${evo.name}</p>
  </div>
`).join('<span class="arrow">→</span>');
  let statsRender = document.getElementById("statsrender");
  statsRender.innerHTML = ` <div class="overlaystats" onclick="closeStatsRender()" id="overlayrenderid">
                            <div id="pokemonContainer">
                            <div class="statsrender" id="navigationdiv" onclick="event.stopPropagation()">
                            <h1>${p.name}</h1>
                            <img class="imagesoverlay" src="${p.image}" alt="${p.name}" />
                            <p><b>Abilities:</b> ${p.abilities.map(a => a.ability.name).join(", ")}</p>
                            <p><b>Stats: </b>${statsHtml}</p>
                            <p><b>Height: </b>${p.height} cm</p>
                            <p><b>Weight: </b> ${p.weight} kg</p>
                            <p><b>Type: </b>${typesHtml}</p>
                            <p><b>Base experience: </b>${p.base_experience}</p>
                            <div class="evolution-chain"><p><strong>Evolution chain:</strong></p>${evoHTML}</div>
                            </div>                          
                            </div>
                            </div>`
  navigatingPokemon()
}

function navigatingPokemon() {
  let navigation = document.getElementById("navigationdiv");
  navigation.innerHTML += `<div style="position: absolute; top: 6px; right: 6px;"><div class="icon x" onclick="closeStatsRender()">
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none"
       xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#1C274C" stroke-width="1.5"/>
    <path d="M14.5 9.5L9.5 14.5M9.5 9.5L14.5 14.5"
          stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
 </div></div>
                          <div class="arrowplacement"><div class="icon arrow" style="--flip: 1;" onclick="navigationPoke('left')" id="arrowleft">
  <svg width="60" height="60" viewBox="0 -9.55 119.78 119.78" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>.cls-1{fill:#ffffff;}</style>
    </defs>
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1-2" data-name="Layer 1">
        <path d="M60.3,78.46c-.31,5-.39,9-.82,12.91-.86,7.85-7.86,11.57-14.92,7.85A63.53,63.53,0,0,1,34.4,92.84Q19.67,81,5.29,68.78C-.35,64-1.3,58.65,1.58,51.82a30.86,30.86,0,0,1,2.19-4.65A302.23,302.23,0,0,1,31.91,9.31a48.7,48.7,0,0,1,7.64-6.84C46-2.3,51.84,0,53.52,7.92a65.45,65.45,0,0,1,.78,7.69c.14,1.66.24,3.33.4,5.53a32.54,32.54,0,0,0,4.39.14c7.11-.83,14.18-2.09,21.3-2.57a246.17,246.17,0,0,1,24.89-.54c7.68.26,11.38,3.91,12.77,11.46a112.58,112.58,0,0,1,1.63,24.8c-.05,1.42-.31,2.84-.49,4.25-1,8.35-5.08,13.81-14,14.64a17.63,17.63,0,0,0-4.09,1.24A65.73,65.73,0,0,1,78.3,78.24C72.6,78.16,66.9,78.37,60.3,78.46ZM43.47,14c-9,5.63-27.46,31.38-32.4,44.91,10.7,9.07,21.55,18.33,32.52,27.45,1.38,1.15,3.39,1.55,5.33,2.4,1.38-4.27.25-8,.35-11.62.13-4.81.95-6.57,5.41-7.27,5-.8,10.21-.76,15.33-1,7.4-.41,14.84-.49,22.2-1.28a39.24,39.24,0,0,0,16.08-5c2.55-12.13,1.56-25-2.65-33.79-4.31-1.14-8.87-1.08-13.42-.95-10.86.31-21.7.61-32.42,2.73-5.51,1.09-10.8.41-15.4-3.89C44.12,22.77,43.83,18.81,43.47,14Z"/>
        <path class="cls-1" d="M43.47,14c.36,4.86.65,8.82.93,12.64,4.6,4.3,9.89,5,15.4,3.89,10.72-2.12,21.56-2.42,32.42-2.73,4.55-.13,9.11-.19,13.42.95,4.21,8.83,5.2,21.66,2.65,33.79a39.24,39.24,0,0,1-16.08,5c-7.36.79-14.8.87-22.2,1.28-5.12.29-10.29.25-15.33,1-4.46.7-5.28,2.46-5.41,7.27-.1,3.65,1,7.35-.35,11.62-1.94-.85-4-1.25-5.33-2.4-11-9.12-21.82-18.38-32.52-27.45C16,45.33,34.44,19.58,43.47,14Z"/>
      </g>
    </g>
  </svg>
 </div>

                         <div class="icon arrow" style="transform: scaleX(-1);" onclick="navigationPoke('right')" id="arrowright">
  <svg width="60" height="60" viewBox="0 -9.55 119.78 119.78" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <style>.cls-1{fill:#ffffff;}</style>
    </defs>
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1-2" data-name="Layer 1">
        <path d="M60.3,78.46c-.31,5-.39,9-.82,12.91-.86,7.85-7.86,11.57-14.92,7.85A63.53,63.53,0,0,1,34.4,92.84Q19.67,81,5.29,68.78C-.35,64-1.3,58.65,1.58,51.82a30.86,30.86,0,0,1,2.19-4.65A302.23,302.23,0,0,1,31.91,9.31a48.7,48.7,0,0,1,7.64-6.84C46-2.3,51.84,0,53.52,7.92a65.45,65.45,0,0,1,.78,7.69c.14,1.66.24,3.33.4,5.53a32.54,32.54,0,0,0,4.39.14c7.11-.83,14.18-2.09,21.3-2.57a246.17,246.17,0,0,1,24.89-.54c7.68.26,11.38,3.91,12.77,11.46a112.58,112.58,0,0,1,1.63,24.8c-.05,1.42-.31,2.84-.49,4.25-1,8.35-5.08,13.81-14,14.64a17.63,17.63,0,0,0-4.09,1.24A65.73,65.73,0,0,1,78.3,78.24C72.6,78.16,66.9,78.37,60.3,78.46ZM43.47,14c-9,5.63-27.46,31.38-32.4,44.91,10.7,9.07,21.55,18.33,32.52,27.45,1.38,1.15,3.39,1.55,5.33,2.4,1.38-4.27.25-8,.35-11.62.13-4.81.95-6.57,5.41-7.27,5-.8,10.21-.76,15.33-1,7.4-.41,14.84-.49,22.2-1.28a39.24,39.24,0,0,0,16.08-5c2.55-12.13,1.56-25-2.65-33.79-4.31-1.14-8.87-1.08-13.42-.95-10.86.31-21.7.61-32.42,2.73-5.51,1.09-10.8.41-15.4-3.89C44.12,22.77,43.83,18.81,43.47,14Z"/>
        <path class="cls-1" d="M43.47,14c.36,4.86.65,8.82.93,12.64,4.6,4.3,9.89,5,15.4,3.89,10.72-2.12,21.56-2.42,32.42-2.73,4.55-.13,9.11-.19,13.42.95,4.21,8.83,5.2,21.66,2.65,33.79a39.24,39.24,0,0,1-16.08,5c-7.36.79-14.8.87-22.2,1.28-5.12.29-10.29.25-15.33,1-4.46.7-5.28,2.46-5.41,7.27-.1,3.65,1,7.35-.35,11.62-1.94-.85-4-1.25-5.33-2.4-11-9.12-21.82-18.38-32.52-27.45C16,45.33,34.44,19.58,43.47,14Z"/>
      </g>
    </g>
  </svg>
 </div>
</div>`

}