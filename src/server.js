import { app } from './app.js';

// PORT permite configurar el puerto sin cambiar el código; se usa 3000 por defecto.
const port = Number(process.env.PORT ?? 3000);

app.listen(port, () => {
  console.log(`JSBench API listening on port ${port}`);
});
