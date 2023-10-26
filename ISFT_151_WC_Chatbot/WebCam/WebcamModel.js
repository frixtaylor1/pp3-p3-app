class WebcamModel {
  constructor() {
    this.stream = null;
    this.restricciones = {
      audio: true,
      video: {
        width: 320,
        height: 240,
      },
    };
  }

  async inicializar() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia(
        this.restricciones
      );
      return this.stream;
    } catch (e) {
      throw new Error(`Error de navigator.getUserMedia: ${e.toString()}`);
    }
  }
}

export { WebcamModel };
