import assert from 'node:assert/strict';
import test, { after, before } from 'node:test';
import { app } from '../src/app.js';

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

function postBenchmark(requestBody) {
  return fetch(`${baseUrl}/api/v1/benchmark`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(requestBody),
  });
}

test('GET /health devuelve el estado del servicio', async () => {
  const response = await fetch(`${baseUrl}/health`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'UP' });
});

test('GET /api/v1/algorithms lista los algoritmos implementados', async () => {
  const response = await fetch(`${baseUrl}/api/v1/algorithms`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { algorithms: ['mergesort'] });
});

test('POST /api/v1/benchmark devuelve la respuesta conforme al contrato', async () => {
  const response = await postBenchmark({ algorithm: 'mergesort', size: 20 });
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.equal(result.language, 'javascript');
  assert.equal(result.algorithm, 'mergesort');
  assert.equal(result.size, 20);
  assert.equal(result.runs, 5);
  assert.equal(Number.isFinite(result.timeMs), true);
  assert.equal(result.timeMs >= 0, true);
});

test('POST /api/v1/benchmark acepta el tamaño mínimo', async () => {
  const response = await postBenchmark({ algorithm: 'mergesort', size: 1 });
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.equal(result.size, 1);
});

test('POST /api/v1/benchmark rechaza algoritmos ausentes o no válidos', async (t) => {
  const invalidRequests = [
    ['ausente', { size: 20 }],
    ['vacío', { algorithm: '', size: 20 }],
    ['de tipo incorrecto', { algorithm: 42, size: 20 }],
  ];

  for (const [description, requestBody] of invalidRequests) {
    await t.test(description, async () => {
      const response = await postBenchmark(requestBody);

      assert.equal(response.status, 400);
      assert.deepEqual(await response.json(), {
        error: {
          code: 'INVALID_ALGORITHM',
          message: 'algorithm is required',
        },
      });
    });
  }
});

test('POST /api/v1/benchmark rechaza tamaños que no son enteros dentro del límite', async (t) => {
  const invalidRequests = [
    ['cero', { algorithm: 'mergesort', size: 0 }],
    ['negativo', { algorithm: 'mergesort', size: -1 }],
    ['decimal', { algorithm: 'mergesort', size: 1.5 }],
    ['texto', { algorithm: 'mergesort', size: '20' }],
    ['nulo', { algorithm: 'mergesort', size: null }],
    ['superior al máximo', { algorithm: 'mergesort', size: 1_000_001 }],
    ['ausente', { algorithm: 'mergesort' }],
  ];

  for (const [description, requestBody] of invalidRequests) {
    await t.test(description, async () => {
      const response = await postBenchmark(requestBody);

      assert.equal(response.status, 400);
      assert.deepEqual(await response.json(), {
        error: {
          code: 'INVALID_SIZE',
          message: 'size must be an integer between 1 and 1000000',
        },
      });
    });
  }
});

test('POST /api/v1/benchmark devuelve 404 si el algoritmo no está implementado', async () => {
  const response = await postBenchmark({ algorithm: 'quicksort', size: 20 });

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), {
    error: {
      code: 'ALGORITHM_NOT_FOUND',
      message: 'Algorithm not found',
    },
  });
});

test('POST /api/v1/benchmark devuelve 400 si el JSON no es válido', async () => {
  const response = await fetch(`${baseUrl}/api/v1/benchmark`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{"algorithm":',
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: {
      code: 'INVALID_JSON',
      message: 'Request body must be valid JSON',
    },
  });
});

test('POST /api/v1/benchmark rechaza cuerpos demasiado grandes', async () => {
  const response = await postBenchmark({
    algorithm: 'mergesort',
    size: 1,
    extra: 'a'.repeat(11_000),
  });

  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), {
    error: {
      code: 'PAYLOAD_TOO_LARGE',
      message: 'Request body is too large',
    },
  });
});
