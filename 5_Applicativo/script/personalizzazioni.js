const colorPickerVettura = document.querySelector('input[name="colorPickerVettura"]');

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
