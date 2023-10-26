import { createElement } from "./WCUtility.js";

class WebcamView extends HTMLElement {
  constructor() {
    super();

    this.video = createElement("video", {
      id: "video",
      playsinline: true,
      autoplay: true,
      width: 320,
      height: 240,
    });

    this.contenedorVideo = createElement("div", { class: "contenedor-video" });
    this.contenedorVideo.appendChild(this.video);

    this.capturarBoton = createElement("button", { id: "capturar" });
    this.capturarBoton.innerText = "Capturar";

    this.confirmarBoton = createElement("button", { id: "confirmar " });
    this.confirmarBoton.innerText = "Confirmar";

    // this.botonDescargar = createElement("button", { id: "botonDescargar" });
    // this.botonDescargar.innerText = "Descargar Foto";
    // this.botonDescargar.disabled = true;

    this.botonNuevaFoto = createElement("button", { id: "botonNuevaFoto" });
    this.botonNuevaFoto.innerText = "Tomar otra foto";
    this.botonNuevaFoto.disabled = true;

    this.contenedorControles = createElement("div", {
      class: "contenedor-controles",
    });

    this.contenedorControles.appendChild(this.capturarBoton);
    this.contenedorControles.appendChild(this.confirmarBoton);
    // this.contenedorControles.appendChild(this.botonDescargar);
    this.contenedorControles.appendChild(this.botonNuevaFoto);

    this.lienzo = createElement("canvas", {
      id: "lienzo",
      width: 320,
      height: 240,
    });

    this.elementoMensajeError = createElement("span", {
      id: "elementoMensajeError",
    });

    this.appendChild(this.contenedorVideo);
    this.appendChild(this.contenedorControles);
    this.appendChild(this.lienzo);
  }

  mostrarMensajeError(error) {
    this.elementoMensajeError.innerHTML = error;
  }
}

customElements.define("webcam-view", WebcamView);

export { WebcamView };
