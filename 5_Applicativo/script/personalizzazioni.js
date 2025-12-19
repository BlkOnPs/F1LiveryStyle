//Gestione Background
let sfondoAttivo = null;
let tipoSfondo = 'colore';
let valoreSfondo = '#000000';

//Colora zona
let zonaSelezionata = "";
const coloraZona = document.querySelector('input[name="coloraZona"]');

//Seleziona zone
const selectZonaVettura = document.getElementById("selectZonaVettura");

//Rotazione Vettura
let modelloGira = false;
let velocita = 0.009;

//Mostra wireframe
let wireframeAttivo = false;

//Rotazione ruote
let rotazioneRuote = false;
let funzioneRotazioneRuote = null;
let velocitaRuote = 0.05;

//Animazione Luce rossa posteriore
let luceAccesa = false;
let timerLampeggio = null;
let materialeRosso = null;
let lucePosteriore = null;

//Gomme
const gomme = ["Object_235", "Object_219", "Object_227", "Object_243", "Object_217", "Object_225", "Object_241", "Object_233"];
const tipoGomma = ["Object_217", "Object_225", "Object_241", "Object_233"];
let tipoDiGommaSelezionato = false;

//Informazioni pilota
const numeroPilota = document.querySelector('input[name="numeroPilota"]');
const nomePilota = document.querySelector('input[name="nomePilota"]');

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
  scena.clearColor = new BABYLON.Color4(rgb.r / 255, rgb.g / 255, rgb.b / 255, 1);
  tipoSfondo = 'colore';
  valoreSfondo = colore;
}

function cambiaSfondoImmagine(percorso) {
  const canvas = document.getElementById("contenitoreCanvas");

  canvas.style.backgroundImage = "url(" + percorso + ")";
  canvas.style.backgroundSize = "cover";
  canvas.style.backgroundPosition = "center";

  let bottoni = document.querySelectorAll(".buttonSfondo");

  for (let i = 0; i < bottoni.length; i++) {
    bottoni[i].classList.remove("active");
  }

  for (let i = 0; i < bottoni.length; i++) {
    let img = bottoni[i].querySelector("img");

    if (img && img.src.indexOf(percorso) !== -1) {
      bottoni[i].classList.add("active");
    }
  }

  if (sfondoAttivo !== null) {
    sfondoAttivo.dispose();
    sfondoAttivo = null;
  }

  let nuovoLayer = new BABYLON.Layer(
    "backgroundLayer",
    percorso,
    scena
  );
  nuovoLayer.isBackground = true;
  sfondoAttivo = nuovoLayer;
  tipoSfondo = "immagine";
  valoreSfondo = percorso;
}


function cambiaTipoGomma(tipo) {
  const tuttiBottoniGomma = document.querySelectorAll('.logoGomma');
  for (let i = 0; i < tuttiBottoniGomma.length; i++) {
    tuttiBottoniGomma[i].classList.remove('active');
  }
  event.currentTarget.classList.add('active');
  tipoDiGommaSelezionato = true;

  const mat = new BABYLON.StandardMaterial("gommaMat", scena);
  const tex = new BABYLON.Texture("../images/textures/wheel/wheel.png", scena);

  tex.uScale = -1;
  tex.uOffset = 1;
  tex.wAng = Math.PI;
  tex.level = 2.0;

  if (tipo === "soft") {
    mat.diffuseColor = new BABYLON.Color3(1, 0, 0);
  } else if (tipo === "medium") {
    mat.diffuseColor = new BABYLON.Color3(1, 1, 0);
  } else if (tipo === "hard") {
    mat.diffuseColor = new BABYLON.Color3(1, 1, 1);
  }

  mat.diffuseTexture = tex;

  for (let i = 0; i < tipoGomma.length; i++) {
    const mesh = scena.getMeshByName(tipoGomma[i]);
    if (mesh) {
      mesh.material = mat;
    }
  }
}


function eseguiRotazioneVettura() {
  if (modelloGira) {
    scena.unregisterBeforeRender(faiGirareModello);
    modelloGira = false;
  } else {
    faiGirareModello = function() {
      camera.alpha += velocita;
    };
    scena.registerBeforeRender(faiGirareModello);
    modelloGira = true;
  }
}

function velocitaRotazione() {
  const vel = document.querySelector('input[type="range"]');
  velocita = parseFloat(vel.value);
  
  if (modelloGira) {
    scena.unregisterBeforeRender(faiGirareModello);
    faiGirareModello = function() {
      camera.alpha += velocita;
    };
    scena.registerBeforeRender(faiGirareModello);
  }
}


selectZonaVettura.addEventListener("input", function () {
  const zona = this.value;
  if (zona !== "") {
    coloraZonaScelta(zona);
  }
});

function coloraZonaScelta(nomeZona) {
  switch (nomeZona) {
    case "Halo":
      visualizzaZona("Object_186");
      break;
    case "EngineCover":
      visualizzaZona("Object_128");
      break;
    case "AlaAnteriore":
      visualizzaZona("Object_120");
      break;
    case "All":
      visualizzaTutteLeZone();
      break;
    case "AlaPosteriore":
      visualizzaZona("Object_360");
      break;
    default:
      alert("Seleziona una zona per colorare!");
      break;
  }
}

function visualizzaZona(nomeMesh) {
  const mesh = scena.getMeshByName(nomeMesh);
  if (!mesh || !mesh.material){
    return;
  }

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
      if(!gomme.includes(mesh.name)){
        materialiOriginali.push({
        mesh: mesh,
        materiale: mesh.material
      });

      mesh.material = materialeRosso;
      }
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
  coloraZonaSceltaInput(e.target.value);
});

function coloraZonaSceltaInput(color) {
  if (!modelloSelezionato || zonaSelezionata === "") {
    alert("Seleziona prima una zona dalla lista!");
    return;
  }

  const colore = BABYLON.Color3.FromHexString(color);

  if (zonaSelezionata === "All") {
    modelloSelezionato.forEach(mesh => {
      if (mesh.material) {
        if(!gomme.includes(mesh.name)){
          if (mesh.material instanceof BABYLON.PBRMaterial) {
            mesh.material.albedoColor = colore;
        } else if (mesh.material instanceof BABYLON.StandardMaterial) {
            mesh.material.diffuseColor = colore;
        }
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
}

function mostraWireframe() {
  wireframeAttivo = !wireframeAttivo;
  scena.materials.forEach(materiale => {
    if (materiale.wireframe !== undefined) {
      materiale.wireframe = wireframeAttivo;
    }
  });
}

function attivaLucePosteriore() {
  const partiPosteriori = ["Object_146", "Object_94"];
  
  if (luceAccesa) {
    if (timerLampeggio) {
      clearInterval(timerLampeggio);
      timerLampeggio = null;
    }
    
    partiPosteriori.forEach(nomeParte => {
      const parte = scena.getMeshByName(nomeParte);
      if (parte && parte.materialeOriginale) {
        parte.material = parte.materialeOriginale;
      }
    });
    
    if (lucePosteriore) {
      lucePosteriore.dispose();
      lucePosteriore = null;
    }
    
    luceAccesa = false;
    
  } else {
    materialeRosso = new BABYLON.StandardMaterial("matRosso", scena);
    materialeRosso.diffuseColor = new BABYLON.Color3(1, 0, 0);
    materialeRosso.emissiveColor = new BABYLON.Color3(9, 0, 0);
    
    partiPosteriori.forEach(nomeParte => {
      const parte = scena.getMeshByName(nomeParte);
      if (parte) {
        if (!parte.materialeOriginale) {
          parte.materialeOriginale = parte.material;
        }
        parte.material = materialeRosso;
      }
    });
    
    lucePosteriore = new BABYLON.PointLight(
      "lucePost",
      new BABYLON.Vector3(0, 0.5, -4),
      scena
    );
    lucePosteriore.diffuse = new BABYLON.Color3(1, 0, 0);
    lucePosteriore.intensity = 15; 
    lucePosteriore.range = 4;
    
    luceAccesa = true;
    
    let visibile = true;
    
    timerLampeggio = setInterval(() => {
      visibile = !visibile;
      
      if (visibile) {
        materialeRosso.emissiveColor = new BABYLON.Color3(2, 0, 0);
        lucePosteriore.intensity = 2;
      } else {
        materialeRosso.emissiveColor = new BABYLON.Vector3(0, 0, 0);
        lucePosteriore.intensity = 0;
      }
    }, 150);
  }
}

let materialiOriginali = {};

function cambiaMaterialeModello(percorso, bottoneCliccato) {
  console.log("Percorso:", percorso);
  
  if (Object.keys(materialiOriginali).length === 0) {
    scena.meshes.forEach(mesh => {
      if (mesh && mesh.material) {
        materialiOriginali[mesh.name] = mesh.material;
      }
    });
  }

  const mat = new BABYLON.StandardMaterial("matTexture", scena);
  const tex = new BABYLON.Texture(percorso, scena);
  mat.diffuseTexture = tex;

  document.querySelectorAll('.buttonSfondo').forEach(btn => {
    btn.classList.remove('active');
  });
  
  if (bottoneCliccato) {
    bottoneCliccato.classList.add('active');
  }
  
  let count = 0;
  scena.meshes.forEach(mesh => {
    if (mesh && !gomme.includes(mesh.name)) {
      mesh.material = mat;
      count++;
    }
  });
  
}

function ripristinaMateriale() {
  scena.meshes.forEach(mesh => {
    if (mesh && materialiOriginali[mesh.name] && !gomme.includes(mesh.name)) {
      mesh.material = materialiOriginali[mesh.name];
    }
  });

  document.querySelectorAll('.buttonSfondo').forEach(btn => btn.classList.remove('active'));
}


//Download: funzione getita con AI
async function downloadModello() {
  const numero = numeroPilota.value;
  const nome = nomePilota.value.trim();

  if(wireframeAttivo){
    alert("Se si vuole scaricare il modello, prima si deve disattivare la visualizzazione Wireframe!");
  }

  if (numero === "" || nome === "") {
    alert("Completare il nome e il numero di gara del pilota per poter scaricare il modello!");
    return;
  }else if(numero <= 0 || numero > 99){
    alert("Numero di gara non valido, deve essere compreso tra 1 a 99!");
    return;
  }

  if (!tipoDiGommaSelezionato) {
    alert("Seleziona un tipo di gomma prima di scaricare il modello!");
    return;
  }

  const nomeFile = nome + "_" + numero + "_Model" + modello;

  //Generata da AI, questa sezione di codice e la creazione del Poster, 
  //purtroppo non sono ruscito a gestirlo
  try {
    const glb = await BABYLON.GLTF2Export.GLBAsync(scena, nomeFile);
    const glbBlob = glb.glTFFiles[nomeFile + ".glb"];
    const poster1 = await creaPoster("frontale", 0);
    const poster2 = await creaPoster("laterale", Math.PI / 2);
    const poster3 = await creaPoster("tre-quarti", Math.PI / 4);

    const zip = new JSZip();
    zip.file(nomeFile + ".glb", glbBlob);
    zip.file("poster_1.png", poster1);
    zip.file("poster_2.png", poster2);
    zip.file("poster_3.png", poster3);

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(zipBlob);
    link.download = nomeFile + ".zip";
    link.click();
    URL.revokeObjectURL(link.href);
    
  } catch (error) {
    console.error("Errore:", error);
    alert("Errore durante la creazione del pacchetto.");
  }
}

function creaPoster(tipo, rotazioneY) {
  return new Promise((resolve) => {
    const posizioneOriginale = camera.position.clone();
    const targetOriginale = camera.target ? camera.target.clone() : null;
    const alphaOriginale = camera.alpha;
    
    if (camera.alpha !== undefined) {
      camera.alpha = alphaOriginale + rotazioneY;
    }
    
    setTimeout(() => {
      BABYLON.Tools.CreateScreenshotUsingRenderTarget(
        engine,
        camera,
        { width: 3840, height: 2160 },
        (dataUrl) => {
          camera.position = posizioneOriginale;
          if (targetOriginale) camera.target = targetOriginale;
          if (camera.alpha !== undefined) camera.alpha = alphaOriginale;
          
          fetch(dataUrl).then(res => res.blob()).then(resolve);
        }
      );
    }, 100);
  });
}