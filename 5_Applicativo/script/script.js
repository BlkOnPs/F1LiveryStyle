const canvasOggetto = document.getElementById("canvasOggetto");
const engine = new BABYLON.Engine(canvasOggetto, true);
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
    new BABYLON.Vector3(-1500, 250, 900),
    scena
  );
  camera.attachControl(canvasOggetto, true);
  camera.lowerRadiusLimit = 50;
  camera.upperRadiusLimit = 7000;

  //ROTAZIONE AUTOMATICA LENTA (+= 0.009)
  scena.registerBeforeRender(function () {
    camera.alpha += 0.009;
  });

  const luce1 = new BABYLON.Hemisphericluce1(
    "luce",
    new BABYLON.Vector3(0, 1, 0),
    scena
  );
  luce1.intensity = 0.8;

  const luce2 = new BABYLON.Directionalluce1(
    "luce2",
    new BABYLON.Vector3(-1, -2, -1),
    scena
  );
  luce2.intensity = 0.5;

  return scena;
}

function caricaModello3D(nomeFile) {
  if (currentModel) {
    currentModel.forEach(mesh => mesh.dispose());
    currentModel = null;
  }
  const percorsoModelli = "../models/modify/";
  BABYLON.SceneLoader.ImportMesh(
    "",
    percorsoModelli,
    nomeFile + ".glb",
    scena,
    function (meshes) {
      currentModel = meshes;
      const boundingBox = meshes[0].getHierarchyBoundingVectors();
      const center = BABYLON.Vector3.Center(boundingBox.min, boundingBox.max);
      meshes.forEach(mesh => {
        mesh.position.subtractInPlace(center);
      });

      const size = boundingBox.max.subtract(boundingBox.min);
      const maxDim = Math.max(size.x, size.y, size.z);
      camera.radius = maxDim * 2;

      console.log("modello: ", nomeFile);
    },
    null,
    function (scena, message) {
      console.error("errore: ", message);
    }
  );
}

creaScena();

const radioButtons = document.querySelectorAll('input[name="modello"]');
radioButtons.forEach(radio => {
  radio.addEventListener('change', function (event) {
    const nomeFile = event.target.value;
    console.log(camera.target);
    confermaButton.style.visibility = "visible";
    caricaModello3D(nomeFile);
  });
});

//DOPO AVER SCELTO, PORTA ALLA PAGINA DI PERSONALIZZAZIONE
confermaButton.addEventListener("click", function () {
  const selezionato = document.querySelector('input[name="modello"]:checked');

  if (selezionato) {
    localStorage.setItem("modelloSelezionato", selezionato.value);
    window.location.href = "styleModel.html";
  } else {
    alert("seleziona un modello");
  }
});


engine.runRenderLoop(function () {
  scena.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});

// Cambio colore background
function cambioBackground() {
  let data = new Date();
  let ore = data.getHours();

  if (ore >= 20 || ore < 6) {
    document.body.classList.add("night");
  } else {
    document.body.classList.remove("night");
  }
}
cambioBackground();