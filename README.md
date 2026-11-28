# JSBench

[![CI](https://github.com/rmbgeuskadi/JSBench/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/rmbgeuskadi/JSBench/actions/workflows/ci.yml)

Microservicio en **JavaScript (Node.js)** del proyecto global de _Prácticas Continuas_. Expone una API REST que ejecuta algoritmos clásicos con un tamaño de entrada dado y devuelve su tiempo de ejecución (mediana de 5 mediciones).

Forma parte de la aplicación común: un frontend que compara el rendimiento de los mismos algoritmos en distintos lenguajes, con un microservicio por lenguaje.

> **Equipo 5** · Lenguaje: JavaScript

## Estado

- [x] Repositorio y configuración base
- [x] API REST inicial con MergeSort
- [x] Tests unitarios e integración iniciales
- [x] Docker
- [x] Pipeline CI/CD

## Requisitos

| Herramienta | Versión              |
| ----------- | -------------------- |
| Git         | 2.40 o superior      |
| Node.js     | 24 LTS o superior    |
| npm         | Incluido con Node.js |
| VS Code     | Recomendado          |

## Puesta en marcha (primera vez)

### 1. Configura tu identidad de Git

Tus commits deben estar identificados con **tu nombre** y el **correo electrónico** asociado a tu cuenta de GitHub:

```bash
git config --global user.name "Nombre Apellido"
git config --global user.email "tu@email.com"
git config --global pull.ff only
git config --global core.autocrlf false
```

### 2. Clona el repositorio

```bash
git clone https://github.com/rmbgeuskadi/JSBench.git
cd JSBench
```

### 3. Instala las dependencias

```bash
npm install
```

Este comando también **activa automáticamente los hooks de Git** (script `prepare`). Para comprobarlo:

```bash
git config core.hooksPath
# debe mostrar: .githooks
```

Si no muestra nada, ejecuta `npm run prepare`.

### 4. Abre el proyecto en VS Code

```bash
code .
```

VS Code te sugerirá instalar las extensiones recomendadas (EditorConfig,
Prettier, GitHub Pull Requests y REST Client). **Instálalas.** Prettier permite
formatear el código al guardar y REST Client permite probar la API desde el
editor.

## Uso con Docker

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

Para detener el contenedor: `docker stop jsbench`.

## Formato del código

Usamos **Prettier**. Hay dos niveles de protección:

1. **Al guardar** en VS Code (`formatOnSave`).
2. **Al hacer commit**: el hook `.githooks/pre-commit` formatea los archivos que van en el commit.

Comandos manuales:

```bash
npm run format        # formatea todo el proyecto
npm run format:check  # solo comprueba; podrá ejecutarse en CI cuando esté configurado
```

> El hook se puede saltar con `--no-verify`, pero **no lo hagas**. El hook aplica el formato localmente; el pipeline de CI todavía está pendiente de configuración.

## CI/CD

Utilizamos **GitHub Actions** para automatizar la integración continua (CI) y la publicación de imágenes Docker (CD).

Los workflows se encuentran en `.github/workflows/`:

- `ci.yml`: integración continua del proyecto.
- `release.yml`: construcción y publicación de la imagen Docker en
  GitHub Container Registry (GHCR).

### Publicación de imágenes Docker

El workflow `release.yml` se ejecuta automáticamente cuando:

- Se incorporan cambios a la rama `main`.
- Se publica una etiqueta de versión con el formato `vX.Y.Z`.

La imagen Docker se construye a partir del `Dockerfile` de la raíz y se publica en `ghcr.io/rmbgeuskadi/jsbench`.

Se generan automáticamente las siguientes etiquetas:

| Etiqueta | Descripción |
| -------- | ----------- |
| `latest` | Última imagen publicada desde `main` |
| `sha-<commit>` | Identificador del commit asociado a la imagen |
| `X.Y.Z` | Versión completa |
| `X.Y` | Versión mayor y menor |
| `X` | Versión mayor |

### Publicar una nueva versión

Para publicar una versión siguiendo el versionado semántico:

```bash
git switch main
git pull
git tag v0.1.0
git push origin v0.1.0
```

GitHub Actions construirá y publicará automáticamente la imagen con las etiquetas correspondientes.

### Ejecutar una imagen publicada

```bash
docker pull ghcr.io/rmbgeuskadi/jsbench:latest
docker run --rm --name jsbench -p 3000:3000 ghcr.io/rmbgeuskadi/jsbench:latest
```

De esta forma, no es necesario construir la imagen Docker localmente.

## API y desarrollo local

La aplicación sigue el flujo `ruta → controlador → servicio → algoritmo`.
`src/app.js` configura Express, rutas y errores; `src/server.js` inicia el
servidor. Los controladores traducen HTTP, el servicio valida y mide la
ejecución, y los algoritmos se mantienen independientes de la API.

Arranca el servicio con:

```bash
npm start
```

Por defecto escucha en `http://localhost:3000`; se puede cambiar con la variable
de entorno `PORT`. Para desarrollo con reinicio automático:

```bash
npm run dev
```

Endpoints iniciales:

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
ordenación. Este protocolo inicial replica el ejemplo Java y debe confirmarse
con los demás equipos antes de usarlo como contrato definitivo.

Ejecuta las pruebas con:

```bash
npm test
```

### Probar desde VS Code

Con el servidor iniciado mediante `npm start`, abre [`api.http`](api.http) y
pulsa **Send Request** encima de una petición. La extensión REST Client muestra
la respuesta en una pestaña de VS Code; no hace falta instalar ninguna
dependencia npm adicional.

## Flujo de trabajo

- **No se hace push directo a `main`.** Todo cambio entra por Pull Request.
- Cada PR necesita al menos **1 aprobación** de un miembro del equipo y el **CI en verde**.

```bash
git switch main
git pull
git switch -c feat/descripcion-corta
# ... cambios ...
git add .
git commit -m "feat(api): descripción en imperativo"
git push -u origin feat/descripcion-corta
# Abre el PR en GitHub o desde VS Code (extensión GitHub Pull Requests)
```

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
├── .githooks/        # hooks de Git versionados
│   └── pre-commit
├── api.http          # peticiones de ejemplo para REST Client
├── .vscode/          # configuración compartida del editor
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
├── Dockerfile
├── package.json
├── package-lock.json
└── README.md
```
