// Estado de la calculadora
let resultadoMostrado = false;
let expresion = "";

function escribir(valor) {
    let pantalla = document.getElementById("pantalla");

    // Comprobar si el valor introducido es un operador
    const esOperador = ["+", "-", "*", "/", "%"].includes(valor);

    // Si acabamos de obtener un resultado
    if (resultadoMostrado) {

        // Si introducimos un número, empezamos de cero
        if (!esOperador) {
            expresion = valor;

        // Si introducimos un operador, continuamos desde el resultado
        } else {
            expresion = expresion + valor;
        }

        resultadoMostrado = false;

    } else {
        // Añadir el valor a la expresión
        expresion += valor;
    }

    // Adaptar la expresión para mostrarla en pantalla
    pantalla.value = formatearExpresion(expresion);
    ajustarFuente();
}

function evaluarExpresion(expresion) {

    // Separar la expresión en números y operadores
    const tokens = expresion.match(/\d+(?:\.\d+)?|[+\-*/%]/g);

    // Comprobar que todos los caracteres son válidos
    if (!tokens || tokens.join("") !== expresion) {
        throw new Error("Expresión no válida");
    }

    let posicion = 0;

    // Resolver números y signos negativos
    function obtenerNumero() {
        let signo = 1;

        if (tokens[posicion] === "-") {
            signo = -1;
            posicion++;
        } else if (tokens[posicion] === "+") {
            posicion++;
        }

        const numero = Number(tokens[posicion]);

        if (tokens[posicion] === undefined || !Number.isFinite(numero)) {
            throw new Error("Número no válido");
        }

        posicion++;

        return signo * numero;
    }

    // Resolver multiplicaciones, divisiones y módulos
    function obtenerTermino() {
        let resultado = obtenerNumero();

        while (["*", "/", "%"].includes(tokens[posicion])) {
            const operador = tokens[posicion];
            posicion++;

            const siguienteNumero = obtenerNumero();

            if ((operador === "/" || operador === "%") && siguienteNumero === 0) {
                throw new Error("No se puede dividir entre cero");
            }

            if (operador === "*") resultado *= siguienteNumero;
            if (operador === "/") resultado /= siguienteNumero;
            if (operador === "%") resultado %= siguienteNumero;
        }

        return resultado;
    }

    // Resolver sumas y restas
    function obtenerExpresion() {
        let resultado = obtenerTermino();

        while (tokens[posicion] === "+" || tokens[posicion] === "-") {
            const operador = tokens[posicion];
            posicion++;

            const siguienteTermino = obtenerTermino();

            if (operador === "+") resultado += siguienteTermino;
            if (operador === "-") resultado -= siguienteTermino;
        }

        return resultado;
    }

    const resultado = obtenerExpresion();

    // Comprobar que se ha procesado toda la expresión
    if (posicion !== tokens.length) {
        throw new Error("Expresión no válida");
    }

    return resultado;
}

function formatearNumero(numero) {
    return numero.toLocaleString("es-ES", {
        maximumFractionDigits: 10,
        useGrouping: true
    });
}

function formatearExpresion(expresion) {
    return expresion
        .replace(/\d+(?:\.\d+)?/g, numero =>
            Number(numero).toLocaleString("es-ES", {
                maximumFractionDigits: 10,
                useGrouping: true
            })
        )
        .replace(/\*/g, "×");
}

function calcular() {
    let pantalla = document.getElementById("pantalla");

    try {
        // Evaluar la expresión matemática
        let resultado = evaluarExpresion(expresion);

        // Comprobar que el resultado sea válido
        if (!Number.isFinite(resultado)) {
            throw new Error("Resultado no válido");
        }

        // Redondear para evitar errores de precisión
        resultado = Number(resultado.toFixed(10));

        // Guardar el resultado internamente
        expresion = String(resultado);

        // Mostrar el resultado utilizando coma decimal
        pantalla.value = formatearNumero(resultado);

        // Indicar que acabamos de calcular
        resultadoMostrado = true;

    } catch (error) {
        pantalla.value = "Error";
        expresion = "";
        resultadoMostrado = false;
    }
}

function aCero() {
    let pantalla = document.getElementById("pantalla");

    // Reiniciar la expresión
    expresion = "";

    // Reiniciar el estado
    resultadoMostrado = false;

    // Mostrar el cero inicial
    pantalla.value = "0";

    // Restablecer el tamaño de la fuente
    ajustarFuente();
}

function borrar() {
    let pantalla = document.getElementById("pantalla");

    // Si acabamos de obtener un resultado, reiniciamos
    if (resultadoMostrado) {
        aCero();
        return;
    }

    // Eliminar el último carácter
    expresion = expresion.slice(0, -1);

    // Si la expresión queda vacía, mostrar cero
    if (expresion === "") {
        expresion = "";
        pantalla.value = "0";
    } else {
    pantalla.value = formatearExpresion(expresion);
    }

    // Recalcular el tamaño de la fuente
    ajustarFuente();
}

function cambiarSigno() {
    let pantalla = document.getElementById("pantalla");

    // No hacer nada si no hay un número válido
    if (expresion === "" || expresion === "0") {
        return;
    }

    // Cambiar el signo del número
    let partes = expresion.match(/(.*[+\-*/%])?(-?\d+(?:\.\d+)?)$/);

    if (!partes) {
        return;
    }

    let numero = Number(partes[2]);
    numero *= -1;

    expresion = (partes[1] || "") + numero;

    pantalla.value = expresion.replace(/\*/g, "×");
    resultadoMostrado = false;
}

function decimal() {
    let pantalla = document.getElementById("pantalla");

    if (resultadoMostrado) {
        expresion = "0.";
        resultadoMostrado = false;

    } else {
        // Obtener el último número de la expresión
        let partes = expresion.split(/[+*/%]/);
        let ultimoNumero = partes[partes.length - 1];

        // Comprobar si ya existe un decimal
        if (ultimoNumero.includes(".")) {
            return;
        }

        // Añadir cero si empezamos un número nuevo
        if (expresion === "" || /[+*/%]$/.test(expresion)) {
            expresion += "0.";
        } else {
            expresion += ".";
        }
    }

    pantalla.value = expresion.replace(/\*/g, "×").replace(/\./g, ",");
}

function ajustarFuente() {
    const pantalla = document.getElementById("pantalla");

    const tamanoMaximo = 2.6;
    const tamanoMinimo = 1.2;

    // Calcular el espacio real disponible para el texto
    const estilos = getComputedStyle(pantalla);

    const espacioDisponible =
        pantalla.clientWidth -
        parseFloat(estilos.paddingLeft) -
        parseFloat(estilos.paddingRight) -
        parseFloat(estilos.borderLeftWidth) -
        parseFloat(estilos.borderRightWidth);

    // Medir la anchura del texto
    const canvas = document.createElement("canvas");
    const contexto = canvas.getContext("2d");

    let tamano = tamanoMaximo;

    while (tamano > tamanoMinimo) {
        contexto.font = `500 ${tamano * parseFloat(getComputedStyle(document.documentElement).fontSize)}px system-ui`;

        if (contexto.measureText(pantalla.value).width <= espacioDisponible) {
            break;
        }

        tamano -= 0.05;
    }

    // Modificar exclusivamente el tamaño del texto
    pantalla.style.fontSize = `${Math.max(tamano, tamanoMinimo)}rem`;
}