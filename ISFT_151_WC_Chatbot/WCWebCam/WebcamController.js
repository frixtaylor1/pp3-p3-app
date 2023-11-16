/**
 * @file WebcamController.js
 * @description Entry point for Web Component of ChatBot
 * @license GPL-3.0
 *
 * Webcam - Web Component for ChatBot
 * Copyright (c) 2023 Omar Lopez, 
 *                    Evelyn Flores, 
 *                    Karen Manchado, 
 *                    Facundo Caminos, 
 *                    Ignacio Moreno,
 *                    Kevin Taylor,
 *                    Matias Cardenas
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

class WebcamController {
  #imageData = undefined;
  constructor(view, model) {
    this.view         = view;
    this.model        = model;
    this.stream       = null;
    this.#imageData   = null;

    this.view.capturarBoton.addEventListener("click", () =>
      this.capturarFoto()
    );

    this.view.confirmarBoton.addEventListener("click", () =>
      this.confirmarFoto()
    );

    this.view.botonNuevaFoto.addEventListener("click", () =>
      this.tomarOtraFoto()
    );

    this.view.addEventListener('x-event-on-confirm-photo', () => {
      let base64String = btoa(this.#imageData.data);

      document.dispatchEvent(new CustomEvent('x-event-on-confirmed-photo', {
        detail: {
          imageData: base64String,
        }
      }));
    });
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


    this.#imageData = contexto.getImageData(0, 0, 320, 240);

    this.view.botonNuevaFoto.disabled = false;
  }

  get imageData() {
    return this.#imageData;
  }

  async detenerCamara() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        track.enabled = false;
        track.stop();
      });
    }

  }

  async confirmarFoto(callback) {
    this.detenerCamara();

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
    this.view.botonNuevaFoto.disabled = true;
  }
}

export { WebcamController };
