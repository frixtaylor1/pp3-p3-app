/**
 * @file ChatBotController.js
 * @description Controller for Web Web Component of ChatBot
 * @license GPL-3.0
 *
 * WCChatBot - Web Component for Chat Bot
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

import { ChatBotModel } from "./ChatBotModel.js";
import { ChatBotView }  from "./ChatBotView.js";

class ChatBotController 
{
  constructor(view = new ChatBotView(), model = new ChatBotModel()) {
    this.view = view;
    this.model = model;

    this.view.addEventListener("send", (e) => this.onSend(e));
    this.view.addEventListener("photoprofilereceived", (e) =>
      this.onPhotoProfileReceived(e)
    );

    this.startChat();
  }

  startChat() {
    // Inicia el chat mostrando la primera pregunta

    this.view.addMessage(this.model.getCurrentQuestion().text, true);
    this.view.hidePercentBar();
  }

  updateProgress() {
    let progress = this.model.getPreinscriptionPercent();

    if (progress >= 0) {
      this.view.setPercentBar(progress);
      this.view.showPercentBar();
    } else {
      this.view.hidePercentBar();
    }
  }

  onPhotoProfileReceived(event) {
    this.enableInput();
  }

  onSend(event) {
    let data = event.detail;

    this.view.addMessage(data);

    this.model.sendResponseToQuestion(data);

    this.view.clearInput();

    const nextQuestion = this.model.getCurrentQuestion();

    if (nextQuestion) {
      if (nextQuestion === "Necesitamos una foto tuya") {
        this.view.disableInput();
        this.view.openCamera();
      }
      this.view.addMessage(nextQuestion.text, true);
    }

    this.updateProgress();

    this.#onRegister();
    this.#onPreInscriptionStarted();
    this.#onStartWebcam();
    this.#onConfirmPhoto();
    this.#onCompleted();
  }

  #onCompleted() {
    if (this.model.isCompleted()) {
      let confirmPreinscriptionResult = this.model.confirmPreinscription();
      confirmPreinscriptionResult.then((result) => {
        console.log(result);
      });
      this.view.setPercentBar(0);
    }
  }

  #onRegister() {
    if (this.model.isRegistered()) {
      let registrationResult = this.model.signUp();
      registrationResult.then((result) => {
        console.log(result);
        localStorage.setItem('id_user', result.user_last_insert_id);
      })
    }
  }

  #onPreInscriptionStarted() {
    if (this.model.isPreinscriptionStarted()) {
      let preinscriptionStartedResult = this.model.startPreinscription();
      preinscriptionStartedResult.then((result) => {
        console.log(result);
        localStorage.setItem('id_major', result.id_major);
        localStorage.setItem('id_preinscription', result.id_preinscription);
      });
    }
  }

  #onStartWebcam() {
    if (this.model.shouldTakePhoto()) {
      this.view.dispatchEvent(new CustomEvent("x-event-on-start-webcam"));
    }
  }

  #onConfirmPhoto() {
    document.addEventListener('x-event-on-confirmed-photo', (event) => {
      this.model.webCamData = event.detail.imageData;
      this.model.sendPhoto();
    });
  }
}

export { ChatBotController };
