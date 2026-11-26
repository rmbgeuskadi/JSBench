# Cómo contribuir a JSBench

¡Gracias por contribuir! Este repositorio es el microservicio JavaScript del proyecto global de _Prácticas Continuas_. Aceptamos contribuciones de otros equipos.

## 1. Preparar el entorno

### Requisitos

| Herramienta | Versión              |
| ----------- | -------------------- |
| Git         | 2.40 o superior      |
| Node.js     | 24 LTS o superior    |
| npm         | Incluido con Node.js |
| VS Code     | Recomendado          |

### Configura tu identidad de Git

Tus commits deben estar identificados con **tu nombre** y el **correo electrónico** asociado a tu cuenta de GitHub:

```bash
git config --global user.name "Nombre Apellido"
git config --global user.email "tu@email.com"
git config --global pull.ff only
git config --global core.autocrlf false
```

### Obtén el código

**Si eres del Equipo 5**, clona el repositorio directamente:

```bash
git clone https://github.com/rmbgeuskadi/JSBench.git
cd JSBench
```

**Si eres de otro equipo**, no tienes permisos de escritura, así que trabaja con un **fork**:

1. Pulsa **Fork** en la parte superior del repositorio en GitHub.
2. Clona **tu fork** y añade el repositorio original como `upstream`:

```bash
git clone https://github.com/<tu-usuario>/JSBench.git
cd JSBench
git remote add upstream https://github.com/rmbgeuskadi/JSBench.git
```

### Instala las dependencias

```bash
npm install
```

Este comando también **activa automáticamente los hooks de Git** (script `prepare`). Para comprobarlo:

```bash
git config core.hooksPath
# debe mostrar: .githooks
```

Si no muestra nada, ejecuta `npm run prepare`.

### Abre el proyecto en VS Code

```bash
code .
```

VS Code te sugerirá instalar las extensiones recomendadas (EditorConfig, Prettier y GitHub Pull Requests). **Instálalas.** Con ellas, el código se formatea al guardar.

## 2. Elegir qué hacer

1. Busca un issue abierto, o abre uno nuevo usando las plantillas.
2. Comenta en el issue que quieres trabajar en él.
3. **Espera a que un miembro del Equipo 5 te lo asigne** antes de empezar, para que no se duplique trabajo.

## 3. Flujo de trabajo

Crea siempre una rama nueva a partir de `main` actualizada.

**Equipo 5:**

```bash
git switch main
git pull
git switch -c feat/descripcion-corta
# ... cambios + tests ...
git commit -m "feat(api): descripción en imperativo"
git push -u origin feat/descripcion-corta
```

**Otros equipos (fork):**

```bash
git switch main
git pull upstream main
git switch -c feat/descripcion-corta
# ... cambios + tests ...
git commit -m "feat(algoritmos): añade quicksort"
git push -u origin feat/descripcion-corta
```

Después, abre un **Pull Request contra `main` de `rmbgeuskadi/JSBench`** (en GitHub o desde VS Code), rellena la plantilla y enlaza el issue con `Closes #N`.

### Convención de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/es/): `tipo(ámbito): descripción en imperativo`

| Tipo       | Uso                                         |
| ---------- | ------------------------------------------- |
| `feat`     | Funcionalidad nueva                         |
| `fix`      | Corrección de un error                      |
| `test`     | Tests                                       |
| `docs`     | Documentación                               |
| `refactor` | Reestructuración sin cambiar comportamiento |
| `chore`    | Mantenimiento, configuración, dependencias  |
| `ci`       | Pipelines                                   |

Usa el mismo prefijo en el nombre de la rama: `feat/...`, `fix/...`, `docs/...`, `ci/...`

## 4. Reglas

- **Formato:** usamos **Prettier**, que se aplica al guardar en VS Code y al hacer commit (hook `.githooks/pre-commit`). No uses `--no-verify`: el CI rechazará el PR si el formato no es correcto.
- **Tests:** todo algoritmo nuevo debe incluir tests unitarios que verifiquen que el resultado es correcto, y los tests existentes deben seguir pasando.
- **Formato de la API:** las contribuciones no deben cambiar las rutas, los campos ni los errores de la API descritos en el [README](README.md#contrato-de-la-api-v1). Si crees que hace falta un cambio, abre antes un issue para comentarlo.
- **Commits con tu identidad:** los commits los hace siempre una persona, nunca una IA.

### Uso de IA

Puedes usar herramientas de IA como apoyo, pero todo lo generado debe ser **revisado**, **comprendido** y **validado** por ti. Si la usas, **decláralo en la descripción del PR**, indicando la herramienta y qué se le pidió.

## 5. Antes de abrir el PR

Comprueba en local lo mismo que comprobará el CI:

```bash
npm run format:check   # formato
```

> Pendiente: se añadirán los comandos de tests cuando estén implementados.

## 6. Cómo añadir un algoritmo

> Pendiente: se completará cuando esté implementada la estructura de la API con MergeSort (dónde va el código, cómo se registra en el endpoint, qué tests incluir y su documentación).

## 7. Revisión y fusión

- `main` está protegida: no se admite push directo.
- Cada PR necesita **2 aprobaciones** de miembros del Equipo 5 (al menos una de CODEOWNERS) y el **CI en verde**.
- Hay que resolver todas las conversaciones antes de fusionar.
- Política de fusión: **squash and merge** (1 PR = 1 commit en `main`).

## 8. Estructura del proyecto

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
├── CONTRIBUTING.md
├── package.json
├── package-lock.json
└── README.md
```
