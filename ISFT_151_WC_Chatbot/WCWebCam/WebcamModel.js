/**
 * @file WebcamModel.js
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

class WebcamModel {
  constructor() {
    this.stream = null;
    this.restricciones = {
      audio: true,
      video: {
        width: 320,
        height: 240,
      },
    };
  }

  async inicializar() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia(
        this.restricciones
      );
      return this.stream;
    } catch (e) {
      throw new Error(`Error de navigator.getUserMedia: ${e.toString()}`);
    }
  }
}

export { WebcamModel };
