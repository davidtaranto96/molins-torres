# Prompt para Codex — mejorar el render 3D de La Torre

> Copiar desde la línea de abajo hasta el final. Se pega en Codex (CLI o app) abierto en
> la carpeta `molins-torres`. Antes de correrlo: `git status` limpio y una rama nueva
> (`git checkout -b render-codex`), así lo que haga se revisa antes de mezclar.

---

Sos un desarrollador de three.js trabajando en el sitio del Edificio La Torre, un
emprendimiento de 12 departamentos en Salta, Argentina. Todo el 3D vive en un solo archivo,
`3d/index.html`, y está hecho como **geometría generada por código**: no hay ningún modelo
descargado. El edificio son cajas de three.js que salen de una tabla de medidas (`const M`,
bloque 1 del archivo) tomadas de los planos del arquitecto. Leé el archivo entero antes de
tocar nada, incluidos los comentarios: explican por qué cada cosa está como está.

## Qué hay

- `3d/index.html`: escena, cielo con hora del día (Sky.js + PMREM), volumen del edificio,
  cocheras, vecinos, selección de unidades por raycast, cámaras guardadas, reloj, postproceso
  (GTAO y bloom), y el modo **Piso por piso** (bloque 11): el edificio se parte en sus siete
  niveles, cada losa lleva su planta como textura y los muros se extruyen desde `3d/muros.json`.
- `3d/muros.json`: rectángulos de muro por planta (`pb`, `tipo`, `p5`, `p6`), en porcentaje
  del plano. La izquierda del dibujo cae en +X y el borde de arriba en +Z.
- `img/plantas/*.webp`: las cuatro plantas de CB Arquitectura recortadas del PDF.
- `img/*.jpg`: renders del proyecto (exteriores, interiores, cocheras). Son la referencia de
  materiales: ladrillo visto en los pilares de esquina, losas y parasoles de hormigón,
  listones verticales de madera delante de los balcones, carpinterías de aluminio negro con
  vidrio 6+6, porcelanato adentro.
- Los planos originales, si los necesitás: `Broshure completo Latorre/02. TIPOLOGÍAS/`
  (`La Torre Plantas.pdf`, `La Torre Vistas.pdf` con alzados y corte cotado).

## Qué quiero

Que el volumen se vea **más real y con más detalle**, sin cambiar la forma en que está
construido. En este orden:

1. **Interiores del modo Piso por piso.** Hoy son muros extruidos sobre el plano. Sumar:
   muebles paramétricos sencillos donde el plano los dibuja (cama, mesa con sillas, sillón,
   mesada de cocina, sanitarios), puertas como hojas en los vanos, ventanas con marco negro
   en los huecos que dan a fachada, zócalo y diferencia de material entre piso húmedo y seco.
   Todo generado por código a partir de posiciones en porcentaje del plano, como los muros.
   Nada a mano en coordenadas absolutas.
2. **La fachada.** Más detalle en lo que los renders muestran: junta de ladrillo con bump más
   marcado, sombra propia de los parasoles, marcos de aluminio con profundidad, vidrio con
   reflejo del cielo y algo de interior visible detrás (una cortina, un cielorraso), el
   remate de hormigón con textura de encofrado, el portón y el acceso peatonal con el jardín.
3. **Materiales.** Texturas procedurales o de canvas (como las que ya genera el archivo),
   nunca archivos externos pesados. Mapas de rugosidad y normal donde valga la pena.
4. **Luz.** La noche: ventanas encendidas con calidez distinta por ambiente, apliques que bañen
   el balcón de abajo, luz del hall. Ya hay una base; mejorarla, no reemplazarla.

## Reglas

- **Ninguna medida inventada.** Todo dato nuevo sale del corte, los alzados o las plantas, y
  va a la tabla `M` con un comentario que diga de qué plano sale. Si un dato no está en los
  planos, se estima y se marca como estimado en el comentario.
- **Ningún archivo externo pesado.** El sitio se sirve desde GitHub Pages y se abre en
  celulares de gama media en Salta. Sin GLB, sin texturas de más de 100 KB, sin librerías
  fuera de three.js 0.185 y sus addons. Presupuesto: la página entera con 3D por debajo de
  1,5 MB transferidos.
- **60 fps en escritorio y fluido en celular.** Las piezas repetidas van fusionadas en una
  malla (ver `lote()`); nada de cientos de meshes sueltos. En celular (`esCelular`) se apaga
  lo caro.
- **Celular primero.** Cada cambio se prueba a 390 px de ancho, táctil, antes que en
  escritorio. El modo Piso por piso tiene una hoja al pie en el celular y un panel lateral
  en escritorio: no romperlos.
- **No tocar** la estructura del archivo (los bloques numerados), los nombres en español, la
  tabla `M`, los ids del DOM ni la API pública `window.TORRE`. El texto visible va en español
  rioplatense, voseo, sin signos de exclamación ni emojis.
- **`prefers-reduced-motion`** se respeta: lo que se anima tiene su versión sin animación.
- Los estados de las unidades (libre, reservada, vendida) salen del CRM por `fetch`; no
  cambiar esa lógica.
- Commits chicos, en español, uno por tema, con el porqué en el mensaje.

## Cómo entregar

Antes de decir que está: captura a 390 px y a 1440 px de cada cosa que cambiaste, de día y
de noche (`?hora=21:30`), y del modo Piso por piso (`?modo=pisos&piso=3`). Decime qué
quedó estimado y qué no pudiste verificar.
