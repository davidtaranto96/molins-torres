#!/usr/bin/env node
/**
 * Convierte el `.dc.html` de Claude Design en un sitio estático de verdad.
 *
 * POR QUÉ EXISTE: lo que exporta Claude Design NO es una página. Carga
 * `support.js`, que trae React desde unpkg y recién ahí dibuja; sin eso queda
 * en blanco. Y usa `style-hover` / `style-focus`, que son atributos de su
 * runtime y no existen en HTML.
 *
 * Acá se hace lo mecánico y verificable. Lo que NO hace este script —la lógica
 * de las unidades, el simulador, el formulario— se escribe a mano en
 * `src/app.js`, porque traducir 93 bindings a ciegas es cómo se cuelan los
 * errores.
 *
 * Es un script y no un cambio a mano para que se pueda volver a correr el día
 * que Claude Design regenere el diseño.
 *
 * Uso: node scripts/transpilar.mjs
 */
import { readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Los dos sitios que salen del mismo editor. Se elige con el primer argumento:
//   node scripts/transpilar.mjs torre
//   node scripts/transpilar.mjs portal
const OBRAS = {
  torre: {
    raiz: join(dirname(fileURLToPath(import.meta.url)), ".."),
    entrada: ["Rediseño con datos pendientes", "Edificio La Torre.dc.html"],
    tokens: {
      "#9C3A20": "--terracota", "#7C2D17": "--terracota-oscuro", "#FBF9F6": "--hueso",
      "#F3EADA": "--crema", "#F6EFE3": "--crema-claro", "#29211A": "--tinta",
      "#211711": "--tinta-oscura", "#4A4038": "--tinta-suave", "#6F6357": "--gris-calido",
      "#8B8177": "--gris-claro", "#2F6B4E": "--estado-libre", "#A0762C": "--estado-reservada",
      "#128C7E": "--whatsapp", "#7A5A20": "--ambar-texto",
    },
    corregidos: { "#A0762C": "#8A6420", "#8B8177": "#757068", "#7A5A20": "#6E5119", "#128C7E": "#0F7A6D" },
    // Medido sobre el sitio armado: la crema translúcida sobre la terracota
    // se quedaba corta. .65 daba 4.24 y .82 daba 4.43, contra el 4.5 que pide
    // el texto normal. Subirlas unos puntos alcanza y no se nota.
    reemplazos: [
      ["color:rgba(243,234,218,0.65)", "color:rgba(243,234,218,0.75)",
       "la crema al 65% sobre la terracota sube a 75%: daba 4.24 y hace falta 4.5"],
      ["color:rgba(243,234,218,0.82)", "color:rgba(243,234,218,0.86)",
       "la crema al 82% sobre la terracota sube a 86%: daba 4.43"],
    ],
    hero: true,
  },
  portal: {
    raiz: "/Users/dt/Documents/DT-System/crm-molins/portal",
    entrada: ["..", "Rediseño Molins Negocios-2", "Portal Molins.dc.html"],
    // La medición del portal en vivo, movida tal cual. Va antes de app.js
    // porque app.js le pega a window.CK / VISITAS / registrarClic.
    previos: ["src/medicion.js"],
    // SEO y configuración: el <helmet> del editor no los trae y sin ellos el
    // portal pierde título, compartir en redes, canónica y la clave del sitio.
    cabezaExtra: "cabeza-portal.html",
    // Tokens que no salen del HTML porque los usa la lógica de app.js.
    cssExtra: [
      "/* Ajustes de contraste medidos sobre el sitio armado, no a ojo. */",
      "",
      "/* El verde `--ok` (#1E8A50) con blanco da 4.37 y el badge es texto chico:",
      "   hace falta 4.5. Éste da 4.71 y a ojo es el mismo verde. */",
      ":root{--ok-fuerte:#1D844D}",
      "",
      "/* `--gris` daba 4.38 sobre `--hueso-4` (#F3F4EE), la superficie más",
      "   oscura donde se lo usa — cuatro párrafos del recorrido de firmas. Con",
      "   este otro da 4.62 y sobre blanco queda igual de sobrio. */",
      ":root{--gris:#63716C}",
      "",
      "/* Los numerales 1-4 del recorrido: `--borde-2` daba 1.44 y son el orden",
      "   de los pasos, no adorno. Éste da 3.14, que es el mínimo para texto",
      "   grande, y los deja igual de discretos. */",
      ":root{--numeral:#878B82}",
    ].join("\n"),
    reemplazos: [
      // El naranja de marca (#F66503) con texto blanco da 3.10:1 y hace falta
      // 4.5 — es texto normal, no grande. Antes que apagar el naranja a un
      // marrón (blanco sobre #B34A02 daría 5.39) se cambia el TEXTO a verde
      // noche: 4.85:1, y el acento de la marca queda intacto. Son 6 botones.
      ["background:var(--naranja);color:#fff", "background:var(--naranja);color:var(--verde-noche)",
       "los 6 botones naranjas pasan a texto verde noche: blanco sobre #F66503 daba 3.10 y hace falta 4.5"],
      // El cartelito "fotos en la consulta" sobre el rayado: --gris sobre
      // --crema da 4.31 y es texto de 12px. --tinta-suave lo lleva a 8.6.
      ["font-family:monospace;font-size:12px;color:var(--gris)", "font-family:monospace;font-size:12px;color:var(--tinta-suave)",
       "el cartel «fotos en la consulta» pasa a --tinta-suave: con --gris daba 4.31 sobre el rayado"],
      // El numeral del recorrido: era un tono de borde, no de texto.
      ["color:var(--borde-2);line-height:1", "color:var(--numeral);line-height:1",
       "los numerales 1-4 del recorrido pasan a --numeral: con --borde-2 daban 1.44 y hace falta 3"],
      // El botón verde de WhatsApp CON TEXTO: blanco sobre #25D366 da 1.98.
      // Los redondos que sólo llevan el ícono quedan como están, porque el
      // blanco sobre verde es la forma en que se reconoce a WhatsApp.
      ["background:var(--whatsapp);color:#fff;font-weight:600", "background:var(--whatsapp);color:var(--verde-noche);font-weight:600",
       "el botón «Consultar por Aires» pasa a texto verde noche: blanco sobre el verde de WhatsApp daba 1.98"],
      // La píldora del código sobre la foto.
      ["color:rgba(255,255,255,.85);background:rgba(9,30,31,.62)", "color:#fff;background:rgba(9,30,31,.72)",
       "la píldora del código va a blanco pleno y fondo más opaco: daba 4.33"],
      // El separador «·» de la barra superior, sobre el verde: .35 da 2.86.
      ["color:rgba(255,255,255,.35)", "color:rgba(255,255,255,.55)",
       "el separador de la barra superior sube a .55 de blanco: con .35 daba 2.86"],
      // El logo de Grupo LPZ, que el rediseño resolvió con un cartelito de
      // texto. La marca es de un solo color y verde oscuro: sobre el pie —que
      // es verde— desaparece, así que va invertida a blanco. Al ser plana, la
      // inversión le respeta la forma exacta.
      ['<span style="border:1px solid rgba(255,255,255,.28);border-radius:7px;padding:4px 10px;font-size:10.5px;font-weight:700;letter-spacing:.12em;color:rgba(255,255,255,.75)">GRUPO LPZ</span>', '<img loading="lazy" src="img/logo-lpz.png" alt="Grupo LPZ — CUCIS 251" style="height:44px;width:auto;opacity:.85;filter:brightness(0) invert(1)" />',
       "el cartelito de texto «GRUPO LPZ» del pie pasa a ser el logo de verdad, invertido a blanco"],
      ["torres/img/fachada-balcarce.jpg", "torres/img/hero-cover.jpg",
       "La Torre: cambié la elevación técnica —tiene las cotas 15.00 y 2.5000 dibujadas encima— por el render de fachada"],
    ],
    agregados: [
      ['<button onClick="{{ enviarConsulta }}"', '<div aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden"><label>Empresa<input id="fEmpresa" type="text" tabindex="-1" autocomplete="off" /></label></div>\n          '],
      ['<button onClick="{{ cerrarFicha }}"', '<button onClick="{{ compartirFicha }}" aria-label="Compartir la ficha" style="position:absolute;top:12px;right:60px;z-index:6;width:40px;height:40px;border-radius:50%;border:none;background:rgba(255,255,255,.92);color:#16211F;cursor:pointer;display:grid;place-items:center;box-shadow:0 1px 2px rgba(17,60,61,.1),0 4px 14px rgba(17,60,61,.15)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg></button>\n      '],
    ],
    // La paleta sale del logo real: el grifo naranja sobre verde oscuro. Es la
    // marca de verdad, no el navy que el portal heredó del CRM.
    tokens: {
      "#113C3D": "--verde", "#175052": "--verde-claro", "#16211F": "--tinta",
      "#3E4F4D": "--tinta-suave", "#66756F": "--gris", "#F66503": "--naranja",
      "#FAF9F5": "--hueso", "#EFF2EC": "--crema", "#E3E6DF": "--borde",
      "#DDE1D8": "--borde-fuerte",
      // Los que faltaban del sistema: variantes del naranja de marca, verdes de
      // fondo y bordes. Sin esto, cambiar la identidad dejaba 46 colores viejos.
      "#B34A02": "--naranja-oscuro", "#F5A56B": "--naranja-claro",
      "#FDEFE3": "--naranja-suave", "#FFC59B": "--naranja-palido",
      "#F8D8BC": "--naranja-borde",
      "#EDF3F1": "--verde-suave", "#F5F8F6": "--verde-palido",
      "#155150": "--verde-medio", "#12403F": "--verde-hondo",
      "#F7F8F4": "--hueso-2", "#F5F6F1": "--hueso-3", "#F3F4EE": "--hueso-4",
      "#E7EAE1": "--borde-suave",
      "#25D366": "--whatsapp",
      // Los últimos ocho: verdes de estado, bordes y un verde muy oscuro.
      "#0C2B2C": "--verde-noche", "#1E8A50": "--ok", "#4ADE80": "--ok-claro",
      "#E4F2EA": "--ok-suave", "#C9CFC2": "--borde-2", "#DCE0D6": "--borde-3",
      "#DCE5E2": "--borde-4", "#EDEEE7": "--borde-5",
    },
    corregidos: {},
    hero: false,
  },
};

const aca = dirname(fileURLToPath(import.meta.url));
const cual = process.argv[2] || "torre";
const OBRA = OBRAS[cual];
if (!OBRA) throw new Error(`No conozco "${cual}". Opciones: ${Object.keys(OBRAS).join(", ")}`);

const raiz = OBRA.raiz;
const ENTRADA = join(raiz, ...OBRA.entrada);

/**
 * Los colores del brochure, con nombre.
 *
 * El diseño trae 193 colores escritos a mano y ninguna variable — justo lo que
 * el brief pedía evitar, porque el día que llegue la marca de Berni hay que
 * cambiarlos uno por uno. Acá se convierten en tokens: cambiar la identidad
 * pasa a ser editar este bloque.
 */
/**
 * El valor de cada token puede diferir del color que trae el diseño: la clave
 * es el color a BUSCAR, el valor es el que se EMITE.
 *
 * Dos se corrigieron porque no pasaban contraste sobre fondo claro, medido:
 * el ámbar de «Reservada» daba 4,10 y el gris de las etiquetas 3,82, contra el
 * mínimo de 4,5 que pide WCAG AA para texto chico.
 */
const CORREGIDOS = OBRA.corregidos;

const TOKENS = OBRA.tokens;

let html = readFileSync(ENTRADA, "utf8");
const informe = [];

// ── 1 · el <helmet> pasa a ser el <head> de verdad ──────────────────────────
const helmet = html.match(/<helmet>([\s\S]*?)<\/helmet>/);
if (!helmet) throw new Error("No encontré el <helmet>");
let cabeza = helmet[1];

// image-slot.js es el andamiaje del editor: define <image-slot>, un hueco donde
// se arrastran imágenes DESDE el editor. Fuera de él sólo dibuja una caja gris
// que dice "Drop an image" y no hay forma de llenarla.
cabeza = cabeza.replace(/\s*<script src="image-slot\.js"><\/script>/, "");
informe.push("saqué image-slot.js de la cabecera");
// El <style> del helmet también trae colores de marca escritos a mano —el fondo
// y el color de texto del body—. Si no se tokenizan, cambiar la identidad deja
// el cuerpo del color viejo. Se tokeniza más abajo, junto con el resto.

// ── 2 · el cuerpo, sin el envoltorio del editor ─────────────────────────────
let cuerpo = html.slice(html.indexOf("</helmet>") + "</helmet>".length);
cuerpo = cuerpo.slice(0, cuerpo.indexOf("</x-dc>"));

// ── 3 · style-hover / style-focus → CSS de verdad ───────────────────────────
// Son atributos del runtime de Claude Design. En HTML no hacen nada, así que
// sin esto el sitio queda sin ningún hover.
const reglas = new Map();
let n = 0;
cuerpo = cuerpo.replace(/\s*style-(hover|focus)="([^"]+)"/g, (_, cual, decls) => {
  const llave = cual + "|" + decls;
  if (!reglas.has(llave)) reglas.set(llave, "fx-" + (++n));
  const clase = reglas.get(llave);
  return ` data-fx="${clase}"`;
});
// juntar los data-fx repetidos del mismo elemento
cuerpo = cuerpo.replace(/(data-fx="[^"]+")((?:\s+data-fx="[^"]+")+)/g, (m) => {
  const todas = [...m.matchAll(/data-fx="([^"]+)"/g)].map((x) => x[1]);
  return `data-fx="${todas.join(" ")}"`;
});
// Los hover también pasan por tokens: si no, el día que cambie la marca el
// color de reposo cambiaría y el de hover se quedaría con el viejo.
const tokenizar = (s) => {
  let out = s;
  for (const [hex, token] of Object.entries(TOKENS)) out = out.replace(new RegExp(hex, "gi"), `var(${token})`);
  return out;
};

const css = [...reglas.entries()]
  .map(([llave, clase]) => {
    const [cual, decls] = llave.split("|");
    const sel = cual === "hover" ? ":hover" : ":focus-visible";
    return `[data-fx~="${clase}"]${sel}{${tokenizar(decls).replace(/;?$/, ";")}}`;
  })
  .join("\n");
informe.push(`convertí ${reglas.size} reglas de style-hover/focus a CSS`);

// ── 4 · los colores, a tokens ───────────────────────────────────────────────
let cambiados = 0;
for (const [hex, token] of Object.entries(TOKENS)) {
  const re = new RegExp(hex.replace("#", "#"), "gi");
  const antes = cuerpo;
  cuerpo = cuerpo.replace(re, `var(${token})`);
  if (cuerpo !== antes) cambiados += (antes.match(re) || []).length;
}
informe.push(`${cambiados} colores literales pasados a tokens`);

// La cabecera pasa por los mismos tokens que el cuerpo.
for (const [hex, token] of Object.entries(TOKENS)) {
  cabeza = cabeza.replace(new RegExp(hex, "gi"), `var(${token})`);
}

const raizCss =
  ":root{\n" +
  Object.entries(TOKENS)
    .map(([hex, token]) => {
      const valor = CORREGIDOS[hex] || hex;
      const nota = CORREGIDOS[hex] ? `  /* corregido por contraste, venía ${hex} */` : "";
      return `  ${token}: ${valor};${nota}`;
    })
    .join("\n") +
  "\n}";

// ── 5 · sacar lo que no se puede sostener ───────────────────────────────────
// Nada de esto tiene respaldo en ningún documento del proyecto, y el brief
// pedía explícitamente no publicar plazos que no se puedan sostener.

// 5a · las cuatro etapas de obra: inventadas, incluida "Prevista para 2027".
const etapas = cuerpo.match(
  /<div style="display:grid;grid-template-columns:repeat\(auto-fit,minmax\(210px,1fr\)\);gap:14px;margin-top:32px">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/
);
if (etapas) {
  cuerpo = cuerpo.replace(etapas[0], "");
  informe.push("saqué las 4 etapas de obra inventadas (incluido «Prevista para 2027»)");
}

// 5b · los tres <image-slot> vacíos. En producción son cajas grises que dicen
// "Drop an image" y no hay forma de llenarlas. Se reemplazan por los renders
// que el diseño dejó sin usar, ROTULADOS COMO RENDERS: son del brochure, no
// fotos de obra, y decir lo contrario sería inventar avance.
//
// OJO, 2/9: `fachada-balcarce.jpg` SALIÓ de esta lista. Francisco avisó que le
// dijeron que no es este edificio, y se verifica solo: la lámina tiene ocho
// plantas sobre planta baja y llega a +28,50 m, con balcones de vidrio y un
// núcleo vidriado al centro; el proyecto vende "12 unidades · 6 plantas por
// torre" y el render de portada es otra cosa —ladrillo visto, parasoles y seis
// niveles—. La imagen sigue en `img/` por si Francisco confirma lo contrario.
// Si vuelve, vuelve acá y en index.html.
const RENDERS = [
  ["render-ascenso.jpg", "El edificio desde Aniceto Latorre"],
  ["render-nocturno.jpg", "Vista nocturna del frente"],
];
let i = 0;
cuerpo = cuerpo.replace(
  /<div style="height:210px"><image-slot[^>]*><\/image-slot><\/div>/g,
  () => {
    // Sin render que poner, la caja se va entera: repetir el primero llenaría
    // el avance de obra con la misma imagen dos veces.
    const par = RENDERS[i++];
    if (!par) return "";
    const [img, alt] = par;
    return `<div style="aspect-ratio:16/9"><img src="img/${img}" alt="${alt}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block"></div>`;
  }
);
// y los pies dejan de prometer una fecha que no existe
cuerpo = cuerpo
  .replace(/Fundaciones — fecha a publicar con la certificación/, "Render del proyecto — no es una foto de obra")
  .replace(/Estructura — fecha a publicar con la certificación/, "Render del proyecto — no es una foto de obra")
  .replace(/Frente sobre Aniceto Latorre — fecha a publicar/, "Render del proyecto — no es una foto de obra");
informe.push(`reemplacé ${i} cajas vacías por renders, rotulados como renders`);

// 5c · una página del brochure publicada como si fuera un mapa
cuerpo = cuerpo.replace(
  'alt="Mapa de ubicación del Edificio La Torre en Salta Capital"',
  'alt="El edificio y su entorno, sobre Balcarce y Aniceto Latorre"'
);
informe.push("corregí el alt del falso mapa");

// 5d · las imágenes pesan 16 MB y ninguna difería la carga
const antesLazy = (cuerpo.match(/loading="lazy"/g) || []).length;
cuerpo = cuerpo.replace(/<img (?![^>]*loading=)/g, '<img loading="lazy" ');
// menos la del hero, que es lo primero que se ve
cuerpo = cuerpo.replace('<img loading="lazy" src="uploads/hero-cover.jpg"', '<img src="uploads/hero-cover.jpg"');
informe.push(`difiero la carga de ${(cuerpo.match(/loading="lazy"/g) || []).length - antesLazy} imágenes (menos la del hero)`);

// 5e · las imágenes viven en img/ en el repo, no en uploads/
cuerpo = cuerpo.replace(/uploads\//g, "img/");
informe.push("repunté las imágenes de uploads/ a img/");

// ── 5f · el hero: tres marcas compitiendo ───────────────────────────────────
// El logotipo real de La Torre está QUEMADO adentro de hero-cover.jpg (LA/TO/RRE
// apilado). Encima, el diseño superpone el <h1> y el header sticky repite
// "LA TORRE". Se leen las tres a la vez y ninguna gana — sobre todo en celular,
// donde el título cae justo encima del logotipo.
//
// La imagen se corre hacia arriba para que el logotipo quede en el tercio
// superior, lejos del título, y el degradado de abajo se refuerza para que el
// texto apoye sobre un fondo parejo en vez de sobre las letras del render.
// El encuadre se corre para que el logotipo quede arriba —donde funciona como
// marca— y el título apoye abajo, sobre el degradado, sin pisarlo.
//
// Se probó usar `fachada-balcarce.jpg` en celular, que no tiene logotipo
// quemado, y NO sirve: es un plano de fachada con acotaciones (28.50, 2.5000)
// quemadas en el pixel. Es material técnico, no de venta.
//
// El ajuste fino por tamaño va en `src/estilos.css` con una clase, porque un
// `style` inline no admite media queries.
if (OBRA.hero) {
  cuerpo = cuerpo.replace('<img src="img/hero-cover.jpg"', '<img class="hero-img" src="img/hero-cover.jpg"');
}
cuerpo = cuerpo.replace(
  'object-fit:cover;object-position:center 42%',
  "object-fit:cover;object-position:center 30%"
);
cuerpo = cuerpo.replace(
  "linear-gradient(180deg,rgba(18,12,9,0.2) 0%,rgba(18,12,9,0) 32%,rgba(18,12,9,0.84) 100%)",
  "linear-gradient(180deg,rgba(18,12,9,0.34) 0%,rgba(18,12,9,0.06) 30%,rgba(18,12,9,0.72) 62%,rgba(18,12,9,0.94) 100%)"
);
informe.push("hero: corrí la imagen y reforcé el degradado para que el título no pelee con el logotipo quemado");


// ── 5.5 · lo que el rediseño no trae y el portal en vivo sí tenía ───────────
// Van como marcación de verdad y no inyectadas por JS a propósito: el campo
// trampa sirve justamente contra bots que leen el HTML sin ejecutar scripts.
for (const [busca, pone] of OBRA.agregados || []) {
  if (!cuerpo.includes(busca)) throw new Error(`no encontré el ancla para agregar: ${busca.slice(0, 60)}…`);
  cuerpo = cuerpo.replace(busca, pone + busca);
}
if ((OBRA.agregados || []).length) informe.push(`${OBRA.agregados.length} bloques repuestos del portal en vivo (campo trampa, compartir)`);


// ── 5.6 · cambios de material que el rediseño eligió mal ───────────────────
for (const [de, a, porque] of OBRA.reemplazos || []) {
  if (!cuerpo.includes(de)) throw new Error(`no encontré qué reemplazar: ${de}`);
  cuerpo = cuerpo.split(de).join(a);
  informe.push(porque);
}

// ── 6 · las directivas del editor, a atributos de datos ─────────────────────
// `sc-for` y `sc-if` sólo existen adentro del runtime de Claude Design. Se
// convierten en marcas que `src/app.js` sabe llenar con JS plano — sin ningún
// framework, que es la regla de la casa para una web estática.

// Las pistas del editor (`hint-placeholder-*`) no significan nada fuera de
// Claude Design y encima traen `{{ }}` adentro, así que ensucian los pasos de
// abajo. Se van primero.
cuerpo = cuerpo.replace(/\s+hint-placeholder-[a-z]+="[^"]*"/g, "");

// POR QUÉ LA PLANTILLA ES SU PROPIA ANCLA, 2026-08-29: la primera versión
// emitía `<div data-lista>` como contenedor y metía las filas adentro. Dos
// cosas se rompían con eso, y ninguna daba error:
//   · Un `<div>` adentro de un `<select>` lo tira el parser de HTML —no es
//     contenido válido ahí—, así que los `<option>` de Tipo y Zona nunca
//     aparecían.
//   · El contenedor agrega un nivel de DOM que el CSS no espera. Las tarjetas
//     cuelgan de un `display:grid` cuyas columnas son para los hijos directos:
//     con el envase en el medio, las 35 propiedades entraban en UNA celda.
// `<sc-for>` en el editor rinde como fragmento, sin nodo propio. Anclar en el
// <template> —que sí es válido adentro de un select— y escribir las filas como
// hermanas anteriores reproduce esa semántica tal cual.
// Las listas: el contenido de adentro es la plantilla de cada fila y se guarda
// en un <template> para que el navegador no lo dibuje hasta que JS lo use.
//
// POR QUÉ EL BUCLE, 2026-08-29: con un solo `replace` global, un `sc-for`
// adentro de otro se transpilaba mal — el `</sc-for>` del de adentro cerraba
// el match del de afuera, y quedaba markup roto y una directiva sin convertir.
// El portal de Molins tiene tres casos así (las specs adentro de la tarjeta,
// la foto adentro de la similar). La regex de acá exige que el cuerpo NO
// contenga otra apertura del mismo tag, así que sólo caza el más interno, y
// el bucle va deshojando de adentro hacia afuera.
let listas = 0;
const RE_FOR = /<sc-for\s+list="\{\{\s*([\w.]+)\s*\}\}"\s+as="(\w+)"[^>]*>((?:(?!<sc-for\b)[\s\S])*?)<\/sc-for>/;
while (RE_FOR.test(cuerpo)) {
  cuerpo = cuerpo.replace(RE_FOR, (_, lista, alias, plantilla) => {
    listas++;
    return `<template data-lista="${lista}" data-alias="${alias}">${plantilla}</template>`;
  });
}
informe.push(`${listas} listas (sc-for) convertidas a data-lista + <template>`);

// Los condicionales: quedan en el HTML pero ocultos, y JS los muestra. Mismo
// bucle de adentro hacia afuera, por lo mismo.
let condicionales = 0;
const RE_IF = /<sc-if\s+value="\{\{\s*([\w.]+)\s*\}\}"[^>]*>((?:(?!<sc-if\b)[\s\S])*?)<\/sc-if>/;
while (RE_IF.test(cuerpo)) {
  cuerpo = cuerpo.replace(RE_IF, (_, cond, dentro) => {
    condicionales++;
    return `<div data-si="${cond}" hidden>${dentro}</div>`;
  });
}
informe.push(`${condicionales} condicionales (sc-if) convertidos a data-si`);

// Si sobrevivió alguna directiva, el resto de los pasos la va a destrozar en
// silencio (el `value=` de un sc-if lo agarra la regla de los inputs). Mejor
// frenar acá y que se vea.
const restos = cuerpo.match(/<sc-[a-z]+/g);
if (restos) throw new Error(`quedaron ${restos.length} directivas sin convertir: ${[...new Set(restos)].join(", ")}`);

// Los manejadores y los estilos calculados: `onClick="{{ x }}"` y
// `style="{{ x }}"` pasan a atributos de datos que app.js engancha por
// delegación, en vez de HTML con JavaScript adentro.
cuerpo = cuerpo.replace(/onClick="\{\{\s*([^}]+?)\s*\}\}"/g, 'data-click="$1"');
cuerpo = cuerpo.replace(/onInput="\{\{\s*([^}]+?)\s*\}\}"/g, 'data-input="$1"');
cuerpo = cuerpo.replace(/onChange="\{\{\s*([^}]+?)\s*\}\}"/g, 'data-change="$1"');
cuerpo = cuerpo.replace(/onSubmit="\{\{\s*([^}]+?)\s*\}\}"/g, 'data-submit="$1"');
cuerpo = cuerpo.replace(/style="\{\{\s*([^}]+?)\s*\}\}"/g, 'data-estilo="$1"');
cuerpo = cuerpo.replace(/value="\{\{\s*([^}]+?)\s*\}\}"/g, 'data-valor="$1"');
cuerpo = cuerpo.replace(/href="\{\{\s*([^}]+?)\s*\}\}"/g, 'data-href="$1"');
cuerpo = cuerpo.replace(/src="\{\{\s*([^}]+?)\s*\}\}"/g, 'data-src="$1"');
informe.push("manejadores y estilos calculados pasados a atributos de datos");

// Lo que queda de `{{ }}` ADENTRO de un atributo hay que sacarlo antes que el
// paso de texto, porque ese paso mete un `<span>` y un span adentro de un
// atributo no es HTML: el navegador lo lee como texto literal y el `alt` de la
// foto termina diciendo "<span data-txt=...>". Dos formas:
//   · el atributo es una sola expresión  → data-attr-NOMBRE="expr"
//   · el atributo mezcla texto y expresión → data-tpl-NOMBRE="texto {expr}"
let attrs = 0;
cuerpo = cuerpo.replace(/\s([a-zA-Z][\w-]*)="\{\{\s*([^}"]+?)\s*\}\}"/g, (_, nombre, expr) => {
  attrs++;
  return ` data-attr-${nombre}="${expr}"`;
});
let plantillados = 0;
cuerpo = cuerpo.replace(/\s([a-zA-Z][\w-]*)="([^"]*\{\{[^"]*\}\}[^"]*)"/g, (_, nombre, valor) => {
  plantillados++;
  return ` data-tpl-${nombre}="${valor.replace(/\{\{\s*([^}]+?)\s*\}\}/g, "{$1}")}"`;
});
informe.push(`${attrs} atributos calculados y ${plantillados} atributos con plantilla`);

// Lo que queda de `{{ x }}` es texto: pasa a un <span data-txt> que app.js
// llena. Se envuelve en span y no se reemplaza el nodo entero para no perder
// el estilo del elemento que lo contiene.
const sueltos = [...new Set([...cuerpo.matchAll(/\{\{\s*([^}]+?)\s*\}\}/g)].map((m) => m[1]))];
cuerpo = cuerpo.replace(/\{\{\s*([^}]+?)\s*\}\}/g, '<span data-txt="$1"></span>');
writeFileSync(join(raiz, "build", "bindings.txt"), sueltos.sort().join("\n"));
informe.push(`${sueltos.length} bindings de texto convertidos a data-txt`);

writeFileSync(join(raiz, "build", "cuerpo.html"), cuerpo.trim());
writeFileSync(join(raiz, "build", "cabeza.html"), cabeza.trim());
writeFileSync(join(raiz, "build", "tokens.css"), raizCss + "\n\n" + css);

// ── 7 · armar el index.html final ───────────────────────────────────────────
const salida = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
${cabeza}
${OBRA.cabezaExtra ? readFileSync(join(aca, OBRA.cabezaExtra), "utf8").trim() : ""}
<link rel="stylesheet" href="src/estilos.css">
</head>
<body>
${cuerpo}
<script src="src/pintor.js"></script>
${(OBRA.previos || []).map((f) => `<script src="${f}"></script>`).join("\n")}
<script src="src/app.js"></script>
</body>
</html>
`;
writeFileSync(join(raiz, "index.html"), salida);
const heroCss = !OBRA.hero ? "" : `
/* El logotipo de La Torre está quemado adentro del render de portada. En
   pantalla angosta la imagen se recorta al centro y ese logotipo cae justo
   detrás del título. Subiendo el encuadre queda arriba, se lee como marca, y
   el título apoya limpio sobre el degradado. */
@media (max-width: 640px) {
  /* OJO CON EL EJE: la imagen es 16:9 y la caja del hero en celular es
     vertical, así que object-fit cover la recorta a lo ANCHO, no a lo alto. Mover el eje
     Y no hace nada — hay que correr la X. Con 22 % se ve el cuerpo del edificio
     y el logotipo queda fuera del recorte, así que el título se lee limpio. */
  .hero-img { object-position: 22% center !important; }
}
`;
writeFileSync(
  join(raiz, "src", "estilos.css"),
  raizCss + "\n\n/* `sc-if` en el editor NO crea un nodo: rinde como fragmento. El envase que\n   emite el transpilador sí lo crea, y eso rompe todo layout donde los hijos\n   tenían que ser hermanos — en el encabezado, la navegación y el botón\n   quedaban adentro de UN solo item de flex. `display:contents` borra la caja\n   y deja pasar a los hijos, que es exactamente lo que hacía el fragmento.\n   El !important del hidden le gana, así que ocultar sigue funcionando. */\n[data-si]{display:contents}\n[hidden]{display:none !important}\n\n/* Los hover y foco que el editor guardaba en atributos propios. */\n" + css + "\n" + heroCss + "\n" + (OBRA.cssExtra || "")
);
copyFileSync(join(aca, "pintor.js"), join(raiz, "src", "pintor.js"));
informe.push("escribí index.html, src/estilos.css y src/pintor.js");

console.log("── transpilación mecánica ──");
for (const l of informe) console.log("  ·", l);
console.log("\nSalida en build/. Falta la lógica a mano (src/app.js).");
