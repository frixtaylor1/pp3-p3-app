class ChatBotController 
{
  constructor(ChatBotView, chatBotModel) 
  {
    this.view = ChatBotView;
    this.model = chatBotModel;

    this.view.addEventListener("send", (e) => this.onSend(e));

    this.startChat();
  }

  startChat() 
  {
    // Inicia el chat mostrando la primera pregunta
    this.view.addMessage(this.model.getCurrentQuestion().text);
    this.view.hidePercentBar();

  }

  updateProgress() 
  {
    let progress = this.model.getPreinscriptionPercent();

    if (progress >= 0) 
    {
      this.view.setPercentBar(progress);
      this.view.showPercentBar();
    } 
    
    else 
    {
      this.view.hidePercentBar();
    }
  }

  onSend(event) 
  {
    let data = event.detail;

    this.view.addMessage(data);

    // Envía la respuesta al modelo
    this.model.sendResponseToQuestion(data);

    // Limpia la vista
    this.view.clearInput();

    // Obtiene la siguiente pregunta
    const nextQuestion = this.model.getCurrentQuestion();

    if (nextQuestion) 
    {
      // Si hay otra pregunta, la muestra en la vista
      this.view.addMessage(nextQuestion.text);
    } 

    this.updateProgress(); // Actualiza la barra de progreso en la vista
  }
}

export { ChatBotController };
