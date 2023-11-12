import { WebcamView } from "../WCWebCam/WebcamView.js";
import { WebcamModel } from "../WCWebCam/WebcamModel.js";
import { WebcamController } from "../WCWebCam/WebcamController.js";

class ChatBotView extends HTMLElement {
  constructor() {
    super();

    // let cameraView = new WebcamView();
    // let cameraModel = new WebcamModel();
    // let cameraController = new WebcamController(cameraView,cameraView);

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
    this.userInput.placeholder = "Escriba su message...";
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

    this.buttonsContainer.appendChild(this.userInput);
    this.buttonsContainer.appendChild(this.sendButton);

    this.chatbotContainer = document.createElement("div");
    this.chatbotContainer.className = "chatbot";
    this.chatbotContainer.appendChild(this.header);
    this.chatbotContainer.appendChild(this.progressBar);

    this.chatbotContainer.appendChild(this.chatbox);

    this.chatbotContainer.appendChild(this.buttonsContainer);

    this.chatbotToggler = document.createElement("button");
    this.chatbotToggler.className = "chatbot-toggler";

    this.iconModeComment = document.createElement("span");
    this.iconModeComment.className = "material-symbols-rounded";
    this.iconModeComment.textContent = "mode_comment";

    this.iconClose = document.createElement("span");
    this.iconClose.className = "material-symbols-outlined";
    this.iconClose.textContent = "close";

    this.chatbotToggler.appendChild(this.iconModeComment);
    this.chatbotToggler.appendChild(this.iconClose);

    this.appendChild(this.chatbotToggler);
    this.appendChild(this.chatbotContainer);

    const closeBtn = this.chatbotContainer.querySelector(".close-btn");
    closeBtn.addEventListener("click", () =>
      this.classList.remove("show-chatbot")
    );

    this.chatbotToggler.addEventListener("click", () =>
      this.classList.toggle("show-chatbot")
    );

    this.userInput.addEventListener("input", () => {
      this.sendButton.style.visibility = this.userInput.validity.valid
        ? "visible"
        : "hidden";
    });

    // Agregar la clase 'show-chatbot' al body para abrir el chatbot por defecto
    this.classList.add("show-chatbot");
  }

  connectedCallback() {
    this.sendButton.addEventListener("click", () => {
      this.enviarMensaje();
    });

    this.userInput.addEventListener("keydown", (event) => {
      if (event.keyCode === 13) {
        // Tecla "Enter"
        event.preventDefault();
        this.enviarMensaje();
      }
    });
  }

  enviarMensaje() {
    const respuestaUsuario = this.userInput.value;
    // this.addMessage(`Tú: ${respuestaUsuario}`, false);
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

    // Creación del icono de chat
    const chatIconSpan = document.createElement("span");
    chatIconSpan.className = "material-symbols-outlined";
    chatIconSpan.textContent = chatIcon;

    // Creación del párrafo del message
    const chatMessageParagraph = document.createElement("p");
    chatMessageParagraph.textContent = message;

    // Agregar elementos al message
    chatMessage.appendChild(chatIconSpan);
    chatMessage.appendChild(chatMessageParagraph);

    this.chatbox.appendChild(chatMessage);

    this.chatbox.scrollTop = this.chatbox.scrollHeight;
  }
}

customElements.define("chat-bot-view", ChatBotView);

export { ChatBotView };