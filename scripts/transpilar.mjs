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
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENTRADA = join(raiz, "Rediseño con datos pendientes", "Edificio La Torre.dc.html");

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
const CORREGIDOS = {
  "#A0762C": "#8A6420", // 4,10 → 5,35
  "#8B8177": "#757068", // 3,82 → 4,91
  "#7A5A20": "#6E5119", // el mismo ámbar, en su variante de texto
  // El verde de WhatsApp con letras blancas daba 4,14. Es el más chico que se
  // aleja de la marca lo mínimo y pasa: 5,22.
  "#128C7E": "#0F7A6D",
};

const TOKENS = {
  "#9C3A20": "--terracota",
  "#7C2D17": "--terracota-oscuro",
  "#FBF9F6": "--hueso",
  "#F3EADA": "--crema",
  "#F6EFE3": "--crema-claro",
  "#29211A": "--tinta",
  "#211711": "--tinta-oscura",
  "#4A4038": "--tinta-suave",
  "#6F6357": "--gris-calido",
  "#8B8177": "--gris-claro",
  "#2F6B4E": "--estado-libre",
  "#A0762C": "--estado-reservada",
  "#128C7E": "--whatsapp",
  "#7A5A20": "--ambar-texto",
};

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
const RENDERS = [
  ["render-ascenso.jpg", "El edificio desde Aniceto Latorre"],
  ["render-nocturno.jpg", "Vista nocturna del frente"],
  ["fachada-balcarce.jpg", "Fachada sobre Balcarce"],
];
let i = 0;
cuerpo = cuerpo.replace(
  /<div style="height:210px"><image-slot[^>]*><\/image-slot><\/div>/g,
  () => {
    const [img, alt] = RENDERS[i++] ?? RENDERS[0];
    return `<div style="height:210px"><img src="img/${img}" alt="${alt}" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block"></div>`;
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
cuerpo = cuerpo.replace(
  '<img src="img/hero-cover.jpg"',
  '<img class="hero-img" src="img/hero-cover.jpg"'
);
cuerpo = cuerpo.replace(
  'object-fit:cover;object-position:center 42%',
  "object-fit:cover;object-position:center 30%"
);
cuerpo = cuerpo.replace(
  "linear-gradient(180deg,rgba(18,12,9,0.2) 0%,rgba(18,12,9,0) 32%,rgba(18,12,9,0.84) 100%)",
  "linear-gradient(180deg,rgba(18,12,9,0.34) 0%,rgba(18,12,9,0.06) 30%,rgba(18,12,9,0.72) 62%,rgba(18,12,9,0.94) 100%)"
);
informe.push("hero: corrí la imagen y reforcé el degradado para que el título no pelee con el logotipo quemado");

// ── 6 · las directivas del editor, a atributos de datos ─────────────────────
// `sc-for` y `sc-if` sólo existen adentro del runtime de Claude Design. Se
// convierten en marcas que `src/app.js` sabe llenar con JS plano — sin ningún
// framework, que es la regla de la casa para una web estática.

// Las listas: el contenido de adentro es la plantilla de cada fila y se guarda
// en un <template> para que el navegador no lo dibuje hasta que JS lo use.
let listas = 0;
cuerpo = cuerpo.replace(
  /<sc-for list="\{\{ ([a-zA-Z.]+) \}\}" as="([a-z]+)"[^>]*>([\s\S]*?)<\/sc-for>/g,
  (_, lista, alias, plantilla) => {
    listas++;
    return `<div data-lista="${lista}"></div>\n<template data-plantilla="${lista}" data-alias="${alias}">${plantilla}</template>`;
  }
);
informe.push(`${listas} listas (sc-for) convertidas a data-lista + <template>`);

// Los condicionales: quedan en el HTML pero ocultos, y JS los muestra.
let condicionales = 0;
cuerpo = cuerpo.replace(
  /<sc-if value="\{\{ ([a-zA-Z.]+) \}\}"[^>]*>([\s\S]*?)<\/sc-if>/g,
  (_, cond, dentro) => {
    condicionales++;
    return `<div data-si="${cond}" hidden>${dentro}</div>`;
  }
);
informe.push(`${condicionales} condicionales (sc-if) convertidos a data-si`);

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
<link rel="stylesheet" href="src/estilos.css">
</head>
<body>
${cuerpo}
<script src="src/app.js"></script>
</body>
</html>
`;
writeFileSync(join(raiz, "index.html"), salida);
const heroCss = `
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
  raizCss + "\n\n/* Los hover y foco que el editor guardaba en atributos propios. */\n" + css + "\n" + heroCss
);
informe.push("escribí index.html y src/estilos.css");

console.log("── transpilación mecánica ──");
for (const l of informe) console.log("  ·", l);
console.log("\nSalida en build/. Falta la lógica a mano (src/app.js).");
