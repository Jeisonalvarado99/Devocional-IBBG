# Devocionales – Iglesia Bíblica Bautista de Guadalupe

Página estática para GitHub Pages. Los devocionales y los PDF se guardan en **Supabase** (gratis), por eso cualquiera que tenga el enlace puede agregar o quitar devocionales desde la página, sin tokens ni contraseñas, y se ve al instante.

## Estructura
- `index.html`, `css/styles.css`, `js/app.js` – la página
- `images/` – fondo, iglesia y miniaturas (`images/galeria/` se reparte entre los devocionales nuevos)
- `supabase.sql` – se ejecuta una vez en Supabase

## 1) Crear la base de datos (una sola vez, ~5 minutos)
1. Entra a https://supabase.com, crea una cuenta y un **New project** (cualquier nombre y contraseña; guárdala).
2. Cuando termine de crearse, ve a **SQL Editor → New query**, pega todo el contenido de `supabase.sql` y pulsa **Run**.
3. Ve a **Project Settings → API** (o **API Keys**) y copia:
   - **Project URL** (algo como `https://abcdefgh.supabase.co`)
   - la clave **anon public** (o **publishable**)
4. Abre `js/app.js` y pégalos arriba en `SUPABASE_URL` y `SUPABASE_KEY`.

## 2) Publicar en GitHub Pages
1. Sube el contenido de esta carpeta (no la carpeta en sí) a tu repositorio.
2. **Settings → Pages → Deploy from a branch → `main` / `(root)` → Save**.

## Uso
- **Agregar**: elige el domingo de inicio, revisa el título y adjunta el PDF.
- **Papelera** (en cada tarjeta): elimina el devocional y su PDF.
- Las semanas van de domingo a domingo. Para cambiarlo, edita `DIA_INICIO` en `js/app.js` (0 = domingo, 1 = lunes).

## Seguridad (léelo)
La clave de Supabase queda visible en el código de la página (es normal y está pensada así), y las reglas de `supabase.sql` permiten agregar y borrar a quien use la página. Es decir: **la única protección es no compartir el enlace públicamente**. Si el enlace circula mucho, cualquiera con conocimientos podría borrar devocionales. Si más adelante quieres protegerlo, se puede añadir una clave de acceso.
