import { ChatBotController } from "./ChatBotController.js";
import { ChatBotView } from "./ChatBotView.js";

function main() {
  const chatBotView = new ChatBotView();
  const chatBotController = new ChatBotController(chatBotView);

  document.body.appendChild(chatBotView);

  chatBotController.usuariosRegistrados = [
    {
      nombre: "admin",
      contraseña: "12345",
      carrera: "Informática",
      email: "usuario1@example.com",
      apellido: "Pérez",
      dni: "12345678A",
      edad: 30,
      fechaNacimiento: "1993/05/10",
      telefono: "123456789",
    },
  ];
}

window.onload = main;
