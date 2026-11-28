import assert from 'node:assert/strict';
import test from 'node:test';
import { mergeSort } from '../../src/algorithms/merge-sort.js';

test('mergeSort gestiona arrays vacíos y de un solo elemento', () => {
  assert.deepEqual(mergeSort([]), []);
  assert.deepEqual(mergeSort([42]), [42]);
});

test('mergeSort ordena los valores de forma ascendente en el sitio', () => {
  const values = [8, -3, 5, 5, 0, -10, 2];

  const result = mergeSort(values);

  assert.strictEqual(result, values);
  assert.deepEqual(values, [-10, -3, 0, 2, 5, 5, 8]);
});

test('mergeSort gestiona arrays ya ordenados y ordenados a la inversa', () => {
  assert.deepEqual(mergeSort([1, 2, 3, 4]), [1, 2, 3, 4]);
  assert.deepEqual(mergeSort([4, 3, 2, 1]), [1, 2, 3, 4]);
});

test('mergeSort ordena arrays deterministas de distintos tamaños', () => {
  const oddLengthInput = Array.from(
    { length: 31 },
    (_, index) => ((index * 17) % 23) - 11,
  );
  const evenLengthInput = Array.from(
    { length: 32 },
    (_, index) => ((index * 29) % 37) - 18,
  );

  for (const input of [oddLengthInput, evenLengthInput]) {
    const expected = [...input].sort((left, right) => left - right);

    assert.deepEqual(mergeSort([...input]), expected);
  }
});
