/**
 * Error esperado de la API con su código HTTP y código legible por el cliente.
 */
export class ApiError extends Error {
  /**
   * @param {number} statusCode Código HTTP que se devolverá.
   * @param {string} code Código estable para identificar el error.
   * @param {string} message Descripción segura para mostrar al cliente.
   */
  constructor(statusCode, code, message) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}
