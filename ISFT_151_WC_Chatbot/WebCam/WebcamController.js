class WebcamController {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.stream = null;

    this.view.capturarBoton.addEventListener("click", () =>
      this.capturarFoto()
    );

    this.view.confirmarBoton.addEventListener("click", () =>
      this.confirmarFoto()
    );

    // this.view.botonDescargar.addEventListener("click", () =>
    //   this.descargarFoto()
    // );

    this.view.botonNuevaFoto.addEventListener("click", () =>
      this.tomarOtraFoto()
    );
  }

  async inicializar() {
    try {
      this.stream = await this.model.inicializar();
      this.view.video.srcObject = this.stream;
    } catch (error) {
      this.view.mostrarMensajeError(error);
    }
  }

  capturarFoto() {
    const contexto = this.view.lienzo.getContext("2d");
    contexto.drawImage(this.view.video, 0, 0, 320, 240);
    // this.view.botonDescargar.disabled = false;
    this.view.botonNuevaFoto.disabled = false;
  }

  async detenerCamara() {
    if (this.stream) {
      // Recorre todas las pistas de la cámara y desactívalas
      this.stream.getTracks().forEach((track) => {
        track.enabled = false;
        track.stop();
      });
    }

    // Elimina todo el contenido de la cámara
    // const contenedorCamara = document.querySelector(".contenedor-video");
    // if (contenedorCamara) {
    //   contenedorCamara.parentNode.removeChild(contenedorCamara);
    // }

    const webcamView = document.querySelector("webcam-view");
    if (webcamView) {
      webcamView.parentNode.removeChild(webcamView);
    }

    // Elimina también el contenedor de controles
    // const contenedorControles = document.querySelector(".contenedor-controles");
    // if (contenedorControles) {
    //   contenedorControles.parentNode.removeChild(contenedorControles);
    // }
  }

  // async confirmarFoto() {
  //   this.detenerCamara();
  // }

  async confirmarFoto(callback) {
    this.detenerCamara();

    // Llama al callback (en este caso, el callback es una función de ChatBotController).
    if (callback) {
      callback();
    }
  }

  cancelarFoto() {
    this.detenerCamara();
  }

  tomarOtraFoto() {
    const contexto = this.view.lienzo.getContext("2d");
    contexto.clearRect(0, 0, this.view.lienzo.width, this.view.lienzo.height);
    // this.view.botonDescargar.disabled = true;
    this.view.botonNuevaFoto.disabled = true;
  }
}

export { WebcamController };
