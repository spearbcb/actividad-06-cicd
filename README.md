# Actividad 06 — Despliegue Continuo y Flujo de Trabajo CI/CD

Proyecto base para demostrar un flujo completo de **Integración Continua (CI)**
y **Despliegue Continuo (CD)** usando GitHub, GitHub Actions y GitHub Pages.

---

## 1. Estructura del proyecto

```
proyecto/
├── index.html                     # Código base (página funcional)
├── css/
│   └── style.css
├── js/
│   └── main.js
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Integración continua (validación automática)
│       └── deploy.yml             # Despliegue: preview en PR + producción en main
└── README.md
```

---

## 2. Explicación del flujo de trabajo (sustentación)

El flujo sigue el ciclo estándar de CI/CD:

1. **Rama de trabajo (`feature branch`)**
   Todo cambio nuevo se desarrolla en una rama separada de `main`
   (por ejemplo `feature/nuevo-boton`), nunca directamente sobre la rama principal.

2. **Integración Continua (`ci.yml`)**
   Cada vez que se hace *push* a cualquier rama, o se abre un Pull Request
   hacia `main`, GitHub Actions ejecuta automáticamente una validación del
   código (HTMLHint), verificando que no existan errores estructurales.
   Esto corresponde al indicador **Workflow: se ejecuta automáticamente
   ante cada cambio**.

3. **Pull Request y Code Review**
   Cuando el cambio está listo, se abre un **Pull Request** desde la rama
   `feature/*` hacia `main`. Este es el punto de **control de calidad**:
   un compañero o el propio autor revisa el código (*Code Review*) antes
   de aprobar la fusión.

4. **Preview Deployment (`deploy.yml` → job `preview`)**
   Al abrirse el Pull Request, el workflow publica automáticamente una
   **versión de prueba** del sitio en una URL temporal
   (`https://usuario.github.io/repositorio/pr-preview/pr-<numero>/`)
   y deja un comentario en el propio PR con el enlace. Así se puede
   **validar visualmente el cambio antes de fusionarlo**, cumpliendo el
   indicador **Preview: se evidencia una revisión previa del cambio**.

5. **Merge a `main` y Despliegue en Producción (`deploy.yml` → job `production`)**
   Una vez aprobado el Pull Request y fusionado a `main`, se dispara
   automáticamente el job de producción, que publica la versión final
   en GitHub Pages, accesible públicamente en:

   ```
   https://<usuario>.github.io/<nombre-del-repositorio>/
   ```

   Esto cumple el indicador **Despliegue: la aplicación final está
   disponible y accesible en línea**.

En resumen: **push → validación automática → PR → preview → revisión →
merge → despliegue final**, sin ninguna intervención manual de subida
de archivos.

---

## 3. Guía paso a paso para reproducir el flujo en GitHub

### Paso 1 — Crear el repositorio
1. Crea un repositorio nuevo en GitHub (por ejemplo `actividad-06-cicd`).
2. Sube este proyecto a la rama `main`:
   ```bash
   git init
   git add .
   git commit -m "Estructura inicial del proyecto"
   git branch -M main
   git remote add origin https://github.com/<tu-usuario>/actividad-06-cicd.git
   git push -u origin main
   ```

### Paso 2 — Habilitar GitHub Pages
1. Ve a **Settings → Pages** en el repositorio.
2. En "Build and deployment", selecciona **Deploy from a branch**.
3. Elige la rama `gh-pages` (se creará automáticamente la primera vez que
   corra el workflow) y la carpeta `/ (root)`.

### Paso 3 — Crear una rama de trabajo y un cambio
```bash
git checkout -b feature/mejora-visual
# edita index.html, css/style.css o js/main.js
git add .
git commit -m "Agrega mejora visual a la página"
git push origin feature/mejora-visual
```
Este *push* dispara automáticamente el workflow **ci.yml**.

### Paso 4 — Abrir el Pull Request
1. En GitHub, abre un Pull Request de `feature/mejora-visual` hacia `main`.
2. El workflow **deploy.yml** (job `preview`) se ejecuta automáticamente
   y comenta en el PR el enlace de la vista previa (*Preview Deployment*).
3. Revisa el enlace, comenta el código si es necesario (*Code Review*).

### Paso 5 — Fusionar (merge) el Pull Request
1. Una vez aprobado, haz clic en **Merge pull request**.
2. Esto dispara el job `production` del workflow **deploy.yml**, que
   publica la versión final en:
   ```
   https://<tu-usuario>.github.io/actividad-06-cicd/
   ```

### Paso 6 — Verificar
- Revisa la pestaña **Actions** del repositorio: deben verse las
  ejecuciones exitosas de `CI - Validación de código` y
  `CD - Despliegue continuo`.
- Abre la URL pública para confirmar que el cambio está en vivo.

---

## 4. Checklist de entrega (según los criterios de evaluación)

| Indicador     | Evidencia en este proyecto                                            |
|---------------|-------------------------------------------------------------------------|
| Repositorio   | Estructura organizada (`index.html`, `css/`, `js/`, `.github/workflows/`) |
| Workflow      | `ci.yml` se ejecuta en cada push y Pull Request                        |
| Preview       | Job `preview` en `deploy.yml`, publica y comenta el enlace en el PR      |
| Despliegue    | Job `production` en `deploy.yml`, publica en GitHub Pages tras el merge |
| Explicación   | Sección 2 de este README (sustentación del flujo)                       |

---

## 5. Notas técnicas
- No se requieren *secrets* adicionales: todo funciona con el
  `GITHUB_TOKEN` que GitHub Actions genera automáticamente.
- El *Preview Deployment* se implementa con la acción
  `rossjrw/pr-preview-action`, que publica cada PR en una subcarpeta
  independiente dentro de la rama `gh-pages`.
- El despliegue de producción se implementa con
  `peaceiris/actions-gh-pages`, publicando el contenido de la raíz del
  proyecto en la rama `gh-pages`.
