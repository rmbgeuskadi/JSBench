/**
 * Ordena un array de números de menor a mayor mediante MergeSort.
 *
 * Modifica el array recibido y devuelve la misma referencia. Usa memoria
 * adicional O(n) y tiene complejidad temporal O(n log n).
 *
 * @param {number[]} values Array que se ordenará.
 * @returns {number[]} El mismo array, ya ordenado.
 */
export function mergeSort(values) {
  if (values.length < 2) {
    return values;
  }

  const buffer = new Array(values.length);
  sortRange(values, buffer, 0, values.length);
  return values;
}

/**
 * Ordena recursivamente el segmento semiabierto [start, end).
 *
 * Cada llamada divide el segmento en dos mitades; cuando ambas están
 * ordenadas, las combina usando el buffer compartido.
 *
 * @param {number[]} values Array que se está ordenando.
 * @param {number[]} buffer Buffer auxiliar reutilizado durante la ordenación.
 * @param {number} start Índice inicial incluido.
 * @param {number} end Índice final excluido.
 */
function sortRange(values, buffer, start, end) {
  if (end - start < 2) {
    return;
  }

  const middle = Math.floor((start + end) / 2);
  sortRange(values, buffer, start, middle);
  sortRange(values, buffer, middle, end);
  merge(values, buffer, start, middle, end);
}

/**
 * Combina dos segmentos contiguos que ya están ordenados.
 *
 * Copia el segmento al buffer antes de escribir el resultado en `values`.
 * En caso de empate, toma primero el elemento de la mitad izquierda.
 *
 * @param {number[]} values Array de destino.
 * @param {number[]} buffer Buffer auxiliar.
 * @param {number} start Índice inicial incluido.
 * @param {number} middle Límite entre las dos mitades.
 * @param {number} end Índice final excluido.
 */
function merge(values, buffer, start, middle, end) {
  for (let index = start; index < end; index += 1) {
    buffer[index] = values[index];
  }

  let left = start;
  let right = middle;

  for (let index = start; index < end; index += 1) {
    if (right >= end || (left < middle && buffer[left] <= buffer[right])) {
      values[index] = buffer[left];
      left += 1;
    } else {
      values[index] = buffer[right];
      right += 1;
    }
  }
}
