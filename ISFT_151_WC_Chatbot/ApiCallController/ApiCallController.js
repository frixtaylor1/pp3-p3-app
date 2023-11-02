class ApiController {
  constructor(url) {
    this.url = url;
  }

  async callApi(endpoint, method, data = null) {
    const fullUrl = this.url + endpoint;

    try {
      
      let request = {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: method !== 'GET' ? JSON.stringify(data) : undefined
      };

      const response     = await fetch(fullUrl, request);
      let responseData   = await response.json();

      return responseData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export { ApiController };
