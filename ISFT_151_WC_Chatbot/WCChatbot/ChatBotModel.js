import { ApiCallController } from '../ApiCallController/ApiCallController.js';

class ChatBotModel 
{
  constructor() 
  {
    this.apiController = new ApiCallController('http://127.0.0.1:3336');

    this.processStatus              = false;
    this.registerProcessStatus      = false;
    this.startPreinscriptionStatus  = false;
    this.confirmedData              = {};

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
      next: 'fechaNacimiento',
      validation: (response) => {
  
        return /^[A-Za-z\s]+$/.test(response.trim());
      },
    });
    
    this.questions.set('edad', {
      text: 'Edad: ',
      // next: 'fechaNacimiento',
      // validation: (response) => {
   
      //   let age = parseInt(response);
      //   return !isNaN(age) && age >= 18 && age <= 99;
      // },
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

          this.registerProcessStatus = true;
        },

        'email': () => {
          this.email = response;
          this.startPreinscriptionStatus  = false;
          this.currentQuestionId = 'foto';
        },

        'carrera': () => {
          if (this.carrerasValidas.includes(response.toLowerCase())) 
          {
            this.preinscriptionData.carrera = response;
            this.startPreinscriptionStatus  = true;
            
            this.currentQuestionId          = 'email';
          } 
          else 
          {
            this.currentQuestionId = 'carrera';
          }
        },
        'fechaNacimiento': () => {
          if (this.questions.get('fechaNacimiento').validation) 
          {
            this.preinscriptionData.edad = this.#calculateAge((this.#parseDate(`${response}`)));
            this.preinscriptionData.fechaNacimiento = response;

            this.currentQuestionId          = 'telefono';
          } 
          else 
          {
            this.currentQuestionId = 'fechaNacimiento';
          }
        },

        'verificationUserData': () => {

          if (response.toUpperCase() == 'SI') {
            this.currentQuestionId = 'gratitude';
            this.processStatus = true;
          } else if (response.toUpperCase() == 'NO') {
            this.currentQuestionId = 'modifyFields';
          }
        },

        'completed': () => {
          this.confirmedData = this.preinscriptionData;
          this.questions.set('verificationUserData', {
            text    : `Son correctos estos datos ?
Nombre completo: ${this.confirmedData.nombre} ${this.confirmedData.apellido} 
fecha de nacimiento: (${this.confirmedData.fechaNacimiento}) 
edad: (${this.confirmedData.edad}) 
        
Responde si son correctos: (SI/NO)`,
            nextYes : 'gratitude',
            nextNo  : 'modifyFields',
          });
          this.currentQuestionId = 'verificationUserData';

          if (response.toUpperCase() === 'SI') 
          {
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

  isCompleted() {
    return this.processStatus;  
  }

  isRegistered() {
    return this.registerProcessStatus;
  }

  isPreinscriptionStarted() {
    return this.startPreinscriptionStatus;
  }

  /**
   * @brief Comienza la inscripcion 
   * 
   * @apidoc /startPreinscription
   * @method  HTTP:POST
   * 
   * @returns {Promise<JSON>}
   */
  async startPreinscription() {
    const startPreinscriptionData = {
      'id_user'   : parseInt(localStorage.getItem('id_user')),
      'major_name': this.preinscriptionData.carrera,
    };

    console.log(startPreinscriptionData);

    let response = await this.apiController.callApi('/startPreinscription', 'POST', startPreinscriptionData);
    let result   = response[0];

    return result;
  }

  /**
   * @brief Confirma la Preinscripcion...
   * 
   * @apidoc /confirmPreinscription
   * @method  HTTP:POST
   * 
   * @return  {Promise<JSON>}
   **/
  async confirmPreinscription() {
    let preinscriptionData = {
      id_user           : parseInt(localStorage.getItem('id_user')),
      id_major          : parseInt(localStorage.getItem('id_major')),
      id_preinscription : parseInt(localStorage.getItem('id_preinscription')),
      name              : this.confirmedData.nombre,
      surname           : this.confirmedData.apellido,
      dni               : this.confirmedData.dni,
      birthdate         : (this.confirmedData.fechaNacimiento).replace('/', '-'),
      email             : this.confirmedData.email,
    };

    console.log('PREINSCRIPTION DATA >>>', preinscriptionData);

    let request = await this.apiController.callApi('/confirmPreinscription', 'POST', preinscriptionData);
    let result  = await request.json();

    this.processStatus = false;

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
      let response = await this.apiController.callApi('/cancelPreinscription', 'POST', data);
      let result   = await response.json();

      return result;
    }

  /**
   * @brief Registra un usuario
   * 
   * @apidoc /signUp
   * @method  HTTP:POST 
   * 
   * @return  {Promise<JSON>}
   **/
  async signUp() {
    this.registerProcessStatus = false;

    let response = await this.apiController.callApi('/signUp', 'POST', this.registerData);
    let result   = response[0][0];

    return result;
  }
    /**
   * @brief Calcula la edad de un usuario
   * 
   * @param {string} fecha de nacimientoo
   * 
   * @return  {string} edad
   **/
  #calculateAge(birthdate) 
  {
    let currentDate = new Date();

    // Calcular la diferencia en milisegundos entre la fecha actual y la fecha de nacimiento
    let difference = currentDate - birthdate;

    // Convertir la diferencia de milisegundos a años
    let age = Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25));

    return age;
  }
    /**
   * @brief Parsea formato de fecha a Year/month/day
   * 
   * @param {string} fecha
   * 
   * @return  {object} Date
   **/
    #parseDate(dateString) 
    {
      const parts = dateString.split('/');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;  // Restamos 1 porque en JavaScript los meses van de 0 a 11
      const year = parseInt(parts[2], 10);
    
      return new Date(year, month, day);
    }
    

}

export { ChatBotModel };

