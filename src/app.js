import express from 'express';
import { benchmarkRouter } from './routes/benchmark-routes.js';
import { ApiError } from './errors/api-error.js';

/** Aplicación Express configurada y exportada para el servidor y las pruebas. */
export const app = express();

// Limita el tamaño de las peticiones JSON antes de entregarlas a las rutas.
app.use(express.json({ limit: '10kb' }));
app.use(benchmarkRouter);

// Mantiene las respuestas de rutas inexistentes en el mismo formato JSON.
app.use((request, response) => {
  response.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  });
});

// Convierte errores conocidos en respuestas JSON y evita filtrar detalles internos.
app.use((error, request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }

  const isApiError = error instanceof ApiError;
  const isPayloadError = error.type === 'entity.parse.failed';
  const statusCode = isApiError
    ? error.statusCode
    : isPayloadError
      ? 400
      : error.status === 413
        ? 413
        : 500;

  if (statusCode >= 500) {
    console.error(error);
  }

  response.status(statusCode).json({
    error: {
      code: isApiError
        ? error.code
        : isPayloadError
          ? 'INVALID_JSON'
          : statusCode === 413
            ? 'PAYLOAD_TOO_LARGE'
            : 'INTERNAL_SERVER_ERROR',
      message: isApiError
        ? error.message
        : isPayloadError
          ? 'Request body must be valid JSON'
          : statusCode === 413
            ? 'Request body is too large'
            : 'An unexpected error occurred',
    },
  });
});
