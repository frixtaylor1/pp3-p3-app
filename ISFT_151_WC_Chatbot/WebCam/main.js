import { WebcamModel } from "./WebcamModel.js";
import { WebcamView } from "./WebcamView.js";
import { WebcamController } from "./WebcamController.js";

function main() {
  const model = new WebcamModel();
  const view = new WebcamView();
  const controller = new WebcamController(view, model);

  document.body.appendChild(view);

  controller.inicializar();
}

window.onload = main;
