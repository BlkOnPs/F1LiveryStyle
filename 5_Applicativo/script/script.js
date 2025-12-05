const canvasOggetto = document.getElementById("canvasOggetto");
const engine = new BABYLON.Engine(canvasOggetto, true); //true --> abilita anti-aliasing (per avere un immagine piu "morbida")
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
    5000,
    new BABYLON.Vector3(0, 0, 0), //target
    scena
  );
  camera.attachControl(canvasOggetto, false);
  camera.lowerRadiusLimit = 50;
  camera.upperRadiusLimit = 4000;

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
  luce1.intensity = 4;

  //luce direzionale
  const luce2 = new BABYLON.DirectionalLight(
    "luce2",
    new BABYLON.Vector3(-1, -2, -1),
    scena
  );
  luce2.intensity = 4;

  return scena;
}

function impostaCamera(nomeFile) {
  switch (nomeFile) {
    case "1991":
      camera.alpha = -Math.PI / 4;
      camera.beta = Math.PI / 2.5;
      camera.radius = 15;
      camera.setTarget(new BABYLON.Vector3(0, 0, 0));
      camera.lowerRadiusLimit = 10;
      camera.upperRadiusLimit = 15;
      console.log("camera modello 1991");
      break;

    case "2026":
      camera.alpha = -Math.PI / 4;
      camera.beta = Math.PI / 2.5;
      camera.radius = 20;
      camera.setTarget(new BABYLON.Vector3(0, 0, 0));
      camera.lowerRadiusLimit = 0;
      camera.upperRadiusLimit = 20;
      console.log("camera modello 2026");
      break;

    case "Mclaren":
      camera.alpha = -Math.PI / 4;
      camera.beta = Math.PI / 2.5;
      camera.radius = 9;
      camera.setTarget(new BABYLON.Vector3(0, 0, 0));
      camera.lowerRadiusLimit = 0;
      camera.upperRadiusLimit = 9;
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
      camera.radius = 1000;
      camera.setTarget(new BABYLON.Vector3(0, 0, 0));
      camera.lowerRadiusLimit = 50;
      camera.upperRadiusLimit = 1000;
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

  const percorsoModelli = "../models/views/";
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

new FinisherHeader({
  "count": 10,
  "size": {
    "min": 974,
    "max": 1261,
    "pulse": 0
  },
  "speed": {
    "x": {
      "min": 0.1,
      "max": 0.8
    },
    "y": {
      "min": 0.1,
      "max": 0.8
    }
  },
  "colors": {
    "background": "#001dff",
    "particles": [
      "#00ffdd",
      "#284292",
      "#23dbb6"
    ]
  },
  "blending": "overlay",
  "opacity": {
    "center": 0.5,
    "edge": 0.05
  },
  "skew": 0,
  "shapes": [
    "c"
  ]
});