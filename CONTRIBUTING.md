# Cómo contribuir a JSBench

¡Gracias por contribuir! Este repositorio es el microservicio JavaScript del proyecto global. Aceptamos contribuciones de otros equipos.

## 1. Preparar el entorno

Sigue la sección **Puesta en marcha** del [README](README.md): Node 24, `git clone` y `npm install` (este último activa los hooks).

## 2. Elegir qué hacer

- Busca un issue abierto, o abre uno nuevo usando las plantillas.
- Comenta en el issue que vas a trabajar en él para que no se duplique trabajo.

## 3. Flujo de trabajo

**No tienes permisos de escritura** (si no eres del Equipo 5): haz un **fork**.

```bash
git switch -c feat/nombre-corto
# ... cambios + tests ...
git commit -m "feat(algoritmos): añade quicksort"
git push -u origin feat/nombre-corto
```

Abre un Pull Request contra `main`, rellena la plantilla y enlaza el issue con `Closes #N`.

## 4. Reglas

- **Conventional Commits**: `tipo(ámbito): descripción en imperativo` (`feat`, `fix`, `test`, `docs`, `refactor`, `chore`, `ci`).
- **Formato**: Prettier, que se aplica solo al hacer commit. No uses `--no-verify`.
- **Tests**: todo algoritmo nuevo debe tener tests unitarios que verifiquen que el resultado es correcto.
- **Commits con tu identidad**: nunca commits hechos por una IA. Si usas IA, decláralo en el PR.

## 5. Revisión y fusión

- `main` está protegida: no se admite push directo.
- Cada PR necesita **1 aprobación** de un miembro del Equipo 5 (CODEOWNERS) y el **CI en verde**.
- Hay que resolver todas las conversaciones antes de fusionar.
- Política de fusión: **squash and merge** (1 PR = 1 commit en `main`).
