const colorPickerVettura = document.querySelector('input[name="colorPickerVettura"]');
let sfondoAttivo = null;

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
}

function cambiaSfondoImmagine(percorso) {
    const canvas = document.getElementById("contenitoreCanvas");
    canvas.style.backgroundImage = `url(${percorso})`;
    canvas.style.backgroundSize = "cover";
    canvas.style.backgroundPosition = "center";
    
    document.querySelectorAll('.buttonSfondo').forEach(btn => {
        btn.classList.toggle('active', btn.querySelector('img').src.includes(percorso.split('/').pop()));
    });
}

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

function impostaNumero() {
  const numeroInput = document.getElementById("inputNumero");
  
  let nuovoNumero = String(numeroInput.value).trim(); 
  
  if (nuovoNumero === "") {
      nuovoNumero = "00";
  }
  disegnaTestoSullaTarga(nuovoNumero, "white", "black"); 
}

function inizializzaNumeroPilota(scena) {
  const targaMesh = scena.getMeshByName(NOME_MESH_NUMERO);

  if (!targaMesh) {
      console.error(`Mesh "${NOME_MESH_NUMERO}" non trovato nella scena.`);
      return;
  }

  const textureSize = { width: 512, height: 256 };
  dynamicTexture = new BABYLON.DynamicTexture(
      "numeroPilotaTexture", 
      textureSize, 
      scena, 
      true
  );

  const material = new BABYLON.StandardMaterial("numeroPilotaMat", scena);
  material.diffuseTexture = dynamicTexture;
  material.specularColor = new BABYLON.Color3(0, 0, 0);
  material.emissiveColor = new BABYLON.Color3(1, 1, 1);

  targaMesh.material = material;
  
  disegnaTestoSullaTarga("00", "white", "black");
}


function disegnaTestoSullaTarga(testo, coloreSfondo, coloreTesto) {
  if (!dynamicTexture) return;

  const ctx = dynamicTexture.getContext();
  const width = dynamicTexture.getSize().width;
  const height = dynamicTexture.getSize().height;

  ctx.clearRect(0, 0, width, height); 
  ctx.fillStyle = coloreSfondo;
  ctx.fillRect(0, 0, width, height);

  const fontSize = height * 0.6;
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.fillStyle = coloreTesto; 
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(testo, width / 2, height / 2);

  dynamicTexture.update();
}