import { WebcamModel } from "./WebCam/WebcamModel.js";
import { WebcamView } from "./WebCam/WebcamView.js";
import { WebcamController } from "./WebCam/WebcamController.js";

class ChatBotController {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.view.onSendMessage = this.procesarMensaje.bind(this);
    this.usuariosRegistrados = [];
    this.usuarioActual = null;
    this.preguntaRegistro();
  }

  preguntaRegistro() {
    this.view.agregarMensaje(
      "Bienvenido a la preinscripción de ISFT15. ¿Estás registrado? (SI/NO)",
      true
    );
    this.view.onSendMessage = (respuestaUsuario) => {
      respuestaUsuario = respuestaUsuario.trim().toLowerCase();
      if (respuestaUsuario === "si") {
        this.iniciarSesion();
      } else if (respuestaUsuario === "no") {
        this.registrarse();
      } else {
        this.view.agregarMensaje(
          "Respuesta inválida. ¿Estás registrado? (SI/NO)",
          true
        );
      }
    };
  }

  procesarMensaje(respuestaUsuario) {
    respuestaUsuario = respuestaUsuario.trim().toLowerCase();

    if (!this.usuarioActual) {
      this.view.agregarMensaje(
        "Por favor, inicia sesión o regístrate primero.",
        true
      );
    } else {
      if (!this.usuarioActual.carrera) {
        this.preguntarCarrera();
      } else if (!this.usuarioActual.email) {
        this.preguntarEmail();
      } else if (!this.usuarioActual.cameraInitialized) {
        this.inicializarCamara();
      } else if (!this.usuarioActual.apellido) {
        this.preguntarApellido();
      } else if (!this.usuarioActual.nombre) {
        this.preguntarNombre();
      } else if (!this.usuarioActual.dni) {
        this.preguntarDNI();
      } else if (!this.usuarioActual.edad) {
        this.preguntarEdad();
      } else if (!this.usuarioActual.fechaNacimiento) {
        this.preguntarFechaNacimiento();
      } else if (!this.usuarioActual.telefono) {
        this.preguntarTelefono();
      } else {
        this.agradecerYReiniciarChat();
      }
    }
  }

  iniciarSesion() {
    this.view.agregarMensaje(
      "Ingresa tu nombre de usuario para iniciar sesión:",
      true
    );

    this.view.onSendMessage = (nombreUsuario) => {
      const usuarioExistente = this.usuariosRegistrados.find(
        (user) => user.nombre === nombreUsuario
      );

      if (usuarioExistente) {
        this.view.agregarMensaje("Ingresa tu contraseña:", true);
        this.view.onSendMessage = (contraseña) => {
          if (usuarioExistente.contraseña === contraseña) {
            this.usuarioActual = usuarioExistente;
            this.view.agregarMensaje(`Bienvenido, ${nombreUsuario}!`, true);
            this.procesarMensaje("");
          } else {
            this.view.agregarMensaje(
              "Información incorrecta. Por favor, verifica tu contraseña.",
              true
            );
          }
        };
      } else {
        this.view.agregarMensaje(
          "Usuario no encontrado. Por favor, verifica tu nombre de usuario.",
          true
        );
      }
    };
  }

  registrarse() {
    this.view.agregarMensaje(
      "Ingresa un nombre de usuario para registrarte:",
      true
    );
    this.view.onSendMessage = (nombreUsuario) => {
      const usuarioExistente = this.usuariosRegistrados.find(
        (user) => user.nombre === nombreUsuario
      );
      if (usuarioExistente) {
        this.view.agregarMensaje(
          "El nombre de usuario ya está en uso. Por favor, elige otro nombre.",
          true
        );
        this.registrarse();
      } else {
        this.view.agregarMensaje("Ingresa una contraseña:", true);
        this.view.onSendMessage = (contraseña) => {
          const nuevoUsuario = {
            nombre: nombreUsuario,
            contraseña: contraseña,
            carrera: null,
            email: null,
            cameraInitialized: false,
            apellido: null,
            dni: null,
            edad: null,
            fechaNacimiento: null,
            telefono: null,
          };
          this.usuariosRegistrados.push(nuevoUsuario);
          this.usuarioActual = {
            nombre: nombreUsuario,
            carrera: null,
            email: null,
            cameraInitialized: false,
            apellido: null,
            dni: null,
            edad: null,
            fechaNacimiento: null,
            telefono: null,
          };
          this.view.agregarMensaje(
            `Te has registrado exitosamente como ${nombreUsuario}!`,
            true
          );
          this.procesarMensaje("");
        };
      }
    };
  }
  preguntarCarrera() {
    this.view.agregarMensaje(
      "¿A qué carrera deseas preinscribirte? (textil, logística, sistemas, turismo, gestión ambiental)",
      true
    );
    this.view.onSendMessage = (respuestaUsuario) => {
      const carrerasValidas = [
        "textil",
        "logística",
        "sistemas",
        "turismo",
        "gestión ambiental",
      ];
      respuestaUsuario = respuestaUsuario.trim().toLowerCase();
      if (carrerasValidas.includes(respuestaUsuario)) {
        this.usuarioActual.carrera = respuestaUsuario;
        this.view.agregarMensaje(
          `Te has preinscrito en la carrera de ${respuestaUsuario}.`,
          true
        );
        this.preguntarEmail();
      } else {
        this.view.agregarMensaje(
          "Carrera inválida. Por favor, elige una carrera válida.",
          true
        );
        this.preguntarCarrera();
      }
    };
  }

  preguntarEmail() {
    this.view.agregarMensaje(
      "Ingresa tu dirección de correo electrónico:",
      true
    );
    this.view.onSendMessage = (respuestaUsuario) => {
      const emailValido = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      respuestaUsuario = respuestaUsuario.trim();
      if (emailValido.test(respuestaUsuario)) {
        this.usuarioActual.email = respuestaUsuario;
        this.view.agregarMensaje(
          `Tu dirección de correo electrónico (${respuestaUsuario}) ha sido guardada.`,
          true
        );
        this.inicializarCamara();
      } else {
        this.view.agregarMensaje(
          "Dirección de correo electrónico inválida. Por favor, ingresa una dirección de correo válida.",
          true
        );
        this.preguntarEmail();
      }
    };
  }

  preguntarApellido() {
    this.view.agregarMensaje("Ingresa tu apellido:", true);
    this.view.onSendMessage = (respuestaUsuario) => {
      // Elimina los espacios en blanco al principio y al final del valor ingresado
      respuestaUsuario = respuestaUsuario.trim();

      // Expresión regular para validar que solo contiene letras (mayúsculas o minúsculas) y espacios
      const letrasRegex = /^[a-zA-Z\s]+$/;

      if (letrasRegex.test(respuestaUsuario)) {
        this.usuarioActual.apellido = respuestaUsuario;
        this.view.agregarMensaje("Apellido guardado.", true);
        this.preguntarNombre();
      } else {
        this.view.agregarMensaje(
          "El apellido ingresado no es válido. Debe contener solo letras y espacios.",
          true
        );
        // Puedes pedir nuevamente el apellido o tomar alguna otra acción de manejo de errores aquí.
      }
    };
  }

  preguntarNombre() {
    this.view.agregarMensaje("Ingresa tu nombre:", true);
    this.view.onSendMessage = (respuestaUsuario) => {
      // Elimina los espacios en blanco al principio y al final del valor ingresado
      respuestaUsuario = respuestaUsuario.trim();

      // Expresión regular para validar que solo contiene letras (mayúsculas o minúsculas) y espacios
      const letrasRegex = /^[a-zA-Z\s]+$/;

      if (letrasRegex.test(respuestaUsuario)) {
        this.usuarioActual.nombre = respuestaUsuario;
        this.view.agregarMensaje("Nombre guardado.", true);
        this.preguntarDNI();
      } else {
        this.view.agregarMensaje(
          "El nombre ingresado no es válido. Debe contener solo letras y espacios.",
          true
        );
        // Puedes pedir nuevamente el nombre o tomar alguna otra acción de manejo de errores aquí.
      }
    };
  }

  preguntarDNI() {
    this.view.agregarMensaje("Ingresa tu DNI:", true);
    this.view.onSendMessage = (respuestaUsuario) => {
      // Elimina los espacios en blanco al principio y al final del valor ingresado
      respuestaUsuario = respuestaUsuario.trim();

      // Expresión regular para validar un DNI argentino (8 dígitos numéricos)
      const dniRegex = /^\d{8}$/;

      if (dniRegex.test(respuestaUsuario)) {
        this.usuarioActual.dni = respuestaUsuario;
        this.view.agregarMensaje("DNI guardado.", true);
        this.preguntarEdad();
      } else {
        this.view.agregarMensaje(
          "El DNI ingresado no es válido. Debe contener 8 dígitos numéricos.",
          true
        );

        // Puedes pedir nuevamente el DNI o tomar alguna otra acción de manejo de errores aquí.
      }
    };
  }

  // inicializarCamara() {
  //   // Crea instancias del modelo, vista y controlador de la cámara

  //   const model = new WebcamModel();
  //   const view = new WebcamView();
  //   const controller = new WebcamController(view, model);

  //   controller.inicializar();

  //   // Agrega la vista de la cámara al contenedor del chatbot
  //   this.view.chatbotContainer.appendChild(view);
  //   this.usuarioActual.cameraInitialized = true;

  //   this.view.agregarMensaje("La cámara se ha inicializado.", true);
  //   this.preguntarApellido();
  // }

  inicializarCamara() {
    // Añadir un mensaje del chatbot
    this.view.agregarMensaje(
      "Chatbot: Escribe 'continuar' para tomarte una foto.",
      true
    );

    this.view.onSendMessage = (mensaje) => {
      // Verificar si el mensaje es 'continuar' antes de inicializar la cámara
      if (mensaje.toLowerCase() === "continuar") {
        // Código para inicializar la cámara
        const model = new WebcamModel();
        const view = new WebcamView();
        const controller = new WebcamController(view, model);

        controller.inicializar();

        this.view.chatbotContainer.appendChild(view);

        this.view.agregarMensaje("Chatbot: Cámara inicializada!", true);

        // Continuar con el flujo
        this.preguntarApellido();
      } else {
        // Si el mensaje no es 'continuar', puedes dar retroalimentación al usuario
        this.view.agregarMensaje(
          "Chatbot: Por favor, escribe 'continuar' para tomarte una foto.",
          true
        );
      }
    };
  }

  agradecerYReiniciarChat() {
    // Detener y eliminar la cámara
    this.view.chatbotContainer.removeChild(this.view); // Elimina la vista de la cámara
    this.view = null; // Marca la vista como nula para liberar recursos

    this.view.agregarMensaje(
      "Gracias por completar los datos de la preinscripción. Hemos guardado toda tu información.",
      true
    );

    this.usuarioActual = null;
    this.preguntaRegistro();
  }

  preguntarEdad() {
    this.view.agregarMensaje("Ingresa tu edad:", true);
    this.view.onSendMessage = (respuestaUsuario) => {
      this.usuarioActual.edad = respuestaUsuario.trim();
      this.view.agregarMensaje("Edad guardada.", true);
      this.preguntarFechaNacimiento();
    };
  }

  preguntarEdad() {
    this.view.agregarMensaje("Ingresa tu edad:", true);
    this.view.onSendMessage = (respuestaUsuario) => {
      const edad = respuestaUsuario.trim();

      if (!isNaN(edad) && parseInt(edad) >= 0 && parseInt(edad) <= 100) {
        this.usuarioActual.edad = edad;
        this.view.agregarMensaje("Edad guardada.", true);
        this.preguntarFechaNacimiento();
      } else {
        this.view.agregarMensaje(
          "Edad no válida. Por favor, ingresa una edad numérica válida.",
          true
        );
        // Puedes manejar la validación incorrecta de la edad de alguna otra manera.
      }
    };
  }

  preguntarFechaNacimiento() {
    this.view.agregarMensaje(
      "Ingresa tu fecha de nacimiento (Formato: dd/mm/aaaa):",
      true
    );
    this.view.onSendMessage = (respuestaUsuario) => {
      const fechaNacimiento = respuestaUsuario.trim();

      if (this.isValidDate(fechaNacimiento)) {
        this.usuarioActual.fechaNacimiento = fechaNacimiento;
        this.view.agregarMensaje("Fecha de nacimiento guardada.", true);
        this.preguntarTelefono();
      } else {
        this.view.agregarMensaje(
          "Fecha de nacimiento no válida. Por favor, ingresa una fecha válida en formato dd/mm/aaaa.",
          true
        );
      }
    };
  }

  isValidDate(dateString) {
    const pattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!pattern.test(dateString)) {
      return false;
    }
    const parts = dateString.split("/");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    const date = new Date(year, month - 1, day); // Restamos 1 al mes ya que los meses en JavaScript son 0-11.
    return (
      date.getDate() === day &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === year
    );
  }

  preguntarTelefono() {
    this.view.agregarMensaje("Ingresa tu número de teléfono:", true);
    this.view.onSendMessage = (respuestaUsuario) => {
      this.usuarioActual.telefono = respuestaUsuario.trim();
      this.view.agregarMensaje("Número de teléfono guardado.", true);
      this.agradecerYReiniciarChat();
    };
  }

  agradecerYReiniciarChat() {
    this.view.agregarMensaje(
      "Gracias por completar los datos de la preinscripción. Hemos guardado toda tu información.",
      true
    );
    this.usuarioActual = null;
    this.preguntaRegistro();
  }

  // ... (resto de los métodos de ChatBotController)
}

export { ChatBotController };
