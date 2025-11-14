const canvasOggetto = document.getElementById("canvasOggetto");
const engine = new BABYLON.Engine(canvasOggetto, true); //true --> abilita anti-aliasing (per avere un immagine piu morbida)
const confermaButton = document.querySelector(".conferma");
let scena;
let currentModel = null;
let camera;

function creaScena() {
  scena = new BABYLON.Scene(engine);
  scena.clearColor = new BABYLON.Color4(0, 0, 0, 0);

  camera = new BABYLON.ArcRotateCamera(
    "camera",
    -Math.PI / 4,
    Math.PI / 2.5,
    7000,
    new BABYLON.Vector3(0, 0, 0), //target
    scena
  );
  camera.attachControl(canvasOggetto, false);
  camera.lowerRadiusLimit = 50;
  camera.upperRadiusLimit = 7000;

  //ROTAZIONE AUTOMATICA LENTA (+= 0.009)
  scena.registerBeforeRender(function () {
    camera.alpha += 0.009;
  });

  //luce che illumina dall'alto
  const luce1 = new BABYLON.HemisphericLight(
    "luce",
    new BABYLON.Vector3(0, 1, 0), //direzione
    scena
  );
  luce1.intensity = 0.8;

  //luce direzionale
  const luce2 = new BABYLON.DirectionalLight(
    "luce2",
    new BABYLON.Vector3(-1, -2, -1),
    scena
  );
  luce2.intensity = 0.5;

  return scena;
}

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
      camera.radius = 7000;
      camera.setTarget(new BABYLON.Vector3(-1500, 250, 900));
      camera.lowerRadiusLimit = 70;
      camera.upperRadiusLimit = 7000;
      console.log("camera modello 2026");
      break;

    case "mclaren":
      camera.alpha = -Math.PI / 4;
      camera.beta = Math.PI / 2.5;
      camera.radius = 7000;
      camera.setTarget(new BABYLON.Vector3(0, 0, 0));
      camera.lowerRadiusLimit = 70;
      camera.upperRadiusLimit = 7000;
      console.log("camera modello mcLaren");
      break;

    default:
      camera.alpha = -Math.PI / 4;
      camera.beta = Math.PI / 2.5;
      camera.radius = 7000;
      camera.setTarget(new BABYLON.Vector3(-1500, 250, 900));
      camera.lowerRadiusLimit = 50;
      camera.upperRadiusLimit = 7000;
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
    "", //nome meshes
    percorsoModelli, //path root
    nomeFile + ".glb",
    scena,
    function (meshes) { //parametro onSuccess, callback quando il modello è stato caricato correttamente
      currentModel = meshes;
      const dimensione = meshes[0].getHierarchyBoundingVectors(); //meshes[0] - nodo principale
      //la funzione getHierarchyBoundingVectors, serve per determinare punto estremo alto a sinistra e quello in basso a destra
      const centro = BABYLON.Vector3.Center(dimensione.min, dimensione.max);
      meshes.forEach(mesh => {
        mesh.position.subtractInPlace(centro); //sposta la posizione al centro
      });

      const grandezzaModello = dimensione.max.subtract(dimensione.min); //calcola dimensioni reali del modello | max - min
      const dimensioneMax = Math.max(grandezzaModello.x, grandezzaModello.y, grandezzaModello.z);
      /*Trova la dimensione piú grande del modello, 
      per capire quanto lontano deve stare la camera*/
      camera.radius = dimensioneMax * 2;
      //il * 2, viene eseguito, perche piu è grande, piu sta lontano

      console.log("modello: ", nomeFile);
    },
    null, //parametro onProgress
    function (scena, message) { //parametro onError
      console.error("errore: ", message);
    }
  );
}

creaScena();

//Dopo aver scelto, mostra il modello
const radioB = document.querySelectorAll('input[name="modello"]');
for (let radio of radioB) {
  radio.addEventListener("change", function () {
    let modello = this.value;
    confermaButton.style.visibility = "visible";
    caricaModello3D(modello);
    console.log("Target camera:", camera.target);
  });
}

//Confermi e vai a personalizzare
confermaButton.addEventListener("click", function () {
  const selezionato = document.querySelector('input[name="modello"]:checked');

  if (selezionato) {
    //Salva il riferimento del modelli selezionato nel browser, a cui servirà per la pagina di personalizzazione
    localStorage.setItem("modelloSelezionato", selezionato.value);
    //Apre la pagina di personalizzazione
    window.location.href = "styleModel.html";
  } else {
    alert("seleziona un modello");
  }
});

//Aggiorna ogni momento la scena
engine.runRenderLoop(function () {
  scena.render();
});

//Aggiorna la dimensione della finestra ogni volta che si cambia, quindi il canvas
window.addEventListener("resize", () => {
  engine.resize();
});

//CAMBIO COLORE BACKGROUND IN BASE ALL'ORARIO LOCALE
function cambioBackground() {
  let data = new Date();
  let ore = data.getHours();

  if (ore >= 20 || ore < 6) {
    document.body.classList.add("serale");
  } else {
    document.body.classList.remove("serale");
  }
}
cambioBackground();