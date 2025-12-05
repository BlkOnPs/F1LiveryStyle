const colorPickerVettura = document.querySelector('input[name="colorPickerVettura"]');

let sfondoAttivo = null;
let tipoSfondo = 'colore';
let valoreSfondo = '#000000';

let dynamicTexture;
const NOME_MESH_NUMERO = "Zona_NumeroPilota";

let rotazione = false;
let funzioneRotazione = null;
let velocita = 0.009;

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

function coloraZonaScelta(nomeZona){
  switch(nomeZona){
    
  }
}