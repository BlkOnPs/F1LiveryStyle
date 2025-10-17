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
mostraModello3D();
