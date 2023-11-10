import { ApiCallController } from '../ApiCallController/ApiCallController.js';

class ChatBotModel {
  constructor() 
  {
    this.apiController = new ApiCallController('localhost:3000');

    this.confirmedData = {};

    this.registerData = 
    {
      username: null,
      password: null,
    };

    this.loginData = 
    {
      username: 'admin', 
      password: '12345', 
    };

    this.preinscriptionData = 
    {
      nombre          : null,
      carrera         : null,
      email           : null,
      foto            : null,
      apellido        : null,
      dni             : null,
      edad            : null,
      fechaNacimiento : null,
      telefono        : null,
    };

    this.carrerasValidas = 
    [
      "textil",
      "logística",
      "sistemas",
      "turismo",
      "gestión ambiental",
    ];


    this.questions = new Map();

    this.questions.set('welcome', {
      text: 'Bienvenido a la preinscripción de ISFT15. ¿Estás registrado? (SI/NO)',
      nextYes: 'login',
      nextNo: 'createAccount',
    });
    
    this.questions.set('login', {
      text: 'Ingresa tu nombre de usuario:',
      next: 'loginPassword',
    });
    
    this.questions.set('loginPassword', {
      text: 'Ingresa tu contraseña:',
      next: 'completed',
    });
    
    this.questions.set('createAccount', {
      text: 'Crear una nueva cuenta. Ingresa un nombre de usuario:',
      next: 'createAccountPassword',
    });
    
    this.questions.set('createAccountPassword', {
      text: 'Ingresa una contraseña:',
      next: 'nombre',
    });
    
    this.questions.set('nombre', {
      text: 'Nombre: ',
      next: 'apellido',
      validation: (response) => {
        // Validación estricta: el nombre debe ser una cadena de caracteres válida
        return /^[A-Za-z\s]+$/.test(response.trim());
      },
    });
    
    this.questions.set('apellido', {
      text: 'Apellido: ',
      next: 'edad',
      validation: (response) => {
  
        return /^[A-Za-z\s]+$/.test(response.trim());
      },
    });
    
    this.questions.set('edad', {
      text: 'Edad: ',
      next: 'fechaNacimiento',
      validation: (response) => {
   
        let age = parseInt(response);
        return !isNaN(age) && age >= 18 && age <= 99;
      },
    });
    
    this.questions.set('fechaNacimiento', {
      text: 'Fecha de nacimiento (dd/mm/aaaa): ',
      next: 'telefono',
      validation: (response) => {
       //La fecha de nacimiento debe tener un formato valido (por ejemplo, 'dd/mm/aaaa')
        return /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(response.trim());
      },
    });
    
    this.questions.set('telefono', {
      text: 'Telefono: ',
      next: 'carrera',
      validation: (response) => {
        let phoneRegex = /^\d{7,10}$/; // Acepta de 7 a 10 dígitos
        return phoneRegex.test(response.trim());
      },
    });
    
    this.questions.set('carrera', {
      text: 'Carrera (textil, logistica, sistemas, turismo,gestión ambiental): ',
      next: 'email',
      options: this.carrerasValidas, // Agrega las carreras disponibles como opciones
      validation: (response) => {
        return this.carrerasValidas.includes(response);
      }
    });
    
    this.questions.set('email', {
      text: 'Dirección de correo electrónico (Unicamente gmail: example.@gmail.com): ',
      next: 'foto',
      validation: (response) => {
        // Validación estricta: verifica que sea una direccion de correo electronico valida de Gmail
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail.com$/;
        return emailRegex.test(response.trim().toLowerCase());
      },
    });
    
    this.questions.set('foto', {
      text: '¿Puedes subir una foto tuya?',
      next: 'dni',
    });
    
    this.questions.set('dni', {
      text: 'DNI: ',
      next: 'completed',
      validation: (response) => {
        return /^[0-9]{7,8}$/.test(response.trim());
      },
    });

    this.questions.set('gratitude', {
      text: '¡Gracias por completar la preinscripción! ¿Deseas continuar con la Inscripcion?',
      next: 'welcome',
    });

    this.questions.set('modifyFields', {
      text: 'Escribe el nombre del campo que deseas modificar:',
      next: 'modifyFieldValue',
    });
    
    this.questions.set('modifyFieldValue', {
      text: 'Ingresa el nuevo valor para el campo:',
      next: 'completed',
    });

    this.questions.set('completed', {
      text: 'Se ha completado los datos de inscripción. Quieres verificar tu datos? (SI/NO)',
      nextYes: 'verificationUserData',
      nextNo: 'modidyFieldValue'
    });

    //Inicio de chat en WELCOME
    this.currentQuestionId = 'welcome';

    this.loggedInUser = null;
  }

  // Validación de nombre de usuario Creado
  isValidUsername(username) 
  {
    return this.loginData.username === username;
  }

  // Validación de contraseña usuario Creadoo
  isValidPassword(password) 
  {
    return this.loginData.password === password;
  }

  getCarrerasValidas() 
  {
    return this.carrerasValidas;
  }

  setNextQuestion() 
  {
    let currentQuestion = this.questions.get(this.currentQuestionId);
    let nextQuestionId = currentQuestion.next;
  
    if (nextQuestionId) 
    {
      this.currentQuestionId = nextQuestionId;
      return this.questions.get(nextQuestionId);
    } 

    return null;
  }
  
  getPreinscriptionPercent() 
  {

    let totalFields = Object.keys(this.preinscriptionData).length;

    // Filtra y cuenta los campos no nulos o completados
    let completedFields = Object.values(this.preinscriptionData).filter(
      (field) => field !== null
    ).length;

    // Calcula el porcentaje de campos completados
    let percentCompleted = (completedFields / totalFields) * 100;

    return percentCompleted;
  }

  getCurrentQuestion() 
  {
    return this.questions.get(this.currentQuestionId);
  }


  sendResponseToQuestion(response) 
  {
    const currentQuestion = this.questions.get(this.currentQuestionId);
  
    //Manejador de algunas preguntas para mantener la logica del chatbot
    if (currentQuestion) 
    {
      const responseHandlers = {
        'welcome': () => {
          if (response.toUpperCase() === 'SI') 
          {
            this.currentQuestionId = currentQuestion.nextYes;
          } 
          else if (response.toUpperCase() === 'NO') 
          {
            this.currentQuestionId = currentQuestion.nextNo;
          } 
          else 
          {
            // Por ahi tirar un console log de respuesta incorrecta
            this.currentQuestionId = 'welcome'; 
          }
        },

        'login': () => {
          if (this.isValidUsername(response)) 
          {
            this.loggedInUser = response;
            this.currentQuestionId = 'loginPassword';
          } 
          else 
          {
            // Usuario no encontrado
            this.currentQuestionId = 'login'; // Volver a preguntar por el nombre de usuario
          }
        },

        'loginPassword': () => {

          if (this.isValidPassword(response)) 
          {
            this.loggedIn = true;
            this.currentQuestionId = 'completed';
          } 

          else 
          {
            // Contraseña no valida
            this.currentQuestionId = 'loginPassword'; // Volver a pedir la contraseña
          }
        },

        'createAccount': () => {
          this.registerData.username = response;
          this.currentQuestionId = 'createAccountPassword';
        },

        'createAccountPassword': () => {
          this.registerData.password = response;
          this.currentQuestionId = 'nombre';
        },

        'carrera': () => {
          if (this.carrerasValidas.includes(response.toLowerCase())) 
          {
            this.preinscriptionData.carrera = response;
            this.currentQuestionId = 'email';
          } 

          else 
          {
            this.currentQuestionId = 'carrera';
          }
        },

        'verificationUserData': () => {

          if (response.toUpperCase() == 'SI') {
            this.currentQuestionId = 'gratitude';
          } else if (response.toUpperCase() == 'NO') {
            this.currentQuestionId = 'modifyFields';
          }
        },

        'completed': () => {
          this.confirmedData = this.preinscriptionData;
          this.questions.set('verificationUserData', {
            text    : `Son correctos estos datos ?
            ${JSON.stringify(this.confirmedData)} (SI/NO)`,
            nextYes : 'gratitude',
            nextNo  : 'modifyFields',
          });
          this.currentQuestionId = 'verificationUserData';

          console.log('ENTRO!');
          if (response.toUpperCase() === 'SI') 
          {


            // Aca se llamara a la funcion confirmPreinscription() si es necesario
          } 
          
          else if (response.toUpperCase() === 'NO') 
          {
            this.currentQuestionId = 'modifyFields';
          } 
          
          else 
          {
            // Manejar caso de respuesta no válida
            this.currentQuestionId = 'completed';
          }
        },

        'modifyFields': () => {

          if (this.preinscriptionData.hasOwnProperty(response)) 
          {
            this.fieldToModify      = response;
            this.currentQuestionId  = 'modifyFieldValue';
          }
          
          else 
          {
            this.currentQuestionId = 'modifyFields';
          }
        },

        'modifyFieldValue': () => {
          //nombre del campo a modificar
          let fieldName = this.fieldToModify;
        
          // Verifica si el campo a modificar es válido usando la validación definida en el mapa
          let currentQuestion = this.questions.get(fieldName);
        
          if (currentQuestion && currentQuestion.validation(response)) 
          {
            this.preinscriptionData[fieldName] = response;
            console.log(this.preinscriptionData); 
            this.currentQuestionId = 'completed'; 
          } 

          else 
          {
            this.currentQuestionId = 'modifyFieldValue'; 
          }
        }
      };
  
      let handler = responseHandlers[this.currentQuestionId];
  
      if (handler) {
        handler();
      } 
      
      else 
      {
        //Seria el manejador de  PreinscriptionData
        if (currentQuestion.validation && !currentQuestion.validation(response)) 
        {
          // La respuesta no cumple con la validación, Se pregunta again
          this.currentQuestionId = this.currentQuestionId;
        } 

        else 
        {
          this.preinscriptionData[this.currentQuestionId] = response;
          console.log(this.preinscriptionData);  
          this.currentQuestionId = currentQuestion.next;
        }
      }
    } 
    
    else 
    {
      // Manejar caso de pregunta no encontrada
    }
  }

  /**
   * @brief Comienza la inscripcion 
   * 
   * @apidoc /startPreinscription
   * @method  HTTP:POST
   * 
   * @param {JSON} data { id_user, id_major }
   * 
   * @returns {Promise<JSON>}
   */
  async startPreinscription(data) {
    let request = await this.apiController.callApi('/startPreinscription', 'POST', data);
    let result  = await request.json();

    return result;
  }

  /**
   * @brief Confirma la Preinscripcion...
   * 
   * @apidoc /confirmPreinscription
   * @method  HTTP:POST
   * 
   * @param {JSON} data // id_user, id_preinscription, name, surname, dni, birthdate, email
   * 
   * @return  {Promise<JSON>}
   **/
  async confirmPreinscription(data) {
    let request = await this.apiController.callApi('/confirmPreinscription', 'POST', data);
    let result  = await request.json();

    return result;
  }

  /**
   * @brief Cancela una Preinscripcion...
   * 
   * @apidoc /cancelPreinscription
   * @method  HTTP:POST 
   * 
   * @param {JSON} data // id_preinscription
   * 
   * @return  {Promise<JSON>}
   **/
    async cancelPreinscription(data) {
      let request = await this.apiController.callApi('/cancelPreinscription', 'POST', data);
      let result  = await request.json();

      return result;
    }
}

export { ChatBotModel };

