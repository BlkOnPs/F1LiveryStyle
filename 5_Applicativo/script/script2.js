const canvasOggetto = document.getElementById("canvasOggetto");
const engine = new BABYLON.Engine(canvasOggetto, true);
const modello = localStorage.getItem("modelloSelezionato");
const numeroPilota = document.getElementById("numeroPilota");
const nomePilota = document.getElementById("nomePilota");

let scena;
let camera;
let currentModel = null;

if (!modello) {
    alert("Non hai selezionato nessun modello, cosa vuoi personalizzare?? Ritorna alla pagina principale...");
    window.location.href = "index.html"; 
}

function creaScena() {
  scena = new BABYLON.Scene(engine);
  scena.clearColor = new BABYLON.Color4(0, 0, 0, 0);

  camera = new BABYLON.ArcRotateCamera(
    "camera",
    0,
    Math.PI / 2.5,
    7000,
    new BABYLON.Vector3(0, 0, 0),
    scena
  );
  camera.attachControl(canvasOggetto, false);
  camera.upperRadiusLimit = 7000;

  camera.wheelDeltaPercentage = 0.05;

  const luce1 = new BABYLON.HemisphericLight(
    "luce",
    new BABYLON.Vector3(0, 1, 0),
    scena
  );
  luce1.intensity = 0.8;

  const luce2 = new BABYLON.DirectionalLight(
    "luce2",
    new BABYLON.Vector3(-1, -2, -1),
    scena
  );
  luce2.intensity = 0.5;

  return scena;
}
creaScena();

function impostaCamera(nomeFile) {
  switch (nomeFile) {
    case "2022":
      camera.alpha = -Math.PI / 4;
      camera.beta = Math.PI / 2.5;
      camera.radius = 7000;
      camera.setTarget(new BABYLON.Vector3(-1200, 300, 800));
      camera.lowerRadiusLimit = 50;
      camera.upperRadiusLimit = 7000;
      console.log("camera modello 2022");
      break;

    case "2026":
      camera.alpha = -Math.PI / 4;
      camera.beta = Math.PI / 2.5;
      camera.radius = 1000;
      camera.setTarget(new BABYLON.Vector3(0,0,0));
      camera.wheelDeltaPercentage = 0.05;
      //camera.radius = 6500;
      //camera.setTarget(new BABYLON.Vector3(-2015, 550, 520));
      camera.lowerRadiusLimit = 0;
      camera.upperRadiusLimit = 2000;
      console.log("camera modello 2026");
      break;

    case "mclaren":
      camera.alpha = -Math.PI / 4;
      camera.beta = Math.PI / 2.5;
      camera.radius = 7000;
      camera.setTarget(new BABYLON.Vector3(0, 250, 0));
      camera.lowerRadiusLimit = 70;
      camera.upperRadiusLimit = 7000;
      console.log("camera modello mcLaren");
      break;

    case "2024":
      camera.alpha = -Math.PI / 4;
      camera.beta = Math.PI / 2.5;
      camera.radius = 10;
      camera.setTarget(new BABYLON.Vector3(0, 0, 0));
      camera.lowerRadiusLimit = 0;
      camera.upperRadiusLimit = 10;
      console.log("camera modello mercedes W11");
      break;

    default:
      camera.alpha = -Math.PI / 4;
      camera.beta = Math.PI / 2.5;
      camera.radius = 7000;
      camera.setTarget(new BABYLON.Vector3(-1500, 250, 900));
      camera.lowerRadiusLimit = 50;
      console.log("camera default");
      break;
  }
}

function caricaModello3D(nomeFile) {
  if (currentModel) {
    currentModel.forEach(mesh => mesh.dispose());
    currentModel = null;
  }
  impostaCamera(nomeFile);

  const percorsoModelli = "../models/modify/";
  BABYLON.SceneLoader.ImportMesh(
    "",
    percorsoModelli,
    nomeFile + ".glb",
    scena,
    function (meshes) {
      currentModel = meshes;

      const dimensione = meshes[0].getHierarchyBoundingVectors();
      const centro = BABYLON.Vector3.Center(dimensione.min, dimensione.max);
      meshes.forEach(mesh => {
        mesh.position.subtractInPlace(centro);
      });

      const grandezzaModello = dimensione.max.subtract(dimensione.min);
      const dimensioneMax = Math.max(grandezzaModello.x, grandezzaModello.y, grandezzaModello.z);
      camera.radius = dimensioneMax * 2;

      console.log("modello: ", nomeFile);
      inizializzaNumeroPilota(scena);
    },
    null,
    function (scena, message) {
      console.error("errore: ", message);
    }
  );
}
caricaModello3D(modello);

function tornaIndietro() {
  window.location.href = "index.html";
}

async function downloadModello() {
  const numero = numeroPilota.value.trim();
  const nome = nomePilota.value.trim();

  if (numero === "" || nome === "") {
    alert("Completare il nome e il numero di gara del pilota per poter scaricare il modello!");
    return;
  }

  const nomeFile = nome + "_" + numero + "_Model" + modello;

  try {
    const glb = await BABYLON.GLTF2Export.GLBAsync(scena, nomeFile);
    const glbBlob = glb.glTFFiles[nomeFile + ".glb"];
    const poster1 = await creaPoster("frontale", 0);
    const poster2 = await creaPoster("laterale", Math.PI / 2);
    const poster3 = await creaPoster("tre-quarti", Math.PI / 4);

    const zip = new JSZip();
    zip.file(nomeFile + ".glb", glbBlob);
    zip.file(nomeFile + "_poster_frontale.png", poster1);
    zip.file(nomeFile + "_poster_laterale.png", poster2);
    zip.file(nomeFile + "_poster_tre-quarti.png", poster3);

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


engine.runRenderLoop(function () {
  scena.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});