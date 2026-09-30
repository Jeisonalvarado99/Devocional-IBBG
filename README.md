# Devocionales – Iglesia Bíblica Bautista de Guadalupe

Página estática (HTML, CSS y JS) para GitHub Pages.

## Estructura
- `index.html` – página principal
- `css/styles.css` – estilos
- `js/app.js` – lógica (buscador, año, botón Agregar)
- `data/devocionales.json` – lista de devocionales (la página la lee al abrir)
- `pdf/` – PDF de cada semana
- `images/` – fondo, iglesia y miniaturas

## Publicar el sitio
1. Sube el contenido de esta carpeta (no la carpeta en sí) a un repositorio.
2. **Settings → Pages → Deploy from a branch → `main` / `(root)` → Save**.
3. Quedará en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

## Agregar un devocional desde la página (botón «Agregar»)
El botón sube el PDF a la carpeta `pdf/` y añade la semana a `data/devocionales.json` directamente en el repositorio. Después GitHub Pages se actualiza solo (1–2 minutos) y todos lo ven.

Necesita un **token de GitHub** (una sola vez por navegador):
1. GitHub → tu foto → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. **Repository access → Only select repositories →** elige este repositorio.
3. **Permissions → Repository permissions → Contents: Read and write**.
4. Pon una fecha de vencimiento, crea el token y cópialo (`github_pat_…`).
5. En la página pulsa **Agregar**, pega el token junto con el PDF y guarda.

Notas:
- El token se guarda solo en ese navegador. Úsalo únicamente en tu dispositivo o el de quien administre. «Olvidar token» (en la ventana Agregar) lo borra.
- Mientras el token está guardado, cada tarjeta muestra una papelera para eliminar ese devocional del repositorio.
- Las semanas van de **domingo a domingo**. Para cambiarlo, edita `DIA_INICIO` al inicio de `js/app.js` (0 = domingo, 1 = lunes).
- Si el sitio no está en `usuario.github.io/repositorio`, escribe el repositorio en `REPOSITORIO` (`js/app.js`).

## Agregar a mano (sin token)
Sube el PDF a `pdf/` y agrega un bloque al inicio de `data/devocionales.json` con `titulo`, `fecha`, `inicio` (AAAA-MM-DD), `anio`, `img` y `pdf`.
