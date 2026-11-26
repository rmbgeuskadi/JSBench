# JSBench

Microservicio en **JavaScript (Node.js)** del proyecto global de _Prácticas Continuas_. Expone una API REST que ejecuta algoritmos clásicos con un tamaño de entrada dado y devuelve su tiempo de ejecución (mediana de 5 mediciones).

Forma parte de la aplicación común: un frontend que compara el rendimiento de los mismos algoritmos en distintos lenguajes, con un microservicio por lenguaje.

> **Equipo 5** · Lenguaje: JavaScript

## Estado

- [x] Repositorio y configuración base
- [ ] API REST con MergeSort
- [ ] Tests unitarios e integración
- [ ] Docker
- [ ] Pipeline CI/CD

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

## Ejecución en local

> Pendiente: se completará cuando esté implementada la API.

## Tests

> Pendiente: se completará cuando estén implementados los tests.

## Docker y despliegue

> Pendiente: se completará cuando estén el `Dockerfile` y el pipeline de CD.

## Contribuir

¿Quieres colaborar? Consulta la [guía de contribución](CONTRIBUTING.md): configuración del entorno, flujo de trabajo, convenciones y revisión de PRs.
