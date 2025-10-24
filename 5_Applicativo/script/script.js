const canvasOggetto = document.getElementById("canvasOggetto");
const engine = new BABYLON.Engine(canvasOggetto, true);
let scena;
let currentModel = null;
let camera;

function creaScena() {
  scena = new BABYLON.Scene(engine);
  scena.clearColor = new BABYLON.Color4(0, 0, 0, 0);
  camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 6000, new BABYLON.Vector3(0, 0, 0), scena);
  camera.attachControl(canvasOggetto, true);
  camera.lowerRadiusLimit = 70;
  camera.upperRadiusLimit = 6000;

  scena.registerBeforeRender(function() {
    camera.alpha += 0.01;
  });

  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scena
  );
  light.intensity = 0.8;

  const light2 = new BABYLON.DirectionalLight(
    "dirLight",
    new BABYLON.Vector3(-1, -2, -1),
    scena
  );
  light2.intensity = 0.5;

  return scena;
}


function caricaModello3D(nomeFile) {
  if (currentModel) {
    currentModel.forEach(mesh => mesh.dispose());
    currentModel = null;
  }

  const percorsoModelli = "../models/modify/";

  switch (nomeFile) {
    case "2022":
      BABYLON.SceneLoader.ImportMesh(
        "",
        percorsoModelli,
        "2022.glb",
        scena,
        function (meshes) {
          currentModel = meshes;
          console.log("Modello 1 caricato");

          const boundingBox = meshes[0].getHierarchyBoundingVectors();
          const center = BABYLON.Vector3.Center(boundingBox.min, boundingBox.max);
          meshes.forEach(mesh => {
            mesh.position.subtractInPlace(center);
          });
        },
        null,
        function (scena, message) {
          console.error("Errore caricamento modello:", message);
        }
      );
      break;

    case "2026":
      BABYLON.SceneLoader.ImportMesh(
        "",
        percorsoModelli,
        "2026.glb",
        scena,
        function (meshes) {
          currentModel = meshes;
          console.log("Modello 2 caricato");

          const boundingBox = meshes[0].getHierarchyBoundingVectors();
          const center = BABYLON.Vector3.Center(boundingBox.min, boundingBox.max);
          meshes.forEach(mesh => {
            mesh.position.subtractInPlace(center);
          });
        },
        null,
        function (scena, message) {
          console.error("Errore caricamento modello:", message);
        }
      );
      break;

    case "modello3.glb":
      break;

    default:
      console.log("Nessun modello selezionato");
  }
}

creaScena();

const radioButtons = document.querySelectorAll('input[name="modello"]');
radioButtons.forEach(radio => {
  radio.addEventListener('change', function (e) {
    const nomeFile = e.target.value;
    caricaModello3D(nomeFile);
  });
});

engine.runRenderLoop(function () {
  scena.render();
});

function cambioBackground() {
  let data = new Date();
  let ore = data.getHours();

  if (ore >= 20 || ore <= 6) {
    document.body.classList.add("night");
  } else {
    document.body.classList.remove("night");
  }
}
window.addEventListener("resize", () => {
  engine.resize();
});
cambioBackground();