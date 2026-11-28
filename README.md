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
- [x] Docker
- [ ] Pipeline de CD

## Contrato de la API (v1)

Basado en el ejemplo de la guía del proyecto (apartado 3.4). Se ajustará si los equipos acuerdan cambios.

### `POST /api/v1/benchmark`

**Petición**

| Campo       | Tipo    | Descripción                                                                                 |
| ----------- | ------- | ------------------------------------------------------------------------------------------- |
| `algorithm` | string  | `mergesort` \| `quicksort` \| `insertionsort` \| `selectionsort` \| `fibonacci` \| `matmul` |
| `size`      | integer | Tamaño de la entrada (entero entre 1 y 1 000 000)                                           |

Por ahora solo está implementado `mergesort`.

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

**Errores**: cuerpo `{ "error": { "code": string, "message": string } }`

| Código | Cuándo                                                   |
| ------ | -------------------------------------------------------- |
| 400    | `algorithm` ausente, `size` no válido o JSON mal formado |
| 404    | Algoritmo no implementado todavía                        |
| 413    | Cuerpo de la petición demasiado grande                   |

### `GET /api/v1/algorithms`

Devuelve los algoritmos implementados en este microservicio.

```json
{ "algorithms": ["mergesort"] }
```

## Requisitos

| Herramienta | Versión                       |
| ----------- | ----------------------------- |
| Git         | 2.40 o superior               |
| Node.js     | 24 LTS o superior             |
| npm         | Incluido con Node.js          |
| VS Code     | Recomendado                   |
| Docker      | Opcional, para usar la imagen |

## Puesta en marcha (primera vez)

### 1. Configura tu identidad de Git

Tus commits deben llevar **tu nombre** y el correo de tu cuenta de GitHub:

```bash
git config --global user.name "Nombre Apellido"
git config --global user.email "tu@email.com"
git config --global pull.ff only
git config --global core.autocrlf false
```

### 2. Clona el repositorio e instala las dependencias

```bash
git clone https://github.com/rmbgeuskadi/JSBench.git
cd JSBench
npm install
```

`npm install` activa los hooks de Git (script `prepare`). Compruébalo con `git config core.hooksPath`, que debe mostrar `.githooks`. Si no muestra nada, ejecuta `npm run prepare`.

### 3. Abre el proyecto en VS Code

VS Code te sugerirá instalar las extensiones recomendadas (EditorConfig,
Prettier, GitHub Pull Requests y REST Client). **Instálalas.** Prettier permite
formatear el código al guardar y REST Client permite probar la API desde el
editor.

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

## Docker

La imagen se construye a partir del `Dockerfile` de la raíz (Node 24, solo dependencias de producción, usuario sin privilegios y healthcheck sobre `/health`).

### Construir la imagen

```bash
docker build -t jsbench:0.1 .
```

### Ejecutar el contenedor

```bash
docker run --rm --name jsbench -p 3000:3000 jsbench:0.1
```

La API queda disponible en `http://localhost:3000`. El puerto se puede cambiar con la variable `PORT`.

`docker ps` debe mostrar el contenedor como `(healthy)`.

### Comprobar que funciona

```bash
curl http://localhost:3000/health
# {"status":"UP"}

curl -X POST http://localhost:3000/api/v1/benchmark \
  -H "Content-Type: application/json" \
  -d '{"algorithm":"mergesort","size":10000}'
```

> En PowerShell usa `curl.exe` o `Invoke-RestMethod` en lugar de `curl`, y escapa las comillas del JSON.

Para detener el contenedor: `docker stop jsbench`.

## Formato del código

Usamos **Prettier**. Hay dos niveles de protección:

1. **Al guardar** en VS Code (`formatOnSave`).
2. **Al hacer commit**: el hook `.githooks/pre-commit` formatea los archivos que van en el commit.

Comandos manuales:

```bash
npm run format        # formatea todo el proyecto
npm run format:check  # solo comprueba; es lo que verifica el CI
```

## Contribuir

¿Quieres colaborar? Consulta la [guía de contribución](CONTRIBUTING.md): configuración del entorno, flujo de trabajo, convenciones y revisión de PRs.

### Convención de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/es/): `tipo(ámbito): descripción`

| Tipo       | Uso                                         |
| ---------- | ------------------------------------------- |
| `feat`     | Funcionalidad nueva                         |
| `fix`      | Corrección de un error                      |
| `test`     | Tests                                       |
| `docs`     | Documentación                               |
| `refactor` | Reestructuración sin cambiar comportamiento |
| `chore`    | Mantenimiento, configuración, dependencias  |
| `ci`       | Pipelines                                   |

### Uso de IA

Está permitido utilizar herramientas de IA como apoyo al desarrollo, pero todo contenido generado debe ser **revisado**, **comprendido** y **validado por una persona**.

Los cambios realizados con ayuda de IA deben documentarse según las normas de trabajo acordadas por el equipo. Los commits deben ser realizados siempre por una persona.

## Estructura

```text
JSBench/
├── .github/
│   ├── ISSUE_TEMPLATE/   # plantillas de issues (bug, enhancement)
│   ├── workflows/        # pipelines de GitHub Actions
│   │   └── ci.yml
│   ├── CODEOWNERS
│   └── PULL_REQUEST_TEMPLATE.md
├── .githooks/            # hooks de Git versionados
│   └── pre-commit
├── .vscode/              # configuración compartida del editor
│   ├── settings.json
│   └── extensions.json
├── src/
│   ├── algorithms/
│   ├── controllers/
│   ├── errors/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   └── server.js
├── test/
│   ├── algorithms/
│   ├── services/
│   └── api.test.js
├── .dockerignore
├── .editorconfig
├── .gitattributes
├── .gitignore
├── .prettierrc
├── .prettierignore
├── api.http              # peticiones de ejemplo para REST Client
├── CONTRIBUTING.md
├── Dockerfile
├── package.json
├── package-lock.json
└── README.md
```