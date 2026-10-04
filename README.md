# Devocionales – Iglesia Bíblica Bautista de Guadalupe

Página estática para GitHub Pages. Los devocionales y los PDF se guardan en **Supabase** (gratis), por eso cualquiera que tenga el enlace puede agregar devocionales desde la página, sin tokens, y se ve al instante. **Borrar pide una contraseña** (ver el paso 2).

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

## 2) Contraseña para borrar (una sola vez)
1. Abre `proteger-borrado.sql` y cambia `CAMBIA_ESTA_CLAVE` por la contraseña que quieras (mínimo 6 caracteres).
2. Pégalo completo en **SQL Editor → New query** y pulsa **Run**.
3. Para cambiar la contraseña después, edita ese mismo valor y vuelve a ejecutar el archivo.
4. No vuelvas a ejecutar el `supabase.sql` viejo (el nuevo ya no deja borrar libremente).

## 3) Publicar en GitHub Pages
1. Sube el contenido de esta carpeta (no la carpeta en sí) a tu repositorio.
2. **Settings → Pages → Deploy from a branch → `main` / `(root)` → Save**.

## Uso
- **Agregar**: elige el domingo de inicio, revisa el título y adjunta el PDF.
- **Papelera** (en cada tarjeta): pide la contraseña y elimina el devocional de la lista. El archivo PDF queda guardado en Supabase (se puede borrar a mano en **Storage → pdf**); si agregas esa semana otra vez, se reemplaza.
- Las semanas van de domingo a domingo. Para cambiarlo, edita `DIA_INICIO` en `js/app.js` (0 = domingo, 1 = lunes).

## Seguridad (léelo)
La clave de Supabase queda visible en el código de la página (es normal y está pensada así). **Borrar** está protegido en el servidor: sin la contraseña no se puede borrar ni desde la página ni llamando directamente a la base. **Agregar** sigue abierto a quien use la página, así que conviene no compartir el enlace públicamente. Si más adelante quieres pedir contraseña también para agregar, se puede añadir.
