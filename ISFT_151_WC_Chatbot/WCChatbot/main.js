import { ChatBotController } from "./ChatBotController.js";
import { ChatBotView } from "./ChatBotView.js";
import { ChatBotModel } from "./ChatBotModel.js";

function main() 
{
  let chatBotView = new ChatBotView();
  let chatBotModel = new ChatBotModel();
  let chatBotController = new ChatBotController(chatBotView,chatBotModel);

  document.body.appendChild(chatBotView);
}

window.onload = main;
