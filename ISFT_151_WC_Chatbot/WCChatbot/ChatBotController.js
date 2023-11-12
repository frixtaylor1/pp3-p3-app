class ChatBotController 
{
  constructor(ChatBotView, chatBotModel) {
    this.view = ChatBotView;
    this.model = chatBotModel;

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
}

export { ChatBotController };
