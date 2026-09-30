/* Iconos */
const ICONO = {
  cal:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17M7.5 13.5h.01M12 13.5h.01M16.5 13.5h.01M7.5 17h.01M12 17h.01M16.5 17h.01"/></svg>',
  ojo:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z"/><circle cx="12" cy="12" r="3.2"/></svg>',
  desc:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m-5-5 5 5 5-5M4 20h16"/></svg>',
  borrar:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>'
};
/* Los devocionales van de domingo a domingo. 0 = domingo (1 = lunes, etc.) */
const DIA_INICIO = 0;

/* Conexión con Supabase (ver README.md). Estos dos datos son públicos por diseño. */
const SUPABASE_URL = "https://jwqdiectclkscimvaurd.supabase.co";   /* por ejemplo: https://abcdefgh.supabase.co */
const SUPABASE_KEY = "sb_publishable__NdYmsujVReBNksAQXMqww_xY4yG4wm";   /* clave "anon" o "publishable" */
const BUCKET = "pdf";

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Setiembre","Octubre","Noviembre","Diciembre"];
/* Miniaturas que se reparten entre los devocionales nuevos (una distinta cada semana). Para agregar más, sube la imagen a images/galeria/ y añádela aquí */
const IMAGENES = [
  "images/galeria/01-biblia-sobre-mesa-madera.jpg",
  "images/galeria/02-montanas-atardecer.jpg",
  "images/galeria/03-lago-atardecer-hojas.jpg",
  "images/galeria/04-cruz-atardecer.jpg",
  "images/galeria/05-lago-reflejo-bosque.jpg",
  "images/galeria/06-biblia-ventana-taza.jpg",
  "images/galeria/07-cascada-bosque.jpg",
  "images/galeria/08-campo-trigo.jpg",
  "images/galeria/09-bosque-rayos-sol.jpg",
  "images/galeria/10-pueblo-atardecer-valla.jpg",
  "images/galeria/11-biblia-flores-ventana.jpg",
  "images/galeria/12-montanas-cielo-rosa.jpg",
  "images/galeria/13-lago-islas-atardecer.jpg",
  "images/galeria/14-biblia-linterna.jpg",
  "images/galeria/15-sendero-valla-arbol.jpg",
  "images/galeria/16-valle-rio-atardecer.jpg",
  "images/galeria/17-montanas-niebla.jpg",
  "images/galeria/18-biblia-colina-atardecer.jpg",
  "images/galeria/19-muelle-lago.jpg",
  "images/galeria/20-hojas-cielo-sol.jpg"
];
const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const $ = id => document.getElementById(id);
const lista = $("lista"), vacio = $("vacio"), q = $("q"), sel = $("anio");

/* ---------- Supabase ---------- */
const conectado = () => !!(SUPABASE_URL && SUPABASE_KEY);
const base = () => SUPABASE_URL.replace(/\/$/, "");
const urlPdf = ruta => `${base()}/storage/v1/object/public/${BUCKET}/${ruta}`;
async function sb(metodo, ruta, opciones = {}){
  const r = await fetch(base() + ruta, { method:metodo, headers:{ apikey:SUPABASE_KEY, ...(opciones.headers || {}) }, body:opciones.cuerpo, cache:"no-store" });
  if (!r.ok) { const e = new Error("sb"); e.status = r.status; throw e; }
  return r;
}
function mensajeError(e){
  if (e.status === 409) return "Ya existe un devocional para esa semana.";
  if (e.status === 401 || e.status === 403) return "Sin permiso para guardar. Revisa que ejecutaste el archivo supabase.sql.";
  if (e.status === 413) return "El PDF es demasiado grande.";
  return "No se pudo conectar. Revisa tu internet e intenta de nuevo.";
}

let datos = [], errorCarga = "";
async function cargarDatos(){
  if (!conectado()) { errorCarga = "config"; return; }
  try {
    const r = await sb("GET", "/rest/v1/devocionales?select=*&order=inicio.desc");
    datos = (await r.json()).map(d => ({ ...d, ruta:d.pdf, pdf:urlPdf(d.pdf) }));
  } catch(e){ errorCarga = "red"; }
}
const todos = () => datos.slice().sort((a,b) => b.inicio.localeCompare(a.inicio));

async function publicar(item, pdf){
  const ruta = `devocional-${item.inicio}.pdf`;
  /* 1) la fila (la fecha es única, evita semanas repetidas)  2) el PDF */
  await sb("POST", "/rest/v1/devocionales", { cuerpo:JSON.stringify({ ...item, pdf:ruta }),
    headers:{ "Content-Type":"application/json", Prefer:"return=minimal" } });
  try {
    await sb("POST", `/storage/v1/object/${BUCKET}/${ruta}`, { cuerpo:pdf, headers:{ "Content-Type":"application/pdf", "x-upsert":"true" } });
  } catch(e){
    try { await sb("DELETE", `/rest/v1/devocionales?inicio=eq.${item.inicio}`); } catch(_){}
    throw e;
  }
  return { ...item, ruta, pdf:urlPdf(ruta) };
}
async function eliminar(item){
  await sb("DELETE", `/rest/v1/devocionales?inicio=eq.${item.inicio}`);
  try { await sb("DELETE", `/storage/v1/object/${BUCKET}/${item.ruta}`); } catch(e){}
}

/* ---------- Lista ---------- */
function llenarAnios(elegir){
  let anios = [...new Set(todos().map(d => d.anio))].sort((a,b) => b-a);
  if (!anios.length) anios = [new Date().getFullYear()];
  const actual = elegir || Number(sel.value) || anios[0];
  sel.innerHTML = "";
  anios.forEach(a => sel.add(new Option(a, a)));
  sel.value = anios.includes(actual) ? actual : anios[0];
}
function pintar(){
  const t = norm(q.value.trim()), a = Number(sel.value);
  const items = todos().filter(d => d.anio === a && norm(d.titulo + " " + d.fecha).includes(t));
  lista.innerHTML = items.map(d => `
    <li class="tarjeta">
      <div class="miniatura"><img src="${esc(d.img)}" alt="" loading="lazy"></div>
      <div class="texto"><h2>${esc(d.titulo)}</h2><p class="fecha">${ICONO.cal}<span>${esc(d.fecha)}</span></p></div>
      <div class="acciones">
        <a class="btn leer" href="${esc(d.pdf)}" target="_blank" rel="noopener">${ICONO.ojo}Leer</a>
        <span class="sep" aria-hidden="true"></span>
        <a class="btn pdf" href="${esc(d.pdf)}" download="${esc(d.titulo)}.pdf">${ICONO.desc}Descargar PDF</a>
        <button type="button" class="borrar" data-inicio="${esc(d.inicio)}" title="Eliminar" aria-label="Eliminar ${esc(d.titulo)}">${ICONO.borrar}</button>
      </div>
    </li>`).join("");
  vacio.textContent = errorCarga === "config" ? "Falta conectar la base de datos (ver README.md)."
    : errorCarga === "red" ? "No se pudieron cargar los devocionales. Recarga la página."
    : datos.length ? "No se encontraron devocionales."
    : "Aún no hay devocionales. Pulsa «Agregar» para publicar el primero.";
  vacio.classList.toggle("on", items.length === 0);
}
function aviso(texto){
  const t = $("toast"); t.textContent = texto; t.classList.add("on");
  clearTimeout(aviso.id); aviso.id = setTimeout(() => t.classList.remove("on"), 6000);
}

/* ---------- Ventana "Agregar" ---------- */
const modal = $("modal"), form = $("form"), fDesde = $("f-desde"), fHasta = $("f-hasta"),
      fTitulo = $("f-titulo"), fPdf = $("f-pdf"), fError = $("f-error"), bGuardar = $("f-guardar");
let tituloEditado = false;

function textos(desde, hasta){
  const [y1,m1,d1] = desde.split("-").map(Number), [y2,m2,d2] = hasta.split("-").map(Number);
  const M1 = MESES[m1-1], M2 = MESES[m2-1];
  if (y1 === y2 && m1 === m2) return { titulo:`Devocionales del ${d1} al ${d2} de ${M2}`, fecha:`${d1} - ${d2} de ${M2} de ${y2}` };
  if (y1 === y2) return { titulo:`Devocionales del ${d1} de ${M1} al ${d2} de ${M2}`, fecha:`${d1} de ${M1} - ${d2} de ${M2} de ${y2}` };
  return { titulo:`Devocionales del ${d1} de ${M1} de ${y1} al ${d2} de ${M2} de ${y2}`, fecha:`${d1} de ${M1} de ${y1} - ${d2} de ${M2} de ${y2}` };
}
const diaSemana = iso => { const [y,m,d] = iso.split("-").map(Number); return new Date(Date.UTC(y,m-1,d)).getUTCDay(); };
const masSieteDias = iso => { const [y,m,d] = iso.split("-").map(Number); return new Date(Date.UTC(y,m-1,d+7)).toISOString().slice(0,10); };
const NOMBRE_DIA = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"][DIA_INICIO];

function sugerirTitulo(){
  if (tituloEditado || !fDesde.value || !fHasta.value) return;
  fTitulo.value = textos(fDesde.value, fHasta.value).titulo;
}
$("btn-agregar").addEventListener("click", () => {
  if (!conectado()) return aviso("Primero hay que conectar la base de datos (ver README.md).");
  form.reset(); fHasta.value = ""; tituloEditado = false; fError.textContent = "";
  modal.showModal();
});
$("f-cancelar").addEventListener("click", () => modal.close());
modal.addEventListener("click", e => { if (e.target === modal) modal.close(); });

fDesde.addEventListener("change", () => {
  fHasta.value = "";
  if (!fDesde.value) return;
  fError.textContent = "";
  if (diaSemana(fDesde.value) !== DIA_INICIO) {
    fDesde.value = "";
    fError.textContent = `Elige un ${NOMBRE_DIA}: los devocionales van de ${NOMBRE_DIA} a ${NOMBRE_DIA}, una sola semana.`;
    return;
  }
  fHasta.value = masSieteDias(fDesde.value);
  sugerirTitulo();
});
fTitulo.addEventListener("input", () => { tituloEditado = true; });

form.addEventListener("submit", async e => {
  e.preventDefault();
  fError.textContent = "";
  if (!fDesde.value) return fError.textContent = `Elige el ${NOMBRE_DIA} en que empieza la semana.`;
  if (diaSemana(fDesde.value) !== DIA_INICIO) return fError.textContent = `La fecha debe ser un ${NOMBRE_DIA}.`;
  fHasta.value = masSieteDias(fDesde.value);
  if (todos().some(d => d.inicio === fDesde.value)) return fError.textContent = "Ya existe un devocional para esa semana.";
  if (!fTitulo.value.trim()) return fError.textContent = "Escribe el título.";
  const pdf = fPdf.files[0];
  if (!pdf) return fError.textContent = "Selecciona el archivo PDF.";
  if (pdf.type !== "application/pdf" && !/\.pdf$/i.test(pdf.name)) return fError.textContent = "El archivo debe ser un PDF.";
  if (pdf.size > 25 * 1024 * 1024) return fError.textContent = "El PDF pesa más de 25 MB. Reduce su tamaño.";
  const { fecha } = textos(fDesde.value, fHasta.value);
  const item = { titulo: fTitulo.value.trim(), fecha, inicio: fDesde.value, anio: Number(fDesde.value.slice(0,4)),
    img: IMAGENES[Math.floor(Date.parse(fDesde.value) / 604800000) % IMAGENES.length] };
  bGuardar.disabled = true; bGuardar.textContent = "Publicando…";
  try { datos.push(await publicar(item, pdf)); }
  catch(err){ fError.textContent = mensajeError(err); bGuardar.disabled = false; bGuardar.textContent = "Guardar"; return; }
  bGuardar.disabled = false; bGuardar.textContent = "Guardar";
  errorCarga = ""; modal.close(); q.value = "";
  llenarAnios(item.anio); pintar();
  aviso("Devocional publicado.");
});

lista.addEventListener("click", async e => {
  const b = e.target.closest(".borrar");
  if (!b) return;
  const item = datos.find(d => d.inicio === b.dataset.inicio);
  if (!item || !confirm(`¿Eliminar "${item.titulo}"? Esta acción no se puede deshacer.`)) return;
  b.disabled = true;
  try { await eliminar(item); }
  catch(err){ b.disabled = false; return aviso(mensajeError(err)); }
  datos = datos.filter(d => d.inicio !== item.inicio);
  llenarAnios(); pintar();
  aviso("Devocional eliminado.");
});

q.addEventListener("input", pintar);
sel.addEventListener("change", pintar);
(async () => { await cargarDatos(); llenarAnios(); pintar(); })();
