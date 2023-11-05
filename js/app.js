const cartas = document.querySelectorAll(".carta");

let VueltaPrimeraCarta = false;
let tableroBloqueado = false;
let primeraCarta, segundaCarta;

let segundos = 0;
let intervalo;
let intentos = 0;
let juegoIniciado = false;

let url = "https://memoramaligamx-default-rtdb.firebaseio.com/";

const jugar = document.querySelector(".jugar");
const memorama = document.querySelector(".memorama");
const temporizadorElement = document.getElementById("temporizador");
const numIntentos = document.getElementById("numIntentos");

document.addEventListener('DOMContentLoaded', async function () {
  try {
    const response = await fetch(`${url}/jugadores.json`);
    const jugadores = await response.json();
    renderTable(jugadores);
  } catch (error) {
    console.error("Ha ocurrido un error: ", error);
  }
});

function renderTable(data) {
  let tbody = document.getElementById('alumnosTable');
  let rowHTML = '';

  Object.keys(data).forEach(key => {
    rowHTML += `<tr>
      <td>${data[key].nombre}</td>
      <td>${data[key].tiempo}</td>
      <td>${data[key].intentos}</td>

    </tr>`;
  });
  tbody.innerHTML = rowHTML;
}
function darVueltaCarta() {
  if (tableroBloqueado) return;
  if (this === primeraCarta) return;

  this.classList.add("dada_vuelta");

  if (!VueltaPrimeraCarta) {
    VueltaPrimeraCarta = true;
    primeraCarta = this;
    return;
  }

  segundaCarta = this;
  verificarPar();
}

function verificarPar() {
  intentos++;
  numIntentos.textContent = `Intentos: ${intentos}`;
  if (
    primeraCarta.querySelector("img").src ===
    segundaCarta.querySelector("img").src
  ) {
    deshabilitarCartas();
  } else {
    voltearCartas();
  }
}

function deshabilitarCartas() {
  primeraCarta.classList.add("par");
  segundaCarta.classList.add("par");

  resetearTablero();
  verificarVictoria();
}

function voltearCartas() {
  tableroBloqueado = true;

  setTimeout(() => {
    primeraCarta.classList.remove("dada_vuelta");
    segundaCarta.classList.remove("dada_vuelta");

    resetearTablero();
  }, 1000);
}

function resetearTablero() {
  [VueltaPrimeraCarta, tableroBloqueado] = [false, false];
  [primeraCarta, segundaCarta] = [null, null];
}

function desordenarCartas() {
  // Obtén el contenedor y las tarjetas
  const arrayCartas = Array.from(cartas);

  // Guarda el contenido original de las tarjetas en un array
  const contenidoOriginal = arrayCartas.map((carta) => carta.innerHTML);

  // Función para reorganizar el contenido aleatoriamente
  function revolverCartas(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Reorganiza el contenido aleatoriamente
  revolverCartas(contenidoOriginal);

  // Asigna el contenido reorganizado a las tarjetas
  arrayCartas.forEach((carta, index) => {
    carta.innerHTML = contenidoOriginal[index];
  });
}

function formatTime(segundos) {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const segundosRestantes = segundos % 60;
  return `${horas.toString().padStart(2, "0")}:${minutos
    .toString()
    .padStart(2, "0")}:${segundosRestantes.toString().padStart(2, "0")}`;
}

function actualizarTemporizador() {
  temporizadorElement.textContent = formatTime(segundos);
  segundos++;
}

// Función para iniciar el temporizador
function iniciarTemporizador() {
  segundos = 0;
  intervalo = setInterval(actualizarTemporizador, 1000);
}

function comenzarJuego() {
  const mensajeVictoria = document.getElementById("mensajeVictoria");
  mensajeVictoria.style.display = "none";
  cartas.forEach((carta) => {
    carta.classList.remove("par");
    carta.classList.remove("dada_vuelta");
  });
  const nombre = document.getElementById("nombre");
  if (nombre.value.trim() != "") {
    if (juegoIniciado == false) {
      nombre.disabled = true;
      juegoIniciado = true;
      desordenarCartas();
      memorama.classList.remove("bloqueo");
      iniciarTemporizador();
      jugar.classList.add("reiniciar");
      jugar.textContent = "Reiniciar";
      intentos = 0;
      numIntentos.textContent = `Intentos: ${intentos}`;
    } else {
      console.log('entre');
      nombre.disabled = false;
      juegoIniciado = false;
      clearInterval(intervalo);
      segundos = 0;
      temporizadorElement.textContent = "00:00:00";
      desordenarCartas();
      memorama.classList.add("bloqueo");
      //iniciarTemporizador();
      jugar.classList.remove("reiniciar");
      jugar.textContent = "Jugar";
      intentos = 0;
      numIntentos.textContent = `Intentos: ${intentos}`;
    }
  }
}
function verificarVictoria() {
  const cartasEmparejadas = document.querySelectorAll(".carta.par");
  if (cartasEmparejadas.length === cartas.length) {
    clearInterval(intervalo); // Detener el temporizador
    const mensajeVictoria = document.getElementById("mensajeVictoria");
    mensajeVictoria.style.display = "block";
  }
}

function añadirRank() {
  const nombre = document.getElementsByClassName("nombre").value;
  console.log(nombre);
}
jugar.addEventListener("click", comenzarJuego);

cartas.forEach((carta) => carta.addEventListener("click", darVueltaCarta));


