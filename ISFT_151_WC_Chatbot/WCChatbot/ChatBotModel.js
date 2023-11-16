/**
 * @file ChatBotModel.js
 * @description Model for the Web Component of ChatBot
 * @license GPL-3.0
 *
 * WCChatBot - Web Component for Chat Bot
 * Copyright (c) 2023 Omar Lopez, 
 *                    Evelyn Oliva, 
 *                    Karen Manchado, 
 *                    Facundo Caminos, 
 *                    Ignacio Moreno,
 *                    Kevin Taylor,
 *                    Matias Cardenas
 *                    Daniel Beinat
 *                    ISFT N° 151
 *
 *  Project Supervisor: Prof. Matias Santiago Gastón
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 * Year: 2023
 */

import { ApiCallController } from '../ApiCallController/ApiCallController.js';

class ChatBotModel 
{
  constructor() 
  {
    this.apiController = new ApiCallController('http://127.0.0.1:3300');

    this.processStatus              = false;
    this.registerProcessStatus      = false;
    this.startPreinscriptionStatus  = false;
    this.confirmedData              = {};
    this.webCamData                 = null;
    this.webCamStatus               = false;

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
      text: 'Ingresa una contraseña' + 
      '\n8 caracteres minimo' + 
      '\nPor lo menos una mayuscula'+ 
      '\n2 numeros y un caracter especial(! @ # $ % ^ & * ( ) _ +):',      
      next: 'completed',
      validation: (response) => {
        // Validación de contraseña: al menos una mayúscula, dos números, un carácter especial y 8 caracteres mínimo
        return /^(?=.*[A-Z])(?=(?:.*\d){2})(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/.test(response.trim());
      },
    });
    
    this.questions.set('createAccount', {
      text: 'Crear una nueva cuenta. Ingresa un nombre de usuario:',
      next: 'createAccountPassword',
    });
    
    this.questions.set('createAccountPassword', {
      text: 'Ingresa una contraseña' + 
      '\n8 caracteres minimo' + 
      '\nPor lo menos una mayuscula'+ 
      '\n2 numeros y un caracter especial(! @ # $ % ^ & * ( ) _ +):',
      next: 'nombre',
      validation: (response) => {
        // Validación de contraseña: al menos una mayúscula, dos números, un carácter especial y 8 caracteres mínimo
        return /^(?=.*[A-Z])(?=(?:.*\d){2})(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/.test(response.trim());
      },
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
      next: 'fechaNacimiento',
      validation: (response) => {

        let age = parseInt(response);
        if(age != this.preinscriptionData.edad)
        {

        }
        else
        {
          return true
        }
        // return !isNaN(age) && age >= 18 && age <= 99;
      },
    });
    
    this.questions.set('fechaNacimiento', {
      text: 'Fecha de nacimiento (dd/mm/aaaa): ',
      next: 'telefono',
      validation: (response) => {
        
        this.preinscriptionData.edad = this.#calculateAge((this.#parseDate(`${response}`)));
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
      text: '¿Puedes subir una foto tuya? Para activar camara (SI/NO)',
      nextYes: 'webCam',
      nextNo: 'dni',
    });

    this.questions.set('webCam', {
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
      next: 'warning',
    });
    this.questions.set('warning', {
      text: 'Warning: ',
      next: 'completed',
    });

    this.questions.set('completed', {
      text: 'Se ha completado los datos de inscripción. Quieres verificar tu datos? (SI/NO)',
      nextYes: 'verificationUserData',
      nextNo: 'gratitude'
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
            this.currentQuestionId = 'login';
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
            this.currentQuestionId = 'loginPassword';
          }
        },

        'createAccount': () => {
          this.registerData.username = response;
          this.currentQuestionId = 'createAccountPassword';
        },

        'createAccountPassword': () => {
          if (this.questions.get('createAccountPassword').validation(response)) 
          {
            this.registerData.password = response;
            this.registerProcessStatus = true;
            
            this.currentQuestionId = 'nombre';
          } 
          else 
          {
            this.currentQuestionId = 'createAccountPassword';
          }
        },

        'email': () => {

          if (this.questions.get('email').validation(response)) 
          {
            this.preinscriptionData.email = response;
            this.startPreinscriptionStatus  = false;
            
            this.currentQuestionId = 'foto';
          } 
          else 
          {
            this.currentQuestionId = 'email';
          }
        },

        'foto': () => {
          if (response.toUpperCase() == 'SI') 
          {
            this.webCamStatus = true;
            this.currentQuestionId = 'dni';
          } 
          else if (response.toUpperCase() == 'NO') 
          {
            this.currentQuestionId = 'dni';
          }
        },

        'dni': () => {
          if (this.questions.get('dni').validation) 
          {
            this.webCamStatus = false;
            this.preinscriptionData.dni = response;
            this.currentQuestionId = 'completed';
          } 
          else 
          {
            this.currentQuestionId = 'dni';
          }
        },

        'carrera': () => {
          if (this.questions.get('carrera').validation(response)) 
          {
            this.preinscriptionData.carrera = response;
            this.startPreinscriptionStatus  = true;
            
            this.currentQuestionId = 'email';
          } 
          else 
          {
            this.currentQuestionId = 'carrera';
          }
        },

        'fechaNacimiento': () => {
          if (this.questions.get('fechaNacimiento').validation(response)) 
          {
            this.preinscriptionData.fechaNacimiento = response;

            this.currentQuestionId = 'telefono';
          } 
          else 
          {
            this.currentQuestionId = 'fechaNacimiento';
          }
        },

        'verificationUserData': () => {
          if (response.toUpperCase() == 'SI') 
          {
            this.currentQuestionId = 'gratitude';
            this.processStatus = true;
          } 
          else if (response.toUpperCase() == 'NO') 
          {
            this.currentQuestionId = 'modifyFields';
          }
        },

        'completed': () => {
          this.confirmedData = this.preinscriptionData;
          this.questions.set('verificationUserData', {
            text    : 
      `Son correctos estos datos ?
  nombre: ${this.confirmedData.nombre} 
  apellido: ${this.confirmedData.apellido} 
  fecha de nacimiento: ${this.confirmedData.fechaNacimiento} 
  edad: ${this.confirmedData.edad}
  carrera: ${this.confirmedData.carrera}
  email: ${this.confirmedData.email}
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
            this.currentQuestionId = 'gratitude';
          } 
          
          else 
          {
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
          let fieldName       = this.fieldToModify;
          let currentQuestion = this.questions.get(fieldName);
        
          if (currentQuestion && currentQuestion.validation(response)) 
          {
            this.preinscriptionData[fieldName] = response;
            console.log(this.preinscriptionData); 
            this.currentQuestionId = 'completed'; 
          } 
          else 
          {
            if(this.fieldToModify == 'edad' )
            {
              this.questions.get('warning').text = `tu edad segun tu fecha de nacimiento es ${this.preinscriptionData.edad}.
              Si es incorrecta, modifica tu fecha de nacimiento ${this.preinscriptionData.fechaNacimiento}. 
              ¿Modificar campo? (SI/NO)`
              this.fieldToModify = 'fechaNacimiento';
            }
            else
            {
              this.questions.get('warning').text = `Valor ${response} incorrecto en campo ${fieldName}. ¿Modificar campo? (SI/NO)`
            }

            this.currentQuestionId = 'warning'; 
          }
        },

        'warning': () => {
          if (response.toUpperCase() === 'SI') 
          {
            this.currentQuestionId = 'modifyFieldValue';
          } 
          
          else if (response.toUpperCase() === 'NO') 
          {
            this.currentQuestionId = 'verificationUserData';
          } 
          
        }    
      };
  
      let handler = responseHandlers[this.currentQuestionId];
  
      if (handler) 
      {
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

  shouldTakePhoto() {
    return this.webCamStatus;
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
      birthdate         : (this.confirmedData.fechaNacimiento).replaceAll('/', '-'),
      email             : this.confirmedData.email,
    };

    let request = await this.apiController.callApi('/confirmPreinscription', 'POST', preinscriptionData);
    let result  = await request[0];

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
   * @brief Envia una foto
   * 
   * @apidoc /sendPhoto
   * @method  HTTP:POST 
   * 
   * @return  {Promise<JSON>}
   **/
  async sendPhoto() {
    if (this.webCamData !== undefined && this.webCamData !== null && this.webCamData !== '') {
      let dataToSend = {
        id_user: parseInt(localStorage.getItem('id_user')),
        imageData: this.webCamData,
      };

      console.log(dataToSend);

      let response  = await this.apiController.callApi('/sendPhoto', 'POST', dataToSend);
      let result    = response[0];

      console.log(result); 
    }
  }

    /**
   * @brief Calcula la edad de un usuario
   * 
   * @param {string} - fecha de nacimientoo
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
      const day   = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;  // Restamos 1 porque en JavaScript los meses van de 0 a 11
      const year  = parseInt(parts[2], 10);
    
      return new Date(year, month, day);
    }
}

export { ChatBotModel };

