import assert from 'node:assert/strict';
import test from 'node:test';
import { runBenchmark } from '../../src/services/benchmark-service.js';

test('runBenchmark realiza cinco mediciones y devuelve su mediana', () => {
  const durationsNanoseconds = [9n, 1n, 5n, 3n, 7n];
  const clockValues = durationsNanoseconds.flatMap((duration, run) => {
    const start = BigInt(run) * 100n;
    return [start, start + duration];
  });
  let clockCalls = 0;
  let generatedInputCount = 0;

  const result = runBenchmark(
    { algorithm: 'mergesort', size: 3 },
    {
      clock: () => clockValues[clockCalls++],
      generateInput: () => {
        generatedInputCount += 1;
        return [3, 1, 2];
      },
    },
  );

  assert.equal(clockCalls, 10);
  assert.equal(generatedInputCount, 5);
  assert.equal(result.runs, 5);
  assert.equal(result.timeMs, 5 / 1_000_000);
});
