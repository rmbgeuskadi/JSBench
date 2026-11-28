import { Router } from 'express';
import {
  getAlgorithms,
  postBenchmark,
} from '../controllers/benchmark-controller.js';

/** Rutas HTTP del microservicio de benchmarks. */
export const benchmarkRouter = Router();

// Endpoint sencillo para comprobar que el proceso está disponible.
benchmarkRouter.get('/health', (request, response) => {
  response.json({ status: 'UP' });
});
benchmarkRouter.get('/api/v1/algorithms', getAlgorithms);
benchmarkRouter.post('/api/v1/benchmark', postBenchmark);
