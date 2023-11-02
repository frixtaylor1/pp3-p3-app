import { ApiController } from "./ApiCallController/ApiCallController.js";

class ChatBotModel {
  constructor() {
    this.apiController = new ApiController('localhost:3000');
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