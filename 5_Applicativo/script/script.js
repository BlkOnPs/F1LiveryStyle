function cambioBackground() {
    let data = new Date();
    let ore = data.getHours();

    if (ore >= 20 || ore <= 6) {
        document.body.classList.add("night");
    } else {
        document.body.classList.remove("night");
    }
}

function mostraModello3D() {
    const selezionato = document.querySelector("input[name='modello']:checked");
    console.log(selezionato.value);

    /*switch (selezionato){

    }*/
}

document.querySelectorAll("input[name='modello']").forEach(radio => {
    radio.addEventListener("change", mostraModello3D);
});
cambioBackground();