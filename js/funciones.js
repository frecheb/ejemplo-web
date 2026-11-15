
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

        header.style.setProperty(
            "--header-nav-font-size",
            `${interpolar(1, 0.85)}rem`
        );

        header.style.setProperty(
            "--header-nav-height",
            `${interpolar(42, 34)}px`
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
            activarMenusHeader();
        });
}


function cargarFooter() {
  fetch("componentes/footer.html")
    .then(response => response.text())
    .then(data => {
      document.querySelector("footer").innerHTML = data;
    });
}





function activarMenusHeader() {
    const nav = document.querySelector(".site-nav");

    if (!nav) return;

    // Gestionar únicamente HTML y CSS y sus submenús.
    const contenedorHTML = nav.querySelector(":scope > .nav-item:nth-child(2)");

    if (!contenedorHTML) return;

    const botones = contenedorHTML.querySelectorAll(".nav-toggle");

    botones.forEach(boton => {
        boton.addEventListener("click", evento => {
            evento.preventDefault();

            const elemento = boton.parentElement;
            const estabaAbierto = elemento.classList.contains("activo");

            // Alternar únicamente el menú pulsado.
            elemento.classList.toggle("activo", !estabaAbierto);
            boton.setAttribute("aria-expanded", String(!estabaAbierto));

            // Si se cierra HTML y CSS, cerrar también sus submenús.
            if (elemento === contenedorHTML && estabaAbierto) {
                elemento.querySelectorAll(".nav-item.activo").forEach(item => {
                    item.classList.remove("activo");

                    const toggle = item.querySelector(":scope > .nav-toggle");
                    if (toggle) {
                        toggle.setAttribute("aria-expanded", "false");
                    }
                });
            }
        });
    });
}
