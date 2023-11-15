/**
 * @file ChatBotView.js
 * @description Web Component View for ChatBot
 * @license GPL-3.0
 * 
 * WCChatBot - Web Component for Chat Bot
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

import { WebcamView } from "../WCWebCam/WebcamView.js";
import { WebcamModel } from "../WCWebCam/WebcamModel.js";
import { WebcamController } from "../WCWebCam/WebcamController.js";

class ChatBotView extends HTMLElement {
  constructor() {
    super();
  
    this.webCam = new WebcamView();
    this.webCamController = new WebcamController(this.webCam, new WebcamModel());

    // Crear el contenedor y agregar hijos a él
    this.container = document.createElement("div");
    this.container.className = "chatbot-container";

    this.chatbotContainer = document.createElement("div");
    this.chatbotContainer.className = "chatbot";
    this.container.appendChild(this.chatbotContainer);

    this.chatbotToggler = document.createElement("button");
    this.chatbotToggler.className = "chatbot-toggler";
    this.container.appendChild(this.chatbotToggler);

    const linkElement = document.createElement("link");
    linkElement.setAttribute("rel", "stylesheet");
    linkElement.setAttribute("href", "../WCChatbot/style.css");
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(linkElement);
    this.shadowRoot.appendChild(this.container);

    this.header = document.createElement("header");
    this.h2 = document.createElement("h2");
    this.h2.textContent = "Chatbot";

    this.closeBtn = document.createElement("span");
    this.closeBtn.className = "close-btn material-symbols-outlined";
    this.closeBtn.textContent = "close";

    this.header.appendChild(this.h2);
    this.header.appendChild(this.closeBtn);

    this.chatbox = document.createElement("ul");
    this.chatbox.className = "chatbox";

    this.userInput = document.createElement("textarea");
    this.userInput.className = "chat-input-text";
    this.userInput.placeholder = "Escriba su mensaje...";
    this.userInput.spellcheck = false;
    this.userInput.required = true;

    this.progressBar = document.createElement("div");
    this.progressBar.className = "progress-bar";
    this.progressBarFill = document.createElement("div");
    this.progressBarFill.className = "progress-bar-fill";
    this.progressBarText = document.createElement("div");
    this.progressBarText.className = "progress-bar-text";

    this.progressBar.appendChild(this.progressBarFill);
    this.progressBarFill.appendChild(this.progressBarText);

    this.sendButton = document.createElement("span");
    this.sendButton.id = "send-btn";
    this.sendButton.className = "material-symbols-rounded";
    this.sendButton.textContent = "send";
    this.sendButton.style.visibility = "hidden";

    this.buttonsContainer = document.createElement("div");
    this.buttonsContainer.className = "chat-input";
    this.buttonsContainer.style.display = "flex";
    this.buttonsContainer.style.gap = "5px";
    this.buttonsContainer.style.position = "absolute";
    this.buttonsContainer.style.bottom = "0";
    this.buttonsContainer.style.width = "100%";
    this.buttonsContainer.style.background = "#fff";
    this.buttonsContainer.style.padding = "3px 20px";
    this.buttonsContainer.style.borderTop = "1px solid #ddd";

    this.iconModeComment = document.createElement("span");
    this.iconModeComment.className = "material-symbols-rounded";
    this.iconModeComment.textContent = "mode_comment";

    this.iconClose = document.createElement("span");
    this.iconClose.className = "material-symbols-outlined";
    this.iconClose.textContent = "close";

    this.chatbotToggler.appendChild(this.iconModeComment);
    this.chatbotToggler.appendChild(this.iconClose);

    this.buttonsContainer.appendChild(this.userInput);
    this.buttonsContainer.appendChild(this.sendButton);

    this.chatbotContainer.appendChild(this.header);
    this.chatbotContainer.appendChild(this.progressBar);
    this.chatbotContainer.appendChild(this.chatbox);
    this.chatbotContainer.appendChild(this.buttonsContainer);

    const closeBtn = this.chatbotContainer.querySelector(".close-btn");
    closeBtn.addEventListener("click", () =>
      this.container.classList.remove("show-chatbot")
    );

    this.chatbotToggler.addEventListener("click", () =>
      this.container.classList.toggle("show-chatbot")
    );

    this.userInput.addEventListener("input", () => {
      this.sendButton.style.visibility = this.userInput.validity.valid
        ? "visible"
        : "hidden";
    });

    this.container.classList.add("show-chatbot");
  }

  connectedCallback() {
    this.sendButton.addEventListener("click", () => {
      this.enviarMensaje();
    });

    this.userInput.addEventListener("keydown", (event) => {
      if (event.keyCode === 13) {
        event.preventDefault();
        this.enviarMensaje();
      }
    });
        
    this.addEventListener('x-event-on-start-webcam', () => {
      this.chatbox.appendChild(this.webCam);
      this.webCamController.inicializar();
    });
  }

  enviarMensaje() {
    const respuestaUsuario = this.userInput.value;
    const event = new CustomEvent("send", { detail: respuestaUsuario });

    this.userInput.value = "";

    this.dispatchEvent(event);
  }

  setPercentBar(percent) {
    this.progressBarFill.style.width = `${percent}%`;
    this.progressBarText.textContent = `${Math.round(percent)}%`;
  }

  hidePercentBar() {
    this.progressBar.style.display = "none";
  }

  showPercentBar() {
    this.progressBar.style.display = "block";
  }

  clearInput() {
    this.userInput.value = "";
  }

  addMessage(message, esBot) {
    const chatClass = esBot ? "incoming" : "outgoing";
    const chatIcon = esBot ? "smart_toy" : "";

    const chatMessage = document.createElement("li");
    chatMessage.className = `chat ${chatClass}`;

    const chatIconSpan = document.createElement("span");
    chatIconSpan.className = "material-symbols-outlined";
    chatIconSpan.textContent = chatIcon;

    const chatMessageParagraph = document.createElement("p");
    chatMessageParagraph.textContent = message;

    chatMessage.appendChild(chatIconSpan);
    chatMessage.appendChild(chatMessageParagraph);

    this.chatbox.appendChild(chatMessage);

    this.chatbox.scrollTop = this.chatbox.scrollHeight;
  }
}
customElements.define("x-chat-bot-view", ChatBotView);

export { ChatBotView };