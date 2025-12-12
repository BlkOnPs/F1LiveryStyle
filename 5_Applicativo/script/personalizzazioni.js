const colorPickerVettura = document.querySelector('input[name="colorPickerVettura"]');

let sfondoAttivo = null;
let tipoSfondo = 'colore';
let valoreSfondo = '#000000';

let zonaSelezionata = "";
const coloraZona = document.querySelector('input[name="coloraZona"]');

const selectZonaVettura = document.getElementById("selectZonaVettura");

//Rotazione Vettura
let rotazione = false;
let funzioneRotazione = null;
let velocita = 0.009;

//Mostra wireframe
let wireframeAttivo = false;

//Rotazione ruote
let rotazioneRuote = false;
let funzioneRotazioneRuote = null;
let velocitaRuote = 0.05;
const NOMI_MESH_RUOTE = ["Object_219", "Object_221", "Object_235", "Object_237", "Object_227", "Object_229", "Object_243", "Object_245"];

function aggiornaColoreVettura(coloreHex) {
  if (!currentModel) return;

  const colore = BABYLON.Color3.FromHexString(coloreHex);

  currentModel.forEach(mesh => {
    if (mesh.material) { //verifica se ha un materiale
      if (mesh.material instanceof BABYLON.PBRMaterial) { //tipo materiale PBR, piu realistico
        mesh.material.albedoColor = colore;
      }
      else if (mesh.material instanceof BABYLON.StandardMaterial) { //tipo materiale standard
        mesh.material.diffuseColor = colore;
      }
    }
  });
}
colorPickerVettura.addEventListener('input', (e) => {
  aggiornaColoreVettura(e.target.value);
});

function cambiaColoreSfondo() {
    const colore = document.getElementById("backgroundColorPicker").value;
    const canvas = document.getElementById("contenitoreCanvas");
    canvas.style.backgroundImage = "none";
    canvas.style.background = colore;
    document.querySelectorAll('.buttonSfondo').forEach(btn => btn.classList.remove('active'));
    
    if (sfondoAttivo) {
        sfondoAttivo.dispose();
        sfondoAttivo = null;
    }
    const rgb = hexToRgb(colore);
    scena.clearColor = new BABYLON.Color4(rgb.r / 255, rgb.g / 255, rgb.b / 255, 1);
    tipoSfondo = 'colore';
    valoreSfondo = colore;
}

function cambiaSfondoImmagine(percorso) {
    const canvas = document.getElementById("contenitoreCanvas");
    canvas.style.backgroundImage = `url(${percorso})`;
    canvas.style.backgroundSize = "cover";
    canvas.style.backgroundPosition = "center";
    
    document.querySelectorAll('.buttonSfondo').forEach(btn => {
        btn.classList.toggle('active', btn.querySelector('img').src.includes(percorso.split('/').pop()));
    });
    
    const layer = new BABYLON.Layer("backgroundLayer", percorso, scena);
    layer.isBackground = true;
    
    if (sfondoAttivo) {
        const oldLayer = scena.layers.find(l => l.name === "backgroundLayer");
        if (oldLayer) oldLayer.dispose();
    }
    
    tipoSfondo = 'immagine';
    valoreSfondo = percorso;
    sfondoAttivo = layer;
}

/*function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}*/

function cambiaTipoGomma(tipo) {
    console.log('Gomma selezionata:', tipo);
    document.querySelectorAll('.logoGomma').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function eseguiRotazioneVettura() {
  rotazione = !rotazione;
  if (rotazione) {
    funzioneRotazione = function () {
      camera.alpha += velocita;
    };
    scena.registerBeforeRender(funzioneRotazione);
  } else {
    if (funzioneRotazione) {
      scena.unregisterBeforeRender(funzioneRotazione);
      funzioneRotazione = null;
    }
  }
}

function velocitaRotazione() {
  velocita = parseFloat(event.target.value);
  
  if (rotazione && funzioneRotazione) {
    scena.unregisterBeforeRender(funzioneRotazione);
    funzioneRotazione = function () {
      camera.alpha += velocita;
    };
    scena.registerBeforeRender(funzioneRotazione);
  }
}


selectZonaVettura.addEventListener("input", function () {
  const zonaSelezionata = this.value;
  if (zonaSelezionata !== "") {
    coloraZonaScelta(zonaSelezionata);
  }
});


function coloraZonaScelta(nomeZona) {
  switch (nomeZona) {
    case "Nosecone":
      visualizzaZona("Object_120");
      break;
    case "Halo":
      visualizzaZona("Halo");
      break;
    case "AlaMobile":
      visualizzaZona("Object_356");
      break;
    case "EngineCover":
      visualizzaZona("EngineCover");
      break;
    case "EndplateAnterioreDestro":
      visualizzaZona("Object_116");
      break;
    case "EndplateAnterioreSinistro":
      visualizzaZona("Object_108");
      break;
    case "AlaAnteriore":
      visualizzaZona("Object_120.001");
      break;
    case "All":
      visualizzaTutteLeZone();
      break;
    case "AlaPosteriore":
      visualizzaZona("Object_52");
      break;
  }
}

function visualizzaZona(nomeMesh) {
  const mesh = scena.getMeshByName(nomeMesh);
  if (!mesh || !mesh.material) return;
  
  const materialeOriginale = mesh.material.clone(mesh.material.name + "_backup");

  const materialeRosso = new BABYLON.StandardMaterial("matRosso", scena);
  materialeRosso.diffuseColor = new BABYLON.Color3(1, 0, 0);

  mesh.material = materialeRosso;

  setTimeout(() => {
    mesh.material = materialeOriginale;
  }, 1000);

  zonaSelezionata = nomeMesh;
  return nomeMesh;
}

function visualizzaTutteLeZone() {
  const materialiOriginali = [];

  const materialeRosso = new BABYLON.StandardMaterial("matRossoAll", scena);
  materialeRosso.diffuseColor = new BABYLON.Color3(1, 0, 0);

  scena.meshes.forEach(mesh => {
    if (mesh.material) {
      materialiOriginali.push({
        mesh: mesh,
        materiale: mesh.material
      });

      mesh.material = materialeRosso;
    }
  });

  setTimeout(() => {
    materialiOriginali.forEach(item => {
      item.mesh.material = item.materiale;
    });
  }, 1000);

  return zonaSelezionata = "All";
}

coloraZona.addEventListener('input', (e) => {
  coloraZonaSceltaDelInput(e.target.value);
});

function coloraZonaSceltaDelInput(color) {
  console.log("Colore:", color, "Zona:", zonaSelezionata);
  if (!currentModel || zonaSelezionata === "") {
    alert("Seleziona prima una zona dalla lista!");
    return;
  }

  const colore = BABYLON.Color3.FromHexString(color);

  if (zonaSelezionata === "All") {
    currentModel.forEach(mesh => {
      if (mesh.material) {
        if (mesh.material instanceof BABYLON.PBRMaterial) {
          mesh.material.albedoColor = colore;
        } else if (mesh.material instanceof BABYLON.StandardMaterial) {
          mesh.material.diffuseColor = colore;
        }
      }
    });
    return;
  }

  const mesh = scena.getMeshByName(zonaSelezionata);
  if (!mesh) {
    console.error("Mesh non trovato:", zonaSelezionata);
    return;
  }
  
  if (!mesh.material) {
    mesh.material = new BABYLON.StandardMaterial("mat_" + zonaSelezionata, scena);
  }
  if (mesh.material.name === "matRosso" || mesh.material.name === "matRossoAll") {
    mesh.material = new BABYLON.StandardMaterial("mat_" + zonaSelezionata, scena);
  }

  if (mesh.material instanceof BABYLON.PBRMaterial) {
    mesh.material.albedoColor = colore;
  } 
  else if (mesh.material instanceof BABYLON.StandardMaterial) {
    mesh.material.diffuseColor = colore;
  }
  
  console.log("Zona colorata:", zonaSelezionata);
}

function mostraWireframe(){
  wireframeAttivo = !wireframeAttivo; 
  scena.materials.forEach(materiale => {
      if (materiale.wireframe !== undefined) {
          materiale.wireframe = wireframeAttivo;
      }
  });
}

function eseguiRotazioneRoute(){
  rotazioneRuote = !rotazioneRuote;

  if (rotazioneRuote) {
    funzioneRotazioneRuote = function () {
      NOMI_MESH_RUOTE.forEach(nome => {
        const mesh = scena.getMeshByName(nome);
        if (mesh) {
          mesh.rotation.x += velocitaRuote;
        }
      });
    };
    scena.registerBeforeRender(funzioneRotazioneRuote);
    console.log("🔄 Ruote in rotazione");
  } else {
    if (funzioneRotazioneRuote) {
      scena.unregisterBeforeRender(funzioneRotazioneRuote);
      funzioneRotazioneRuote = null;
      console.log("Rotazione ruote interrotta");
    }
  }
}