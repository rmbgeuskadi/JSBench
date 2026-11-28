import { listAlgorithms, runBenchmark } from '../services/benchmark-service.js';

/**
 * Responde con los algoritmos que el servicio tiene registrados.
 *
 * @param request Solicitud HTTP de Express.
 * @param response Respuesta HTTP de Express.
 */
export function getAlgorithms(request, response) {
  response.json({ algorithms: listAlgorithms() });
}

/**
 * Ejecuta el benchmark solicitado y devuelve el resultado como JSON.
 *
 * Los errores de validación se propagan a Express, que los procesa mediante
 * el middleware global de errores.
 *
 * @param request Solicitud HTTP; los datos JSON están en `request.body`.
 * @param response Respuesta HTTP de Express.
 */
export function postBenchmark(request, response) {
  response.json(runBenchmark(request.body));
}
