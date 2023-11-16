/**
 * @file WebcamView.js
 * @description Entry point for Web Component of ChatBot
 * @license GPL-3.0
 *
 * Webcam - Web Component for ChatBot
 * Copyright (c) 2023 Omar Lopez, 
 *                    Evelyn Oliva, 
 *                    Karen Manchado, 
 *                    Facundo Caminos, 
 *                    Ignacio Moreno,
 *                    Kevin Taylor,
 *                    Matias Cardenas
 *                    Daniel Beinat
 *                    ISFT N° 151
 *
 *  Project Supervisor: Prof. Matias Santiago Gastón
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 * Year: 2023
 */

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

    this.confirmarBoton.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('x-event-on-confirm-photo'));
      this.parentNode.removeChild(this);
    });

    this.botonNuevaFoto = createElement("button", { id: "botonNuevaFoto" });
    this.botonNuevaFoto.innerText = "Tomar otra foto";
    this.botonNuevaFoto.disabled = true;

    this.lienzo = createElement("canvas", {
      id: "lienzo",
      width: 320,
      height: 240,
    });

    this.contenedorControles = createElement("div", {
      class: "contenedor-controles",
    });

    this.lienzo.style.display = "none";

    this.capturarBoton.addEventListener('click', () => {
      this.video.style.display = "none";
      this.lienzo.style.display = "block";
    });


    this.botonNuevaFoto.addEventListener('click', () => {
      this.lienzo.style.display = "none";
      this.video.style.display = "block";
    });

    this.contenedorControles.appendChild(this.capturarBoton);
    this.contenedorControles.appendChild(this.confirmarBoton);
    this.contenedorControles.appendChild(this.botonNuevaFoto);



    this.elementoMensajeError = createElement("span", {
      id: "elementoMensajeError",
    });

    this.appendChild(this.contenedorVideo);
    this.appendChild(this.lienzo);
    this.appendChild(this.contenedorControles);
  }

  mostrarMensajeError(error) {
    this.elementoMensajeError.innerHTML = error;
  }
}

customElements.define("webcam-view", WebcamView);

export { WebcamView };
