import { WebcamModel } from "./WebcamModel.js";
import { WebcamView } from "./WebcamView.js";
import { WebcamController } from "./WebcamController.js";

/*function main() {
  const model = new WebcamModel();
  const view = new WebcamView();
  const controller = new WebcamController(view, model);

  document.body.appendChild(view);

  controller.inicializar();
}*/

class WebCam
{
   constructor()
   {
      this.view = new WebcamView();
      this.model = new WebcamModel();
      this.controller = new WebcamController(this.view,this.model);
   }
}

function startWebcamApplication()
{
   let myWebCam = new WebCam();

   document.body.appendChild(myWebCam.view.contenedorWebCam);
}

window.addEventListener('load', startWebcamApplication );


//window.onload = main;
