// Seleccionar elementos HTML y asignarlos a variables
const textoEscribir = document.querySelector(".textoEscrito p"),
  campoEntrada = document.querySelector(".board .campoEntrada"),
  btnIntentarDeNuevo = document.querySelector(".contenido button"),
  etiquetaTiempo = document.querySelector(".tiempo span b"),
  etiquetaErrores = document.querySelector(".error span"),
  etiquetaPPM = document.querySelector(".ppm span"), 
  etiquetaCPM = document.querySelector(".cpm span"); 

// Declaración de variables
let temporizador,
  tiempoMaximo = 60,
  tiempoRestante = tiempoMaximo,
  indiceCaracter = errores = estaEscribiendo = 0;

// Función para cargar un párrafo aleatorio en el elemento de texto
function cargarParrafo() {
  // Se supone que hay una variable llamada "facil" que contiene los párrafos
  let paragraphs = facil;

  // Seleccionar un índice aleatorio dentro del rango de párrafos disponibles
  const ranIndex = Math.floor(Math.random() * paragraphs.length);

  // Limpiar el elemento de texto
  textoEscribir.innerHTML = "";

  // Dividir el párrafo en caracteres y agregar cada uno dentro de un elemento <span>
  paragraphs[ranIndex].split("").forEach(char => {
    let span = `<span>${char}</span>`
    textoEscribir.innerHTML += span;
  });

  // Marcar el primer carácter como activo
  textoEscribir.querySelectorAll("span")[0].classList.add("active");
}

// Función para iniciar la escritura
function iniciarEscritura() {
  let caracteres = textoEscribir.querySelectorAll("span");
  let caracterEscrito = campoEntrada.value.split("")[indiceCaracter];

  // Verificar si el usuario aún tiene tiempo y no ha completado el texto
  if (indiceCaracter < caracteres.length - 1 && tiempoRestante > 0) {
    // Iniciar el temporizador si aún no se ha iniciado
    if (!estaEscribiendo) {
      temporizador = setInterval(iniciarTemporizador, 1000);
      estaEscribiendo = true;
    }

    // Verificar si se borró un carácter
    if (caracterEscrito == null) {
      if (indiceCaracter > 0) {
        indiceCaracter--;
        if (caracteres[indiceCaracter].classList.contains("incorrect")) {
          errores--; // Restar un error si el carácter borrado era incorrecto
        }
        caracteres[indiceCaracter].classList.remove("correct", "incorrect"); // Quitar las clases de estilo
      }
    } else {
      // Verificar si el carácter escrito es correcto o incorrecto
      if (caracteres[indiceCaracter].innerText == caracterEscrito) {
        caracteres[indiceCaracter].classList.add("correct"); // Marcar como correcto
      } else {
        errores++; // Incrementar el contador de errores
        caracteres[indiceCaracter].classList.add("incorrect"); // Marcar como incorrecto
      }
      indiceCaracter++; // Avanzar al siguiente carácter
    }

    // Actualizar el estilo para resaltar el carácter actual
    caracteres.forEach(span => span.classList.remove("active"));
    caracteres[indiceCaracter].classList.add("active");

    // Calcular palabras por minuto (PPM) y caracteres por minuto (CPM)
    let ppm = Math.round(((indiceCaracter - errores) / 5) / (tiempoMaximo - tiempoRestante) * 60);
    ppm = ppm < 0 || !ppm || ppm === Infinity ? 0 : ppm; // Manejar casos especiales
    etiquetaPPM.innerText = ppm; // Actualizar etiqueta de PPM
    etiquetaErrores.innerText = errores; // Actualizar etiqueta de errores
    etiquetaCPM.innerText = indiceCaracter - errores; // Actualizar etiqueta de CPM
  } else {
    // Si se acabó el tiempo o se completó el texto, detener el temporizador y limpiar el campo de entrada
    clearInterval(temporizador);
    campoEntrada.value = "";
  }
}

// Función para iniciar el temporizador
function iniciarTemporizador() {
  if (tiempoRestante > 0) {
    tiempoRestante--; // Reducir el tiempo restante
    etiquetaTiempo.innerText = tiempoRestante; // Actualizar etiqueta de tiempo
    let ppm = Math.round(((indiceCaracter - errores) / 5) / (tiempoMaximo - tiempoRestante) * 60);
    etiquetaPPM.innerText = ppm; // Actualizar etiqueta de PPM
  } else {
    // Si se acabó el tiempo, detener el temporizador, guardar PPM y CPM en almacenamiento local y redirigir al usuario
    clearInterval(temporizador);
    localStorage.setItem('ppm', etiquetaPPM.innerText);
    localStorage.setItem('cpm', etiquetaCPM.innerText);
    window.location.href = 'final.html';
  }
}

// Función para reiniciar el juego
function reiniciarJuego() {
  // Cargar un nuevo párrafo y restablecer las variables
  cargarParrafo();
  clearInterval(temporizador);
  tiempoRestante = tiempoMaximo;
  indiceCaracter = errores = estaEscribiendo = 0;
  campoEntrada.value = "";
  etiquetaTiempo.innerText = tiempoRestante;
  etiquetaPPM.innerText = 0;
  etiquetaErrores.innerText = 0;
  etiquetaCPM.innerText = 0;
  
  // Volver a vincular el event listener para detectar la escritura en el campo de entrada
  campoEntrada.addEventListener("input", iniciarEscritura);
  
  // Enfocar el campo de entrada después de reiniciar el juego
  campoEntrada.focus();
}
