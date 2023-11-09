class ChatBotView extends HTMLElement 
{
  constructor() 
  {
    super();

    this.display = document.createElement("input");
    this.display.type = "text";
    this.display.disabled = "false";
    this.display.value = "";

    this.container = document.createElement("div");
    this.container.style.width = "400px";
    this.container.style.margin = "0 auto";
    this.container.style.fontFamily = "Arial, sans-serif";

    this.chatBox = document.createElement("div");
    this.chatBox.style.height = "300px";
    this.chatBox.style.border = "1px solid #000";
    this.chatBox.style.overflowY = "scroll";
    this.chatBox.style.padding = "10px";
    this.chatBox.style.boxSizing = "border-box";

    this.chatInput = document.createElement("input");
    this.chatInput.type = "text";
    this.chatInput.placeholder = "Escribe tu respuesta...";
    this.chatInput.style.width = "70%";
    this.chatInput.style.padding = "5px";

    this.sendButton = document.createElement("button");
    this.sendButton.textContent = "Enviar";
    this.sendButton.style.width = "30%";
    this.sendButton.style.padding = "5px";

    this.progressBar = document.createElement("div");
    this.progressBar.className = "progress-bar";
    this.progressBarFill = document.createElement("div");
    this.progressBarFill.className = "progress-bar-fill";
    this.progressBarText = document.createElement("div");
    this.progressBarText.className = "progress-bar-text";

    this.buttonsContainer = document.createElement("div");
    this.buttonsContainer.style.display = "flex";
    this.buttonsContainer.style.marginTop = "10px";
  }

  setPercentBar(percent)
  {
    this.progressBarFill.style.width = `${percent}%`;
    this.progressBarText.textContent = `${Math.round(percent)}%`;
  }

  hidePercentBar() 
  {
    this.progressBar.style.display = "none";
  }

  showPercentBar() 
  {
    this.progressBar.style.display = "block";
  }

  addMessage(message) 
  {
    let messageElement = document.createElement("div");
    messageElement.textContent = message;
    this.chatBox.appendChild(messageElement);
  }

  clearInput() 
  {
    this.chatInput.value = "";
  }

  connectedCallback()
  {
    this.#setEventListener();
    this.#render();
  }

  #render() {
    this.progressBar.appendChild(this.progressBarFill);
    this.progressBarFill.appendChild(this.progressBarText);

    this.buttonsContainer.appendChild(this.chatInput);
    this.buttonsContainer.appendChild(this.sendButton);

    this.container.appendChild(this.chatBox);
    this.container.appendChild(this.buttonsContainer);
    this.container.appendChild(this.progressBar);

    this.appendChild(this.container);
  }

  #setEventListener() {
    this.sendButton.onclick = () => {
      this.dispatchEvent(new CustomEvent(
        "send",
        {
          detail: this.chatInput.value
        })
      );
    }

    this.chatInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();

        this.dispatchEvent(new CustomEvent("send", { detail: this.chatInput.value }));
      }
    });
  }
}

customElements.define("x-chatbotview", ChatBotView);

export { ChatBotView };
