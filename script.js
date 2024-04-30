const textoEscribir = document.querySelector(".textoEscrito p"),
  campoEntrada = document.querySelector(".board .campoEntrada"),
  btnIntentarDeNuevo = document.querySelector(".contenido button"),
  etiquetaTiempo = document.querySelector(".tiempo span b"),
  etiquetaErrores = document.querySelector(".error span"),
  etiquetaPPM = document.querySelector(".ppm span"),
  etiquetaCPM = document.querySelector(".cpm span");

let temporizador,
  tiempoMaximo = 60,
  tiempoRestante = tiempoMaximo,
  indiceCaracter = errores = estaEscribiendo = 0;

function cargarParrafo() {
  let paragraphs = facil;

  const ranIndex = Math.floor(Math.random() * paragraphs.length);
  textoEscribir.innerHTML = "";
  paragraphs[ranIndex].split("").forEach(char => {
    let span = `<span>${char}</span>`
    textoEscribir.innerHTML += span;
  });
  textoEscribir.querySelectorAll("span")[0].classList.add("active");
}

function iniciarEscritura() {
  let caracteres = textoEscribir.querySelectorAll("span");
  let caracterEscrito = campoEntrada.value.split("")[indiceCaracter];
  if (indiceCaracter < caracteres.length - 1 && tiempoRestante > 0) {
    if (!estaEscribiendo) {
      temporizador = setInterval(iniciarTemporizador, 1000);
      estaEscribiendo = true;
    }
    if (caracterEscrito == null) {
      if (indiceCaracter > 0) {
        indiceCaracter--;
        if (caracteres[indiceCaracter].classList.contains("incorrect")) {
          errores--;
        }
        caracteres[indiceCaracter].classList.remove("correct", "incorrect");
      }
    } else {
      if (caracteres[indiceCaracter].innerText == caracterEscrito) {
        caracteres[indiceCaracter].classList.add("correct");
      } else {
        errores++;
        caracteres[indiceCaracter].classList.add("incorrect");
      }
      indiceCaracter++;
    }
    caracteres.forEach(span => span.classList.remove("active"));
    caracteres[indiceCaracter].classList.add("active");

    let ppm = Math.round(((indiceCaracter - errores) / 5) / (tiempoMaximo - tiempoRestante) * 60);
    ppm = ppm < 0 || !ppm || ppm === Infinity ? 0 : ppm;

    etiquetaPPM.innerText = ppm;
    etiquetaErrores.innerText = errores;
    etiquetaCPM.innerText = indiceCaracter - errores;
  } else {
    clearInterval(temporizador);
    campoEntrada.value = "";
  }
}

function iniciarTemporizador() {
  if (tiempoRestante > 0) {
      tiempoRestante--;
      etiquetaTiempo.innerText = tiempoRestante;
      let ppm = Math.round(((indiceCaracter - errores) / 5) / (tiempoMaximo - tiempoRestante) * 60);
      etiquetaPPM.innerText = ppm;
  } else {
      // Detener el temporizador y guardar los valores de PPM y CPM en el almacenamiento local
      clearInterval(temporizador);
      localStorage.setItem('ppm', etiquetaPPM.innerText);
      localStorage.setItem('cpm', etiquetaCPM.innerText);
      // Redireccionar al usuario a final.html al finalizar el temporizador
      window.location.href = 'final.html';

  }
}

function reiniciarJuego() {
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




