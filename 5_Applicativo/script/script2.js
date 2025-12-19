const canvasOggetto = document.getElementById("canvasOggetto");
const engine = new BABYLON.Engine(canvasOggetto, true);
const modello = localStorage.getItem("modelloSelezionato");

let scena;
let camera;
let modelloSelezionato = null;

if (!modello) {
    alert("Non hai selezionato nessun modello, cosa vuoi personalizzare?? Ritorna alla pagina principale...");
    window.location.href = "selectModel.html"; 
}

function creaScena() {
  scena = new BABYLON.Scene(engine);
  scena.clearColor = new BABYLON.Color4(0, 0, 0, 0);

  camera = new BABYLON.ArcRotateCamera(
    "camera",
    0,
    Math.PI / 2,
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
      camera.radius = 7000;
      camera.setTarget(new BABYLON.Vector3(-1200, 300, 800));
      camera.lowerRadiusLimit = 50;
      camera.upperRadiusLimit = 7000;
      console.log("camera modello 2022");
      break;

    case "2026":
      camera.radius = 1000;
      camera.setTarget(new BABYLON.Vector3(0,0,0));
      camera.wheelDeltaPercentage = 0.05;
      camera.lowerRadiusLimit = 0;
      camera.upperRadiusLimit = 2000;
      console.log("camera modello 2026");
      break;

    case "mclaren":
      camera.radius = 7000;
      camera.setTarget(new BABYLON.Vector3(0, 250, 0));
      camera.lowerRadiusLimit = 70;
      camera.upperRadiusLimit = 7000;
      console.log("camera modello mcLaren");
      break;

    case "2024":
      camera.alpha = -Math.PI + 300;
      camera.beta = Math.PI / 2;
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
  if (modelloSelezionato) {
    modelloSelezionato.forEach(mesh => mesh.dispose());
    modelloSelezionato = null;
  }
  impostaCamera(nomeFile);

  const percorsoModelli = "../models/modify/";
  BABYLON.SceneLoader.ImportMesh(
    "",
    percorsoModelli,
    nomeFile + ".glb",
    scena,
    function (meshes) {
      modelloSelezionato = meshes;

      const dimensione = meshes[0].getHierarchyBoundingVectors();
      const centro = BABYLON.Vector3.Center(dimensione.min, dimensione.max);
      meshes.forEach(mesh => {
        mesh.position.subtractInPlace(centro);
      });

      const grandezzaModello = dimensione.max.subtract(dimensione.min);
      const dimensioneMax = Math.max(grandezzaModello.x, grandezzaModello.y, grandezzaModello.z);
      camera.radius = dimensioneMax * 2;

      //Colora ruote
      const ruoteDaColorare = ["Object_235", "Object_219", "Object_227", "Object_243"];
      const materiale = new BABYLON.StandardMaterial("nero", scena);
      materiale.diffuseColor = new BABYLON.Color3(0, 0, 0);

      ruoteDaColorare.forEach(nomeRuota => {
          let meshRuota = scena.getMeshByName(nomeRuota);

          if (meshRuota) {
              meshRuota.material = materiale;
          }
      }); 

      console.log("modello: ", nomeFile);
    },
    null,
    function (scena, message) {
      console.error("errore: ", message);
    }
  );
}
caricaModello3D(modello);

function tornaIndietro() {
  if(confirm("Stai per perdere il tuo lavoro, sei sicuro di eliminarlo??")){
    window.location.href = "selectModel.html";
  }
}

engine.runRenderLoop(function () {
  scena.render();
});

window.addEventListener("resize", () => {
  engine.resize();
});