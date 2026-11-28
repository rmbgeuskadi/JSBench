import { mergeSort } from '../algorithms/merge-sort.js';
import { ApiError } from '../errors/api-error.js';

const RUNS = 5;
const MAX_SIZE = 1_000_000;
const LANGUAGE = 'javascript';
const ALGORITHMS = new Map([['mergesort', mergeSort]]);

/**
 * Devuelve los nombres canónicos de los algoritmos registrados.
 *
 * @returns {string[]} Nombres que acepta el endpoint de benchmark.
 */
export function listAlgorithms() {
  return [...ALGORITHMS.keys()];
}

/**
 * Valida y ejecuta un algoritmo cinco veces, devolviendo la mediana.
 *
 * Para cada ejecución, el cronómetro incluye tanto la generación de la entrada
 * aleatoria como la ordenación. `clock` y `generateInput` permiten probar el
 * protocolo de forma determinista; en producción se usan sus valores por
 * defecto.
 *
 * @param {{algorithm?: unknown, size?: unknown}|null|undefined} request Datos solicitados.
 * @param {object} [options] Dependencias opcionales para pruebas.
 * @param {() => bigint} [options.clock] Reloj monotónico en nanosegundos.
 * @param {(size: number) => number[]} [options.generateInput] Generador de entradas.
 * @returns {{language: string, algorithm: string, size: number, timeMs: number, runs: number}}
 * Resultado compatible con el contrato REST.
 * @throws {ApiError} Si la petición no es válida o el algoritmo no existe.
 */
export function runBenchmark(
  request,
  {
    clock = () => process.hrtime.bigint(),
    generateInput = generateRandomIntegers,
  } = {},
) {
  const algorithmName = request?.algorithm;
  const size = request?.size;

  if (typeof algorithmName !== 'string' || algorithmName.length === 0) {
    throw new ApiError(400, 'INVALID_ALGORITHM', 'algorithm is required');
  }

  const algorithm = ALGORITHMS.get(algorithmName);
  if (!algorithm) {
    throw new ApiError(404, 'ALGORITHM_NOT_FOUND', 'Algorithm not found');
  }

  if (!Number.isSafeInteger(size) || size < 1 || size > MAX_SIZE) {
    throw new ApiError(
      400,
      'INVALID_SIZE',
      `size must be an integer between 1 and ${MAX_SIZE}`,
    );
  }

  const durations = [];
  for (let run = 0; run < RUNS; run += 1) {
    const start = clock();
    const input = generateInput(size);
    algorithm(input);
    const elapsedNanoseconds = clock() - start;
    durations.push(Number(elapsedNanoseconds) / 1_000_000);
  }

  durations.sort((left, right) => left - right);

  return {
    language: LANGUAGE,
    algorithm: algorithmName,
    size,
    timeMs: durations[Math.floor(durations.length / 2)],
    runs: RUNS,
  };
}

/**
 * Genera enteros aleatorios con signo de 32 bits.
 *
 * @param {number} size Cantidad de valores que se generarán.
 * @returns {number[]} Array de entrada para el algoritmo.
 */
function generateRandomIntegers(size) {
  const values = new Array(size);
  for (let index = 0; index < size; index += 1) {
    values[index] = Math.floor(Math.random() * 2 ** 32) - 2 ** 31;
  }
  return values;
}
