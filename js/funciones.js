function cargarHeader() {
  fetch("../componentes/header.html")
    .then(response => response.text())
    .then(data => {
      document.querySelector("header").innerHTML = data;
    });
}

function cargarFooter() {
  fetch("../componentes/footer.html")
    .then(response => response.text())
    .then(data => {
      document.querySelector("footer").innerHTML = data;
    });
}
