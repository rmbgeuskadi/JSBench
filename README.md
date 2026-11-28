# JSBench

[![CI](https://github.com/rmbgeuskadi/JSBench/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/rmbgeuskadi/JSBench/actions/workflows/ci.yml)

Microservicio en **JavaScript (Node.js)** del proyecto global de _Prácticas Continuas_. Expone una API REST que ejecuta algoritmos clásicos con un tamaño de entrada dado y devuelve su tiempo de ejecución (mediana de 5 mediciones).

Forma parte de la aplicación común: un frontend que compara el rendimiento de los mismos algoritmos en distintos lenguajes, con un microservicio por lenguaje.

> **Equipo 5** · Lenguaje: JavaScript

## Estado

- [x] Repositorio y configuración base
- [x] API REST inicial con MergeSort
- [x] Tests unitarios e integración iniciales
- [x] Pipeline de CI
- [ ] Docker
- [ ] Pipeline de CD

## Contrato de la API (v1)

Basado en el ejemplo de la guía del proyecto (apartado 3.4). Se ajustará si los equipos acuerdan cambios.

### `POST /api/v1/benchmark`

**Petición**

| Campo       | Tipo    | Descripción                                                                                 |
| ----------- | ------- | ------------------------------------------------------------------------------------------- |
| `algorithm` | string  | `mergesort` \| `quicksort` \| `insertionsort` \| `selectionsort` \| `fibonacci` \| `matmul` |
| `size`      | integer | Tamaño de la entrada (> 0)                                                                  |

```json
{ "algorithm": "mergesort", "size": 10000 }
```

**Respuesta 200 OK**

| Campo       | Tipo    | Descripción                                  |
| ----------- | ------- | -------------------------------------------- |
| `language`  | string  | Siempre `"javascript"`                       |
| `algorithm` | string  | Algoritmo ejecutado                          |
| `size`      | integer | Tamaño de la entrada                         |
| `timeMs`    | number  | Mediana de las 5 mediciones, en milisegundos |
| `runs`      | integer | Número de mediciones (siempre 5)             |

```json
{
  "language": "javascript",
  "algorithm": "mergesort",
  "size": 10000,
  "timeMs": 12.34,
  "runs": 5
}
```

**Errores**: cuerpo `{ "error": string }`

| Código | Cuándo                            |
| ------ | --------------------------------- |
| 400    | Petición no válida                |
| 501    | Algoritmo no implementado todavía |

### `GET /api/v1/algorithms`

Devuelve los algoritmos implementados en este microservicio.

```json
{ "algorithms": ["mergesort"] }
```

## Requisitos

| Herramienta | Versión                       |
| ----------- | ----------------------------- |
| Node.js     | 24 LTS o superior             |
| npm         | Incluido con Node.js          |
| Docker      | Opcional, para usar la imagen |

## Arquitectura

La aplicación sigue el flujo `ruta → controlador → servicio → algoritmo`.
`src/app.js` configura Express, rutas y errores; `src/server.js` inicia el
servidor. Los controladores traducen HTTP, el servicio valida y mide la
ejecución, y los algoritmos se mantienen independientes de la API.

## Ejecución en local

Instala las dependencias y arranca el servicio:

```bash
npm install
npm start
```

Por defecto escucha en `http://localhost:3000`; se puede cambiar con la variable
de entorno `PORT`. Para desarrollo con reinicio automático:

```bash
npm run dev
```

Endpoints disponibles:

| Método | Endpoint             | Descripción                                    |
| ------ | -------------------- | ---------------------------------------------- |
| `GET`  | `/health`            | Estado del servicio                            |
| `GET`  | `/api/v1/algorithms` | Algoritmos implementados                       |
| `POST` | `/api/v1/benchmark`  | Ejecuta cinco mediciones y devuelve la mediana |

Ejemplo:

```bash
curl -X POST http://localhost:3000/api/v1/benchmark \
  -H "Content-Type: application/json" \
  -d '{"algorithm":"mergesort","size":10000}'
```

El tamaño debe ser un entero entre 1 y 1 000 000. Cada medición genera un
array aleatorio nuevo de enteros de 32 bits y cronometra la generación y la
ordenación. Este protocolo inicial replica el del microservicio Java y debe
confirmarse con los demás equipos antes de considerarse definitivo.

### Probar desde VS Code

Con el servidor iniciado mediante `npm start`, abre [`api.http`](api.http) y
pulsa **Send Request** encima de una petición. La extensión REST Client muestra
la respuesta en una pestaña de VS Code; no hace falta instalar ninguna
dependencia npm adicional.

## Tests

```bash
npm test
```

## Docker y despliegue

> Pendiente: se completará cuando estén el `Dockerfile` y el pipeline de CD.

## Contribuir

¿Quieres colaborar? Consulta la [guía de contribución](CONTRIBUTING.md): configuración del entorno, flujo de trabajo, convenciones y revisión de PRs.
