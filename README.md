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

VS Code te sugerirá instalar las extensiones recomendadas (EditorConfig, Prettier y GitHub Pull Requests). **Instálalas.** Con ellas, el código se formatea al guardar.

## Formato del código

Usamos **Prettier**. Hay dos niveles de protección:

1. **Al guardar** en VS Code (`formatOnSave`).
2. **Al hacer commit**: el hook `.githooks/pre-commit` formatea los archivos que van en el commit.

Comandos manuales:

```bash
npm run format        # formatea todo el proyecto
npm run format:check  # solo comprueba (lo que usará el CI)
```

> El hook se puede saltar con `--no-verify`, pero **no lo hagas**: el CI rechazará el PR si el formato no es correcto.

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
├── .vscode/          # configuración compartida del editor
│   ├── settings.json
│   └── extensions.json
├── .editorconfig
├── .gitattributes
├── .gitignore
├── .prettierrc
├── .prettierignore
├── package.json
├── package-lock.json
└── README.md
```
