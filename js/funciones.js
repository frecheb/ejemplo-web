
function activarHeaderCompacto() {
    const header = document.querySelector("header");

    let desplazamiento = 0;
    const desplazamientoMaximo = 40;

    function actualizarHeader() {
        const progreso = Math.min(
            Math.max(desplazamiento / desplazamientoMaximo, 0),
            1
        );

        const interpolar = (inicial, final) =>
            inicial + (final - inicial) * progreso;

        header.style.setProperty(
            "--header-padding",
            `${interpolar(30, 12)}px`
        );

        header.style.setProperty(
            "--header-title-size",
            `${interpolar(2, 1.2)}rem`
        );

        header.style.setProperty(
            "--header-nav-padding",
            `${interpolar(8, 5)}px ${interpolar(20, 14)}px`
        );

        header.style.setProperty(
            "--header-icon-size",
            `${interpolar(32, 20)}px`
      );
    }

    window.addEventListener("wheel", (evento) => {
        desplazamiento += evento.deltaY;

        desplazamiento = Math.min(
            Math.max(desplazamiento, 0),
            desplazamientoMaximo
        );

        actualizarHeader();
    }, { passive: true });

    actualizarHeader();
}



function cargarHeader() {
  fetch("componentes/header.html")
    .then(response => response.text())
    .then(data => {
      document.querySelector("header").innerHTML = data;
      activarHeaderCompacto();
    });
}

function cargarFooter() {
  fetch("componentes/footer.html")
    .then(response => response.text())
    .then(data => {
      document.querySelector("footer").innerHTML = data;
    });
}
