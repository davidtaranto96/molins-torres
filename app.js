/* ══════════════════════════════════════════════════════════════════════════
   LA TORRE — portada nueva. Un solo archivo, sin framework.

   Secciones de este archivo:
     1 · configuración y datos (CRM, unidades de respaldo, tipologías)
     2 · el diccionario ES / EN / PT — todo el texto visible vive acá
     3 · i18n: pintar el idioma y el conmutador
     4 · la intro y la cabecera
     5 · el hero: del boceto al render, al ritmo del scroll
     6 · scroll suave (Lenis) + títulos partidos + parallax (GSAP)
     7 · tipologías, unidades, A/B, las partidas, adentro, el 3D
     8 · el CRM: visita, clics y consulta
     9 · cookies
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ── 1 · configuración ─────────────────────────────────────────────────── */
  const CFG = Object.assign({
    crm: "https://crm.franciscomolins.com",
    clave: "sk_JaM2iwc_VomlqxOK-mu3PYydaMP_i2Vy",
    cartera: "torre",
    whatsapp: "5493874153669",
    campaniaPorDefecto: "organico",
    tresd: "3d/",
  }, window.TORRE_CONFIG || {});

  const RESPALDO = [
    { id:"6A", piso:6, torre:"Norte", tip:"Horizonte", sup:37, estado:"libre" },
    { id:"5A", piso:5, torre:"Norte", tip:"Evolución", sup:42, estado:"libre" },
    { id:"4A", piso:4, torre:"Norte", tip:"Esencia",   sup:55, estado:"libre" },
    { id:"3A", piso:3, torre:"Norte", tip:"Esencia",   sup:55, estado:"libre" },
    { id:"2A", piso:2, torre:"Norte", tip:"Esencia",   sup:55, estado:"reservada" },
    { id:"1A", piso:1, torre:"Norte", tip:"Esencia",   sup:55, estado:"libre" },
    { id:"6B", piso:6, torre:"Sur",   tip:"Cúspide",   sup:55, estado:"libre" },
    { id:"5B", piso:5, torre:"Sur",   tip:"Cúspide",   sup:55, estado:"libre" },
    { id:"4B", piso:4, torre:"Sur",   tip:"Cúspide",   sup:55, estado:"libre" },
    { id:"3B", piso:3, torre:"Sur",   tip:"Cúspide",   sup:55, estado:"reservada" },
    { id:"2B", piso:2, torre:"Sur",   tip:"Cúspide",   sup:55, estado:"libre" },
    { id:"1B", piso:1, torre:"Sur",   tip:"Cúspide",   sup:55, estado:"libre" },
  ];
  const TIPOS = [
    { clave:"horizonte", nombre:"Horizonte", lamina:"img/plano-tipologia-1-horizonte.jpg", render:"img/render-tipologia-1.jpg", foto:"img/area-dormitorio.jpg" },
    { clave:"evolucion", nombre:"Evolución", lamina:"img/plano-tipologia-2-evolucion.jpg", render:"img/render-tipologia-2.jpg", foto:"img/area-terraza.jpg" },
    { clave:"esencia",   nombre:"Esencia",   lamina:"img/plano-tipologia-3-esencia.jpg",   render:"img/render-tipologia-3.jpg", foto:"img/area-suite.jpg" },
    { clave:"cuspide",   nombre:"Cúspide",   lamina:"img/plano-tipologia-4-cuspide.jpg",   render:"img/render-tipologia-4.jpg", foto:"img/area-estar.jpg" },
  ];
  let UNIDADES = RESPALDO.slice();
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── 2 · el diccionario ────────────────────────────────────────────────── */
  const DICC = {
    es: {
      "nav.inicio": "Inicio",
      "nav.espacios": "Espacios",
      "nav.plan": "Plan de pago",
      "nav.menu": "Menú",
      "nav.cerrar": "Cerrar",
      "cta.consultarCorto": "Consultar",
      "espacios.rotulo": "Los espacios",
      "espacios.titulo": "Lo que se comparte, y lo que es sólo tuyo",
      "espacios.i1": "Acceso por Aniceto Latorre, iluminado y con verde",
      "espacios.i2": "Circulaciones con muros verdes que suben piso a piso",
      "espacios.i3": "Terraza propia en el 5.º de Torre Norte, por el retiro del volumen",
      "espacios.i4": "Balcones en todas las unidades, dos en Torre Sur",
      "espacios.palabra": "Espacios",
      "cocheras.rotulo": "Las cocheras",
      "cocheras.titulo": "Llegás en auto y ya estás en tu casa",
      "cocheras.i1": "Cocheras en planta baja",
      "cocheras.i2": "Entrada vehicular por Aniceto Latorre",
      "cocheras.i3": "A metros del ascensor",
      "cocheras.palabra": "Cocheras",
      "adentro.rotulo": "Adentro",
      "adentro.titulo": "Así se vive en La Torre",
      "adentro.texto": "Los renders de los interiores, ambiente por ambiente. Cuando haya video de obra, va acá mismo.",
      "adentro.estar.t": "El estar",
      "adentro.estar.p": "Abierto a la cocina y al balcón.",
      "ficha.render": "Render",
      "ficha.lamina": "Lámina",
      "ficha.tipologia": "Tipología",
      "ficha.superficie": "Superficie",
      "ficha.ambientes": "Ambientes",
      "ficha.piso": "Planta",
      "ficha.consultar": "Consultar por esta unidad",
      "ficha.libre": "Está disponible. Los valores y el plan de pago se conversan con Francisco.",
      "ficha.reservada": "Está reservada. Podés dejar tus datos por si se libera, o mirar otra unidad de la misma tipología.",
      "ficha.vendida": "Ya se vendió. Hay otras unidades de la misma tipología.",
      "diseno.cta": "Explorar en 3D",
      "tipologias.palabra": "Residencias",
      "tipologias.disponibles": "unidades disponibles",
      "tipologias.verLamina": "Ver la lámina",
      "marca": "LA TORRE",
      "nav.diseno": "El edificio", "nav.tipologias": "Tipologías", "nav.unidades": "Unidades", "nav.tresd": "Recorrido 3D",
      "nav.ubicacion": "Ubicación", "nav.contacto": "Contacto", "nav.avance": "Avance de obra",
      "cta.elegir": "Elegir la unidad", "cta.visita": "Hacer la visita", "cta.whatsapp": "Escribir por WhatsApp",
      "cta.enviar": "Enviar la consulta", "cta.consultar": "Consultar por esta tipología",
      "hero.rotulo": "Venta en pozo · Salta Capital",
      "hero.bajada": "Doce unidades entre Torre Norte y Torre Sur, sobre Balcarce y Aniceto Latorre.",
      "hero.pista": "Deslizá para ver el edificio",
      "intro.titulo": "La Torre nace como una manifestación arquitectónica de la verticalidad del tiempo y la transformación personal.",
      "intro.datos": "12 unidades · 6 plantas por torre · 37 a 55 m² · cocheras en planta baja",
      "diseno.rotulo": "El edificio",
      "diseno.titulo": "Hormigón, ladrillo y verde que sube con vos",
      "diseno.texto": "Dos torres sobre un mismo acceso, con el núcleo de escalera al medio y una unidad por torre en cada planta. Materiales que envejecen bien: hormigón visto, ladrillo en las esquinas, carpinterías negras y parasoles de madera que dan sombra sin cerrar la vista.",
      "diseno.m1": "Hormigón visto en losas y pórtico", "diseno.m2": "Ladrillo visto en los pilares",
      "diseno.m3": "Parasoles de listones de madera", "diseno.m4": "Muros verdes en las circulaciones",
      "tipologias.rotulo": "Las plantas", "tipologias.titulo": "Cuatro tipologías",
      "tipologias.texto": "Del monoambiente al dormitorio en suite. Cada tipología con su lámina, su superficie y las unidades donde se repite.",
      "tipo.horizonte.desc": "Monoambiente · 37 m²", "tipo.horizonte.amb": "Dormitorio · Kitchenette · Baño", "tipo.horizonte.ubic": "Unidad 6.º A · Torre Norte",
      "tipo.evolucion.desc": "Monoambiente con terraza propia · 42 m²", "tipo.evolucion.amb": "Dormitorio · Kitchenette · Baño · Terraza propia", "tipo.evolucion.ubic": "Unidad 5.º A · Torre Norte",
      "tipo.esencia.desc": "1 dormitorio en suite · 55 m²", "tipo.esencia.amb": "Cocina · Comedor-estar · Suite · 2 balcones", "tipo.esencia.ubic": "Unidades 1.º a 4.º A · Torre Norte",
      "tipo.cuspide.desc": "1 dormitorio en suite · 55 m²", "tipo.cuspide.amb": "Cocina · Comedor-estar · Suite · 2 balcones", "tipo.cuspide.ubic": "Unidades 1.º a 6.º B · Torre Sur",
      "tipo.laminaPie": "Lámina de la tipología, con su ubicación en planta", "tipo.renderPie": "Render ilustrativo del proyecto",
      "unidades.rotulo": "Las residencias", "unidades.titulo": "Elegí tu unidad",
      "unidades.texto": "El esquema está vivo: muestra el estado real de cada unidad. La reserva se confirma siempre con una persona.",
      "unidades.nota": "Los valores se conversan al consultar. Acá no se reserva ni se seña online.",
      "torre.norte": "Torre Norte", "torre.sur": "Torre Sur", "piso": "Piso",
      "estado.libre": "Libre", "estado.reservada": "Reservada", "estado.vendida": "Vendida",
      "vida.rotulo": "La visita", "vida.titulo": "Eleva tu vida, un piso a la vez",
      "vida.texto": "Recorré el edificio como si ya vivieras acá. Deslizá para caminar el recorrido.",
      "vida.llegada.t": "La llegada", "vida.llegada.p": "Entrás por Aniceto Latorre. El acceso, iluminado y con verde, te recibe todos los días.",
      "vida.cochera.t": "Tu cochera", "vida.cochera.p": "En planta baja, a metros del ascensor. Llegás y ya estás en tu casa.",
      "vida.ascenso.t": "El ascenso", "vida.ascenso.p": "Circulaciones con muros verdes que suben con vos, piso a piso.",
      "vida.cocina.t": "La cocina", "vida.cocina.p": "Equipada y abierta al estar: el lugar donde empieza el día.",
      "vida.suite.t": "La suite", "vida.suite.p": "Dormitorio en suite, con dos balcones propios.",
      "vida.terraza.t": "Tu terraza", "vida.terraza.p": "El cielo de Salta desde tu propio piso, sin compartirlo con nadie.",
      "tresD.rotulo": "El edificio en 3D", "tresD.titulo": "Girá la torre y mirá cómo se prende de noche",
      "tresD.texto": "El volumen del edificio, piso por piso, con el recorrido real del sol en Salta. Tocá una unidad para ver su ficha.",
      "tresD.abrir": "Abrir el recorrido 3D", "tresD.peso": "Carga unos 300 KB",
      "desdeArriba.rotulo": "Desde arriba", "desdeArriba.titulo": "Dos torres, un acceso",
      "desdeArriba.texto": "El corte del conjunto: Torre Norte sobre la calle, Torre Sur al fondo del lote, y el núcleo de escalera y ascensor entre las dos.",
      "desdeArriba.norte": "Sobre Aniceto Latorre. Seis unidades, del monoambiente del 6.º A al dormitorio en suite de los pisos 1 a 4. El 5.º tiene terraza propia por el retiro del volumen.",
      "desdeArriba.sur": "Al fondo del lote, con más silencio. Seis unidades de un dormitorio en suite con dos balcones, una por planta.",
      "ubicacion.rotulo": "El entorno", "ubicacion.titulo": "La ciudad a mano. El ruido, lejos.",
      "ubicacion.texto": "Balcarce y Aniceto Latorre: comercio, salud y el polo gastronómico de Salta a distancia de caminata.",
      "ubicacion.shopping": "Portal Salta Shopping", "ubicacion.paseo": "Paseo Balcarce", "ubicacion.hospital": "Hospital Materno Infantil",
      "ubicacion.maps": "Abrir en Google Maps",
      "plan.rotulo": "El plan de pago", "plan.titulo": "Se compra en pozo, en tres momentos",
      "plan.texto": "Un solo cuadro de precios, el mismo para todos. Los valores se confirman al consultar.",
      "plan.anticipo.t": "Anticipo al boleto", "plan.anticipo.p": "Se firma el boleto y se aparta la unidad con el anticipo.",
      "plan.cuotas.t": "Cuotas durante la obra", "plan.cuotas.p": "El saldo se paga en cuotas mientras la obra avanza.",
      "plan.posesion.t": "Posesión", "plan.posesion.p": "Con la obra terminada, se escritura y se entregan las llaves.",
      "avance.rotulo": "La obra", "avance.titulo": "Avance de obra",
      "avance.texto": "Una foto fechada por cada certificación de obra. Sin porcentajes que después no se puedan sostener.",
      "avance.sinFotos": "Todavía no hay fotos de obra cargadas. Cada certificación suma acá su foto con fecha.",
      "contacto.rotulo": "Hablemos", "contacto.titulo": "Consultar por una unidad",
      "contacto.texto": "Decinos qué unidad mirás y te contesta Francisco, no un formulario automático. Acá no se reserva ni se seña online: la unidad se aparta hablando.",
      "contacto.nombre": "Nombre y apellido", "contacto.telefono": "Teléfono", "contacto.unidad": "Unidad de interés", "contacto.mensaje": "Mensaje",
      "contacto.enviar": "Enviar la consulta", "contacto.enviando": "Enviando",
      "contacto.ok": "Recibimos tu consulta. Francisco te va a contactar a la brevedad.",
      "contacto.fallo": "No pudimos registrar la consulta recién. Mandala por WhatsApp y llega igual.",
      "contacto.pie": "Te contestamos por WhatsApp o por teléfono, con el plano de la unidad y las formas de pago.",
      "contacto.sinUnidad": "Todavía no sé",
      "pie.bajada": "Doce unidades en pozo entre Torre Norte y Torre Sur, sobre Balcarce y Aniceto Latorre, Salta Capital.",
      "pie.edificio": "El edificio", "pie.donde": "Dónde queda", "pie.quien": "Quién vende",
      "pie.comercializa": "Comercialización exclusiva Grupo LPZ-Molins",
      "pie.aviso": "Las imágenes son renders del proyecto. Medidas y terminaciones sujetas a ajustes de obra.",
      "cookies.texto": "Al navegar por este sitio <strong>aceptás el uso de cookies</strong> para mejorar tu experiencia.",
      "cookies.boton": "Entendido",
      "wa.hola": "Hola Francisco, te escribo por el Edificio La Torre.",
      "wa.unidad": "Hola Francisco, te escribo por la unidad {u} del Edificio La Torre.",
    },
    en: {
      "nav.inicio": "Home",
      "nav.espacios": "Spaces",
      "nav.plan": "Payment plan",
      "nav.menu": "Menu",
      "nav.cerrar": "Close",
      "cta.consultarCorto": "Inquire",
      "espacios.rotulo": "The spaces",
      "espacios.titulo": "What is shared, and what is only yours",
      "espacios.i1": "Entrance on Aniceto Latorre, lit and planted",
      "espacios.i2": "Plant-lined walkways rising floor by floor",
      "espacios.i3": "A private terrace on the 5th floor of the North Tower, where the volume steps back",
      "espacios.i4": "Balconies in every unit, two in the South Tower",
      "espacios.palabra": "Spaces",
      "cocheras.rotulo": "Parking",
      "cocheras.titulo": "Drive in and you are already home",
      "cocheras.i1": "Parking on the ground floor",
      "cocheras.i2": "Vehicle entrance on Aniceto Latorre",
      "cocheras.i3": "Steps from the lift",
      "cocheras.palabra": "Parking",
      "adentro.rotulo": "Inside",
      "adentro.titulo": "Life at La Torre",
      "adentro.texto": "The interior renders, room by room. When there is footage from the site, it goes right here.",
      "adentro.estar.t": "The living room",
      "adentro.estar.p": "Open to the kitchen and the balcony.",
      "ficha.render": "Render",
      "ficha.lamina": "Floor plan",
      "ficha.tipologia": "Layout",
      "ficha.superficie": "Area",
      "ficha.ambientes": "Rooms",
      "ficha.piso": "Floor",
      "ficha.consultar": "Ask about this unit",
      "ficha.libre": "Available. Prices and the payment plan are discussed with Francisco.",
      "ficha.reservada": "Reserved. You can leave your details in case it frees up, or look at another unit of the same layout.",
      "ficha.vendida": "Sold. Other units of the same layout are available.",
      "diseno.cta": "Explore in 3D",
      "tipologias.palabra": "Residences",
      "tipologias.disponibles": "units available",
      "tipologias.verLamina": "See the floor plan",
      "intro.titulo": "Two towers on the corner of Balcarce and Aniceto Latorre",
      "intro.texto": "La Torre is twelve homes in two six-story towers, North and South, in Salta, Argentina. Studios of 37 and 42 m² and one-bedroom units of 55 m², with parking on the ground floor. The materials are left exposed: concrete, brick, black frames, timber. It is sold off-plan, with one price list for everyone.",
      "diseno.rotulo": "Architecture",
      "diseno.titulo": "Made of what you see",
      "diseno.texto": "Exposed concrete and exposed brick, with nothing covering them. Black window and door frames. Timber-slat sunscreens to filter the sun. Green walls along the shared walkways. Parking on the ground floor, with its entrance on Aniceto Latorre.",
      "ubicacion.rotulo": "Location",
      "ubicacion.titulo": "Balcarce and Aniceto Latorre, Salta",
      "ubicacion.texto": "La Torre stands on the corner of Balcarce and Aniceto Latorre, in Salta. Paseo Balcarce, the Portal Salta shopping center, and the Materno Infantil Hospital are all within a short walk.",
      "ubicacion.hospital": "Materno Infantil Hospital",
      "ubicacion.shopping": "Portal Salta Shopping Center",
      "ubicacion.paseo": "Paseo Balcarce",
      "tipologias.rotulo": "Layouts",
      "tipologias.titulo": "Four layouts, twelve units",
      "tipologias.texto": "Two studios and ten one-bedroom units. The studios, Horizonte and Evolución, are on the top two floors of the North Tower. Esencia is the A unit on floors one to four of the North Tower; Cúspide is the B unit on all six floors of the South Tower.",
      "tipo.horizonte.nombre": "Horizonte",
      "tipo.horizonte.desc": "Studio, 37 m². Sixth floor, unit A, North Tower.",
      "tipo.horizonte.amb": "Bedroom, kitchenette, bathroom",
      "tipo.evolucion.nombre": "Evolución",
      "tipo.evolucion.desc": "Studio with a private terrace, 42 m². Fifth floor, unit A, North Tower.",
      "tipo.evolucion.amb": "Bedroom, kitchenette, bathroom, private terrace",
      "tipo.esencia.nombre": "Esencia",
      "tipo.esencia.desc": "One bedroom with en-suite bathroom, 55 m². First to fourth floors, unit A, North Tower.",
      "tipo.esencia.amb": "Kitchen, living-dining room, en-suite bedroom, two balconies",
      "tipo.cuspide.nombre": "Cúspide",
      "tipo.cuspide.desc": "One bedroom with en-suite bathroom, 55 m². First to sixth floors, unit B, South Tower.",
      "tipo.cuspide.amb": "Kitchen, living-dining room, en-suite bedroom, two balconies",
      "vida.rotulo": "Living here",
      "vida.titulo": "The way home",
      "vida.texto": "A walk through the building, stop by stop: the arrival, the garage, the plant-lined walkways, and the terrace.",
      "vida.llegada.t": "Arriving",
      "vida.llegada.p": "You arrive at the corner of Balcarce and Aniceto Latorre. Exposed brick, black frames and timber sunscreens: you can pick the building out from half a block away.",
      "vida.cochera.t": "Parking",
      "vida.cochera.p": "The garage is on the ground floor, with its entrance on Aniceto Latorre. Drive in, park, and head up.",
      "vida.ascenso.t": "Going up",
      "vida.ascenso.p": "Green walls run along the shared walkways, floor after floor. The way to your door is lined with plants.",
      "vida.terraza.t": "The terrace",
      "vida.terraza.p": "Open sky at the end of the climb. The Evolución studio, on the fifth floor of the North Tower, has a terrace of its own.",
      "desdeArriba.rotulo": "From above",
      "desdeArriba.titulo": "Two towers, one corner",
      "desdeArriba.norte": "North Tower · A units",
      "desdeArriba.sur": "South Tower · B units",
      "plan.rotulo": "Payment plan",
      "plan.titulo": "Buy while it is being built",
      "plan.texto": "La Torre is sold off-plan. A down payment when the purchase agreement is signed, installments while the building is under construction, and possession when it is finished. There is one price list, and it is the same for every buyer. Ask Francisco for the current terms.",
      "plan.anticipo.t": "Down payment",
      "plan.anticipo.p": "Paid when the purchase agreement is signed. It secures your unit.",
      "plan.cuotas.t": "Installments",
      "plan.cuotas.p": "Spread across the construction period, as the building goes up.",
      "plan.posesion.t": "Possession",
      "plan.posesion.p": "Once construction is finished, the unit is handed over to you.",
      "avance.rotulo": "Construction progress",
      "avance.titulo": "Stage by stage",
      "avance.texto": "Every time a stage of the work is certified, a dated photo is added here. You can follow the building from the ground up without having to ask.",
      "avance.sinFotos": "There are no construction photos yet. The first ones will be posted here as the work moves forward.",
      "contacto.rotulo": "Contact",
      "contacto.titulo": "Ask about a unit",
      "contacto.texto": "Tell us which unit you are looking at and Francisco will answer you himself. There is no automated reply behind this form, and no reservations or deposits are taken online.",
      "contacto.nombre": "Name",
      "contacto.telefono": "Phone",
      "contacto.unidad": "Unit",
      "contacto.mensaje": "Message",
      "contacto.enviar": "Send inquiry",
      "contacto.enviando": "Sending…",
      "contacto.ok": "Received. Francisco will get back to you.",
      "contacto.fallo": "The message did not go through. Try again, or message us on WhatsApp.",
      "contacto.pie": "You will hear back from Francisco Molins, licensed real estate broker, CUCIS 251.",
      "pie.aviso": "The images are renders of the project. Dimensions and finishes are subject to adjustments during construction.",
      "pie.comercializa": "Sold exclusively by Grupo LPZ-Molins",
      "nav.visita": "Tour",
      "nav.unidades": "Units",
      "nav.tipologias": "Layouts",
      "nav.avance": "Progress",
      "nav.ubicacion": "Location",
      "nav.contacto": "Contact",
      "cta.elegir": "Choose a unit",
      "cta.visita": "Take the tour",
      "cta.whatsapp": "Chat on WhatsApp",
      "cta.enviar": "Send inquiry",
      "cookies.texto": "By browsing this site <strong>you accept the use of cookies</strong> to improve your experience.",
      "cookies.boton": "Got it",
      "estado.libre": "Available",
      "estado.reservada": "Reserved",
      "estado.vendida": "Sold",
      "hora.dia": "Day",
      "hora.noche": "Night",
      "tresD.titulo": "The building in 3D",
      "tresD.texto": "Rotate the model, see both towers from every side, and find where each unit sits.",
      "tresD.abrir": "Open the 3D view",
      "marca": "LA TORRE",
      "nav.diseno": "The building",
      "nav.tresd": "3D tour",
      "cta.consultar": "Ask about this layout",
      "hero.rotulo": "Off-plan · Salta, Argentina",
      "hero.bajada": "Twelve homes across North and South Tower, on Balcarce and Aniceto Latorre.",
      "hero.pista": "Scroll to see the building",
      "intro.datos": "12 units · 6 floors per tower · 37 to 55 m² · ground-floor parking",
      "diseno.m1": "Exposed concrete slabs and portico",
      "diseno.m2": "Exposed brick piers",
      "diseno.m3": "Timber-slat sunscreens",
      "diseno.m4": "Green walls along the walkways",
      "tipo.horizonte.ubic": "Unit 6A · North Tower",
      "tipo.evolucion.ubic": "Unit 5A · North Tower",
      "tipo.esencia.ubic": "Units 1A to 4A · North Tower",
      "tipo.cuspide.ubic": "Units 1B to 6B · South Tower",
      "tipo.laminaPie": "Layout sheet, with its position on the floor plan",
      "tipo.renderPie": "Illustrative render of the project",
      "unidades.rotulo": "The residences",
      "unidades.titulo": "Choose your unit",
      "unidades.texto": "The diagram is live: it shows the real status of every unit. A reservation is always confirmed with a person.",
      "unidades.nota": "Prices are discussed when you get in touch. Nothing is reserved or paid online.",
      "torre.norte": "North Tower",
      "torre.sur": "South Tower",
      "piso": "Floor",
      "vida.cocina.t": "The kitchen",
      "vida.cocina.p": "Fitted and open to the living room: where the day starts.",
      "vida.suite.t": "The suite",
      "vida.suite.p": "An en-suite bedroom with two private balconies.",
      "tresD.rotulo": "The building in 3D",
      "tresD.peso": "Loads about 300 KB",
      "desdeArriba.texto": "The section of the whole: North Tower on the street, South Tower at the back of the lot, and the stair and lift core between them.",
      "ubicacion.maps": "Open in Google Maps",
      "contacto.sinUnidad": "Not sure yet",
      "pie.bajada": "Twelve off-plan homes across North and South Tower, on Balcarce and Aniceto Latorre, Salta, Argentina.",
      "pie.edificio": "The building",
      "pie.donde": "Where it is",
      "pie.quien": "Who sells it",
      "wa.hola": "Hi Francisco, I'm writing about Edificio La Torre.",
      "wa.unidad": "Hi Francisco, I'm writing about unit {u} at Edificio La Torre.",
    },
    pt: {
      "nav.inicio": "Início",
      "nav.espacios": "Espaços",
      "nav.plan": "Plano de pagamento",
      "nav.menu": "Menu",
      "nav.cerrar": "Fechar",
      "cta.consultarCorto": "Consultar",
      "espacios.rotulo": "Os espaços",
      "espacios.titulo": "O que se compartilha, e o que é só seu",
      "espacios.i1": "Acesso pela Aniceto Latorre, iluminado e com verde",
      "espacios.i2": "Circulações com paredes verdes que sobem andar por andar",
      "espacios.i3": "Terraço próprio no 5.º da Torre Norte, pelo recuo do volume",
      "espacios.i4": "Sacadas em todas as unidades, duas na Torre Sul",
      "espacios.palabra": "Espaços",
      "cocheras.rotulo": "A garagem",
      "cocheras.titulo": "Você chega de carro e já está em casa",
      "cocheras.i1": "Vagas no térreo",
      "cocheras.i2": "Entrada de veículos pela Aniceto Latorre",
      "cocheras.i3": "A poucos metros do elevador",
      "cocheras.palabra": "Garagem",
      "adentro.rotulo": "Por dentro",
      "adentro.titulo": "Assim se vive no La Torre",
      "adentro.texto": "Os renders dos interiores, ambiente por ambiente. Quando houver vídeo da obra, entra aqui mesmo.",
      "adentro.estar.t": "A sala",
      "adentro.estar.p": "Aberta à cozinha e à sacada.",
      "ficha.render": "Render",
      "ficha.lamina": "Planta",
      "ficha.tipologia": "Tipologia",
      "ficha.superficie": "Área",
      "ficha.ambientes": "Ambientes",
      "ficha.piso": "Andar",
      "ficha.consultar": "Consultar por este apartamento",
      "ficha.libre": "Está disponível. Os valores e o plano de pagamento são conversados com o Francisco.",
      "ficha.reservada": "Está reservado. Você pode deixar seus dados caso ele seja liberado, ou ver outra unidade da mesma tipologia.",
      "ficha.vendida": "Já foi vendido. Há outras unidades da mesma tipologia.",
      "diseno.cta": "Explorar em 3D",
      "tipologias.palabra": "Residências",
      "tipologias.disponibles": "unidades disponíveis",
      "tipologias.verLamina": "Ver a planta",
      "intro.titulo": "Duas torres, doze apartamentos e uma rua de Salta.",
      "intro.texto": "O Edifício La Torre fica em Salta, entre as ruas Balcarce e Aniceto Latorre. Torre Norte e Torre Sul, seis andares cada uma, apartamentos de 37 a 55 m² e vagas de garagem no térreo. A venda é na planta: entrada na assinatura do contrato e parcelas durante a obra. Uma só tabela de preços, a mesma para todos.",
      "diseno.rotulo": "Arquitetura",
      "diseno.titulo": "Concreto, tijolo e madeira, sem disfarce.",
      "diseno.texto": "Concreto aparente, tijolo à vista e esquadrias pretas. Brises de ripas de madeira filtram a luz nas fachadas. Nas circulações, jardins verticais acompanham a subida, andar por andar. As vagas de garagem ficam no térreo, com acesso pela Aniceto Latorre.",
      "ubicacion.rotulo": "O bairro",
      "ubicacion.titulo": "Na Balcarce, perto do que a cidade usa todo dia.",
      "ubicacion.texto": "O Paseo Balcarce, o Portal Salta Shopping e o Hospital Materno Infantil ficam a menos de um quilômetro do edifício. Dá para ir a pé.",
      "ubicacion.hospital": "Hospital Materno Infantil",
      "ubicacion.shopping": "Portal Salta Shopping",
      "ubicacion.paseo": "Paseo Balcarce",
      "tipologias.rotulo": "Plantas",
      "tipologias.titulo": "Quatro plantas, duas torres.",
      "tipologias.texto": "Do estúdio de 37 m² ao apartamento de 55 m² com suíte e duas varandas. Cada planta tem a sua torre e o seu andar. Escolha a sua e fale com o Francisco.",
      "tipo.horizonte.nombre": "Horizonte",
      "tipo.horizonte.desc": "Estúdio de 37 m² no 6º andar da Torre Norte.",
      "tipo.horizonte.amb": "Quarto · Kitchenette · Banheiro",
      "tipo.evolucion.nombre": "Evolución",
      "tipo.evolucion.desc": "Estúdio de 42 m² com terraço próprio, no 5º andar da Torre Norte.",
      "tipo.evolucion.amb": "Estúdio · Terraço próprio",
      "tipo.esencia.nombre": "Esencia",
      "tipo.esencia.desc": "Apartamento de uma suíte, 55 m², do 1º ao 4º andar da Torre Norte.",
      "tipo.esencia.amb": "Cozinha · Sala de estar e jantar · Suíte · Duas varandas",
      "tipo.cuspide.nombre": "Cúspide",
      "tipo.cuspide.desc": "Apartamento de uma suíte, 55 m², do 1º ao 6º andar da Torre Sul.",
      "tipo.cuspide.amb": "Cozinha · Sala de estar e jantar · Suíte · Duas varandas",
      "vida.rotulo": "A visita",
      "vida.titulo": "Eleve a sua vida, um andar por vez.",
      "vida.texto": "Percorra o edifício como se já morasse aqui: a chegada, a vaga, a subida e o terraço.",
      "vida.llegada.t": "A chegada",
      "vida.llegada.p": "Você entra pela Balcarce. A entrada de pedestres, com verde nas paredes, recebe você todos os dias.",
      "vida.cochera.t": "A sua vaga",
      "vida.cochera.p": "No térreo, com entrada pela Aniceto Latorre. Você estaciona e já está em casa.",
      "vida.ascenso.t": "A subida",
      "vida.ascenso.p": "Nas circulações, jardins verticais sobem com você, andar por andar.",
      "vida.terraza.t": "O terraço",
      "vida.terraza.p": "O céu de Salta do seu próprio terraço, sem dividir com ninguém.",
      "desdeArriba.rotulo": "Vista aérea",
      "desdeArriba.titulo": "As duas torres, vistas de cima.",
      "desdeArriba.norte": "Torre Norte · 6 andares · Horizonte, Evolución e Esencia",
      "desdeArriba.sur": "Torre Sul · 6 andares · Cúspide",
      "plan.rotulo": "Plano de pagamento",
      "plan.titulo": "Comprar na planta, pagar durante a obra.",
      "plan.texto": "Uma só tabela de preços, a mesma para todos. Os valores não estão no site: o Francisco passa a tabela numa conversa e explica cada etapa.",
      "plan.anticipo.t": "Entrada",
      "plan.anticipo.p": "Na assinatura do contrato de compra e venda.",
      "plan.cuotas.t": "Parcelas",
      "plan.cuotas.p": "Durante a obra, até a entrega.",
      "plan.posesion.t": "Entrega das chaves",
      "plan.posesion.p": "Com a obra concluída, você recebe o seu apartamento.",
      "avance.rotulo": "Andamento da obra",
      "avance.titulo": "A obra, medição por medição.",
      "avance.texto": "A cada medição da obra entra uma foto nova, com data. Assim você acompanha o andamento sem precisar ir até lá.",
      "avance.sinFotos": "Ainda não há fotos da obra. As primeiras entram com a primeira medição.",
      "contacto.rotulo": "Contato",
      "contacto.titulo": "Pergunte sobre um apartamento.",
      "contacto.texto": "Quem responde é o Francisco Molins, não um formulário automático. Pelo site não dá para reservar nem deixar sinal: primeiro a gente conversa.",
      "contacto.nombre": "Nome",
      "contacto.telefono": "Telefone ou WhatsApp",
      "contacto.unidad": "Apartamento de interesse",
      "contacto.mensaje": "Mensagem",
      "contacto.enviar": "Enviar mensagem",
      "contacto.enviando": "Enviando…",
      "contacto.ok": "Recebemos a sua mensagem. O Francisco vai entrar em contato em breve.",
      "contacto.fallo": "Não conseguimos enviar a sua mensagem. Tente de novo ou chame no WhatsApp.",
      "contacto.pie": "Seus dados servem só para responder a esta mensagem.",
      "pie.aviso": "As imagens são renders do projeto. Medidas e acabamentos estão sujeitos a ajustes de obra.",
      "pie.comercializa": "Comercialização exclusiva Grupo LPZ-Molins",
      "nav.visita": "A visita",
      "nav.unidades": "Apartamentos",
      "nav.tipologias": "Plantas",
      "nav.avance": "Obra",
      "nav.ubicacion": "Localização",
      "nav.contacto": "Contato",
      "cta.elegir": "Escolher o apartamento",
      "cta.visita": "Fazer a visita",
      "cta.whatsapp": "Chamar no WhatsApp",
      "cta.enviar": "Enviar mensagem",
      "cookies.texto": "Ao navegar por este site, <strong>você aceita o uso de cookies</strong> para melhorar a sua experiência.",
      "cookies.boton": "Entendi",
      "estado.libre": "Disponível",
      "estado.reservada": "Reservado",
      "estado.vendida": "Vendido",
      "hora.dia": "Dia",
      "hora.noche": "Noite",
      "tresD.titulo": "O edifício em 3D",
      "tresD.texto": "Percorra as duas torres e encontre o andar do seu apartamento.",
      "tresD.abrir": "Abrir em 3D",
      "marca": "LA TORRE",
      "nav.diseno": "O edifício",
      "nav.tresd": "Tour 3D",
      "cta.consultar": "Perguntar sobre esta tipologia",
      "hero.rotulo": "Venda na planta · Salta, Argentina",
      "hero.bajada": "Doze unidades entre a Torre Norte e a Torre Sul, na Balcarce com Aniceto Latorre.",
      "hero.pista": "Role para ver o edifício",
      "intro.datos": "12 unidades · 6 andares por torre · 37 a 55 m² · garagem no térreo",
      "diseno.m1": "Lajes e pórtico em concreto aparente",
      "diseno.m2": "Pilares em tijolo aparente",
      "diseno.m3": "Brises de ripas de madeira",
      "diseno.m4": "Paredes verdes nas circulações",
      "tipo.horizonte.ubic": "Unidade 6A · Torre Norte",
      "tipo.evolucion.ubic": "Unidade 5A · Torre Norte",
      "tipo.esencia.ubic": "Unidades 1A a 4A · Torre Norte",
      "tipo.cuspide.ubic": "Unidades 1B a 6B · Torre Sul",
      "tipo.laminaPie": "Prancha da tipologia, com a posição na planta",
      "tipo.renderPie": "Render ilustrativo do projeto",
      "unidades.rotulo": "As residências",
      "unidades.titulo": "Escolha a sua unidade",
      "unidades.texto": "O esquema está vivo: mostra a situação real de cada unidade. A reserva é sempre confirmada com uma pessoa.",
      "unidades.nota": "Os valores são conversados no contato. Aqui não se reserva nem se paga sinal pela internet.",
      "torre.norte": "Torre Norte",
      "torre.sur": "Torre Sul",
      "piso": "Andar",
      "vida.cocina.t": "A cozinha",
      "vida.cocina.p": "Equipada e aberta para a sala: onde o dia começa.",
      "vida.suite.t": "A suíte",
      "vida.suite.p": "Quarto com suíte e duas varandas próprias.",
      "tresD.rotulo": "O edifício em 3D",
      "tresD.peso": "Carrega cerca de 300 KB",
      "desdeArriba.texto": "O corte do conjunto: Torre Norte na rua, Torre Sul no fundo do lote, e o núcleo de escada e elevador entre as duas.",
      "ubicacion.maps": "Abrir no Google Maps",
      "contacto.sinUnidad": "Ainda não sei",
      "pie.bajada": "Doze unidades na planta entre a Torre Norte e a Torre Sul, na Balcarce com Aniceto Latorre, Salta, Argentina.",
      "pie.edificio": "O edifício",
      "pie.donde": "Onde fica",
      "pie.quien": "Quem vende",
      "wa.hola": "Olá Francisco, escrevo sobre o Edifício La Torre.",
      "wa.unidad": "Olá Francisco, escrevo sobre a unidade {u} do Edifício La Torre.",
    },
  };

  /* ── 3 · i18n ──────────────────────────────────────────────────────────── */
  let idioma = "es";
  const t = (k, vars) => {
    let v = (DICC[idioma] && DICC[idioma][k]) || DICC.es[k] || "";
    if (vars) Object.keys(vars).forEach((n) => { v = v.replace("{" + n + "}", vars[n]); });
    return v;
  };
  function pintarIdioma() {
    $$("[data-t]").forEach((el) => { el.textContent = t(el.dataset.t); });
    $$("[data-t-html]").forEach((el) => { el.innerHTML = t(el.dataset.tHtml); });
    document.documentElement.lang = idioma;
    document.body.dataset.idioma = idioma;
    $$("[data-idioma-btn]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.idiomaBtn === idioma ? "true" : "false"));
    if ($("#cab-menu-t")) $("#cab-menu-t").textContent = t(document.body.classList.contains("menu-abierto") ? "nav.cerrar" : "nav.menu");
    pintarTipologia(tipoActiva);
    pintarUnidades();
    pintarAB(abActivo);
    enlacesWhatsApp();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  $$("[data-idioma-btn]").forEach((b) => {
    if (Object.keys(DICC[b.dataset.idiomaBtn] || {}).length) b.hidden = false;
    b.addEventListener("click", () => { idioma = b.dataset.idiomaBtn; try { localStorage.setItem("latorre_idioma", idioma); } catch (e) {} pintarIdioma(); });
  });
  try {
    const g = localStorage.getItem("latorre_idioma");
    if (g && Object.keys(DICC[g] || {}).length) idioma = g;
  } catch (e) {}

  /* ── 4 · la intro y la cabecera ────────────────────────────────────────── */
  const intro = $("#intro"), pct = $("#intro-pct");
  const heroImg = $(".hero-render");
  let cargado = false;
  function terminarIntro() {
    if (cargado) return; cargado = true;
    pct.textContent = "100";
    setTimeout(() => { intro.classList.add("fuera"); document.body.classList.remove("cargando"); document.dispatchEvent(new Event("intro-terminada")); setTimeout(() => intro.remove(), 1000); }, reduce ? 0 : 350);
  }
  // el contador acompaña la carga del hero: no es decorativo, es la espera real
  let n = 0;
  const tick = setInterval(() => { if (cargado) return clearInterval(tick); n = Math.min(92, n + 3 + Math.random() * 6); pct.textContent = String(n | 0); }, 90);
  if (heroImg.complete && heroImg.naturalWidth) terminarIntro(); else heroImg.addEventListener("load", terminarIntro);
  setTimeout(terminarIntro, 4000);   // pase lo que pase, no se queda clavada

  const cab = $(".cab"), menuBtn = $("#cab-menu");
  const menuAbierto = () => cab.classList.contains("abierta");
  function abrirMenu(si) {
    cab.classList.toggle("abierta", si); document.body.classList.toggle("menu-abierto", si);
    menuBtn.setAttribute("aria-expanded", si ? "true" : "false");
    $("#cab-menu-t").textContent = t(si ? "nav.cerrar" : "nav.menu");
    if (lenis) { if (si) lenis.stop(); else lenis.start(); }
  }
  menuBtn.addEventListener("click", () => abrirMenu(!menuAbierto()));
  $("#cab-fondo").addEventListener("click", () => abrirMenu(false));
  $$(".cab-lista a, .cab-marca, .cab-cta").forEach((a) => a.addEventListener("click", () => { if (menuAbierto()) abrirMenu(false); }));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && menuAbierto()) abrirMenu(false); });
  document.addEventListener("idioma-pintado", () => { $("#cab-menu-t").textContent = t(menuAbierto() ? "nav.cerrar" : "nav.menu"); });

  /* ── 5 · el hero: las líneas se trazan hasta formar la torre ───────────── */
  /* Leído cuadro por cuadro del video de la referencia y de la grabación de
     David. No es tinta que aparece: son TRAZOS que se dibujan a lo largo de su
     recorrido, muchos a la vez, en el orden en que dibuja un arquitecto —el
     contorno de la torre primero, después los pisos y el detalle, el entorno
     al final—. Después el boceto se vuelve un modelo de arcilla con el cielo
     detrás, los materiales entran desde el centro y queda el render; recién
     ahí aparece el título, tipográfico, «LA» y después «TORRE».

     Cómo se consigue el trazo con UN render y cero archivos:
       1. Sobel + supresión de no-máximos → la cresta de cada borde (1 px).
       2. Se siguen esas crestas píxel a píxel hasta armar polilíneas
          (cadenas de puntos): eso son los trazos.
       3. A cada trazo se le asigna un momento de inicio (distancia al eje de
          la torre, fuerza, largo, azar) y una duración a velocidad de pluma
          constante.
       4. En cada cuadro: los trazos terminados ya están rasterizados en un
          canvas persistente; sólo se dibujan parcialmente los que están en
          curso. Así el costo por cuadro no depende del tamaño del dibujo.
     El logotipo que viene quemado en el render se elimina rellenando por
     interpolación lo que hay detrás: el título ahora es texto de verdad. */
  const boceto = $(".hero-boceto");
  const heroSec = $(".hero");
  const heroTexto = $(".hero-texto");
  const LOGO = { la: { x0: 0.42, x1: 0.545, y0: 0.325, y1: 0.45 }, torre: { x0: 0.405, x1: 0.595, y0: 0.44, y1: 0.675 } };
  const EJE = { x: 0.43, y: 0.5 };
  // el dibujo termina a los 4,8 s y se SOSTIENE hasta los 5,7: en el video el
  // boceto completo se ve entero un momento antes de volverse arcilla
  const DUR = { lineas: 4.8, cotas: 1.5, arcilla: 1.2, materiales: 2.8, cierre: 0.6 };
  const INICIO = { lineas: 0, cotas: 2.9, arcilla: 5.7, materiales: 6.8, cierre: 9.6 };
  const TOTAL = INICIO.cierre + DUR.cierre;
  const esCelular = Math.min(screen.width, screen.height) < 700;
  let escena = null, tHero = 0, heroListo = false, heroTerminado = false, apurar = false, ultimoTs = null, preparando = false, tituloDisparado = false;

  const lienzo = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
  const suave = (x) => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
  const fase = (t, k) => suave((t - INICIO[k]) / DUR[k]);
  const clamp01 = (x) => x < 0 ? 0 : x > 1 ? 1 : x;
  const hash2 = (x, y) => { let h = (x * 374761393 + y * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };

  function prepararHero() {
    if (preparando || heroListo) return; preparando = true;
    const tPrep = performance.now();
    // Sin límite de peso, por pedido de David: en escritorio se trabaja a la
    // resolución nativa del render y el canvas va a la densidad de la pantalla.
    const W = Math.min(esCelular ? 1200 : 2400, heroImg.naturalWidth), H = Math.round(W * heroImg.naturalHeight / heroImg.naturalWidth);
    const base = lienzo(W, H), g = base.getContext("2d");
    g.drawImage(heroImg, 0, 0, W, H);
    const src = g.getImageData(0, 0, W, H).data;
    const N = W * H;
    const gris = new Float32Array(N);
    for (let i = 0, j = 0; i < src.length; i += 4, j++) gris[j] = src[i] * 0.299 + src[i + 1] * 0.587 + src[i + 2] * 0.114;

    // ── las letras del logotipo, píxel por píxel, dilatadas ──
    const enCaja = (x, y, c) => { const fx = x / W, fy = y / H; return fx > c.x0 && fx < c.x1 && fy > c.y0 && fy < c.y1; };
    const letra = new Uint8Array(N);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const j = y * W + x; if (gris[j] < 224) continue;
      if (enCaja(x, y, LOGO.la) || enCaja(x, y, LOGO.torre)) letra[j] = 1;
    }
    const letraD = new Uint8Array(N);
    for (let y = 2; y < H - 2; y++) for (let x = 2; x < W - 2; x++) {
      const j = y * W + x; if (!letra[j]) continue;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) letraD[j + dy * W + dx] = 1;
    }
    // ── el render sin letras ──
    const sinLetras = lienzo(W, H);
    const dsl = sinLetras.getContext("2d").createImageData(W, H);
    dsl.data.set(src);
    for (let y = 0; y < H; y++) {
      let x = 0;
      while (x < W) {
        if (!letraD[y * W + x]) { x++; continue; }
        let x2 = x; while (x2 < W && letraD[y * W + x2]) x2++;
        const izq = x > 0 ? x - 1 : (x2 < W ? x2 : x), der = x2 < W ? x2 : izq;
        const ki = (y * W + izq) * 4, kd = (y * W + der) * 4, n = x2 - x + 1;
        for (let xx = x; xx < x2; xx++) { const f = (xx - x + 1) / n, k = (y * W + xx) * 4; for (let c = 0; c < 3; c++) dsl.data[k + c] = src[ki + c] * (1 - f) + src[kd + c] * f; dsl.data[k + 3] = 255; }
        x = x2;
      }
    }
    sinLetras.getContext("2d").putImageData(dsl, 0, 0);
    const grisSin = new Float32Array(N);
    for (let j = 0; j < N; j++) { const k = j * 4; grisSin[j] = dsl.data[k] * 0.299 + dsl.data[k + 1] * 0.587 + dsl.data[k + 2] * 0.114; }

    // ── suavizado gaussiano antes de buscar bordes: mata el borde de cada
    //    ladrillo, cada hoja y cada listón, y deja los bordes de la arquitectura ──
    const gsuave = new Float32Array(N), tmpB = new Float32Array(N);
    const KER = [0.0625, 0.25, 0.375, 0.25, 0.0625];
    for (let y = 0; y < H; y++) for (let x = 2; x < W - 2; x++) { let v = 0; for (let k = -2; k <= 2; k++) v += grisSin[y * W + x + k] * KER[k + 2]; tmpB[y * W + x] = v; }
    for (let y = 2; y < H - 2; y++) for (let x = 0; x < W; x++) { let v = 0; for (let k = -2; k <= 2; k++) v += tmpB[(y + k) * W + x] * KER[k + 2]; gsuave[y * W + x] = v; }
    // segunda pasada: el render tiene mucho detalle fino
    for (let y = 0; y < H; y++) for (let x = 2; x < W - 2; x++) { let v = 0; for (let k = -2; k <= 2; k++) v += gsuave[y * W + x + k] * KER[k + 2]; tmpB[y * W + x] = v; }
    for (let y = 2; y < H - 2; y++) for (let x = 0; x < W; x++) { let v = 0; for (let k = -2; k <= 2; k++) v += tmpB[(y + k) * W + x] * KER[k + 2]; gsuave[y * W + x] = v; }

    // ── la máscara del edificio: el dibujo se concentra acá. Fuera de esto sólo
    //    entran líneas largas y rectas (las medianeras, la vereda), muy suaves.
    //    Los árboles no se dibujan: en el video el entorno apenas se sugiere. ──
    const EDIF = { x0: 0.285, x1: 0.615, y0: 0.0, y1: 1.0 };
    // la banda del parasol de listones: ahí un dibujante pone cuatro líneas,
    // no la trama. Sólo entran verticales largas.
    const PARASOL = { x0: 0.352, x1: 0.40, y0: 0.05, y1: 0.97 };
    const enParasol = (x, y) => { const fx = x / W, fy = y / H; return fx > PARASOL.x0 && fx < PARASOL.x1 && fy > PARASOL.y0 && fy < PARASOL.y1; };
    const enEdificio = (x, y) => { const fx = x / W, fy = y / H; return fx > EDIF.x0 && fx < EDIF.x1 && fy > EDIF.y0 && fy < EDIF.y1; };

    // ── la cresta de cada borde ──
    const mag = new Float32Array(N), dirq = new Uint8Array(N);
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      const gx = -gsuave[i - W - 1] + gsuave[i - W + 1] - 2 * gsuave[i - 1] + 2 * gsuave[i + 1] - gsuave[i + W - 1] + gsuave[i + W + 1];
      const gy = -gsuave[i - W - 1] - 2 * gsuave[i - W] - gsuave[i - W + 1] + gsuave[i + W - 1] + 2 * gsuave[i + W] + gsuave[i + W + 1];
      mag[i] = Math.sqrt(gx * gx + gy * gy) / 4;
      dirq[i] = Math.round(Math.atan2(gy, gx) / (Math.PI / 4)) & 3;
    }
    const tinta = new Float32Array(N), UMBRAL = 9;
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      const i = y * W + x, m = mag[i]; if (m < UMBRAL) continue;
      let a, b;
      switch (dirq[i]) { case 0: a = mag[i - 1]; b = mag[i + 1]; break; case 1: a = mag[i - W + 1]; b = mag[i + W - 1]; break; case 2: a = mag[i - W]; b = mag[i + W]; break; default: a = mag[i - W - 1]; b = mag[i + W + 1]; }
      if (m < a || m < b) continue;
      tinta[i] = clamp01((m - UMBRAL) / 70);
    }
    // el borde del cuadro no es un trazo: el detector veía el límite de la
    // imagen como una línea y la dibujaba de punta a punta (se notó al bajar
    // el encuadre: quedaba una raya oscura en la costura con el papel)
    const MARGEN = 6;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (y < MARGEN || y >= H - MARGEN || x < MARGEN || x >= W - MARGEN) tinta[y * W + x] = 0;
    // donde el trazo es una maraña (follaje) se aclara
    const dens = new Float32Array(N), R2 = 6;
    for (let y = R2; y < H - R2; y += 2) for (let x = R2; x < W - R2; x += 2) {
      let n = 0;
      for (let dy = -R2; dy <= R2; dy += 2) for (let dx = -R2; dx <= R2; dx += 2) if (tinta[(y + dy) * W + x + dx]) n++;
      const v = n / 49; dens[y * W + x] = v; dens[y * W + x + 1] = v; dens[(y + 1) * W + x] = v; dens[(y + 1) * W + x + 1] = v;
    }
    for (let i = 0; i < N; i++) {
      if (!tinta[i]) continue;
      const x = i % W, y = (i / W) | 0;
      // adentro, donde hay muchas líneas paralelas juntas (los listones del
      // parasol) se deja una sugerencia, no la trama entera
      if (enEdificio(x, y)) { if (dens[i] > 0.22) tinta[i] *= Math.max(0.15, 1 - (dens[i] - 0.22) * 2.6); }
      else if (dens[i] > 0.09) tinta[i] = 0;                  // afuera, lo denso es follaje: no se dibuja
    }

    // ── de crestas a TRAZOS: se siguen las cadenas de píxeles ──
    const visto = new Uint8Array(N);
    const vecinos = [-W - 1, -W, -W + 1, -1, 1, W - 1, W, W + 1];
    const dxs = [-1, 0, 1, -1, 1, -1, 0, 1], dys = [-1, -1, -1, 0, 0, 1, 1, 1];
    const grado = (i) => { let n = 0; for (let k = 0; k < 8; k++) if (tinta[i + vecinos[k]] > 0.03) n++; return n; };
    const trazos = [];
    const seguir = (inicio) => {
      const pts = []; let i = inicio, fuerza = 0, pdx = 0, pdy = 0;
      while (i >= 0 && !visto[i]) {
        visto[i] = 1; pts.push(i % W, (i / W) | 0); fuerza += tinta[i];
        // el vecino que mejor continúa la dirección que traía
        let mejor = -1, mejorPuntaje = -9;
        for (let k = 0; k < 8; k++) {
          const j = i + vecinos[k]; if (visto[j] || tinta[j] <= 0.03) continue;
          const puntaje = pdx * dxs[k] + pdy * dys[k] + (k === 1 || k === 3 || k === 4 || k === 6 ? 0.15 : 0);
          if (puntaje > mejorPuntaje) { mejorPuntaje = puntaje; mejor = k; }
        }
        if (mejor >= 0) { pdx = dxs[mejor]; pdy = dys[mejor]; i += vecinos[mejor]; continue; }
        // sin vecino directo: se salta UN píxel roto en la dirección que traía.
        // Sin esto la cresta se parte en pedacitos de diez píxeles y el dibujo
        // se lee como guiones que aparecen, no como líneas que se trazan.
        if (pdx === 0 && pdy === 0) break;
        let salto = -1, saltoPuntaje = -9;
        const x0 = i % W, y0 = (i / W) | 0;
        for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
          if (Math.abs(dx) < 2 && Math.abs(dy) < 2) continue;
          const xx = x0 + dx, yy = y0 + dy; if (xx < 1 || yy < 1 || xx >= W - 1 || yy >= H - 1) continue;
          const j = yy * W + xx; if (visto[j] || tinta[j] <= 0.03) continue;
          const l = Math.hypot(dx, dy), puntaje = (pdx * dx + pdy * dy) / l;
          if (puntaje > 0.6 && puntaje > saltoPuntaje) { saltoPuntaje = puntaje; salto = j; }
        }
        if (salto < 0) break;
        const nx = salto % W, ny = (salto / W) | 0;
        pdx = Math.sign(nx - x0); pdy = Math.sign(ny - y0); i = salto;
      }
      return { pts, fuerza: pts.length ? fuerza / (pts.length / 2) : 0 };
    };
    // Douglas–Peucker: la escalera de píxeles se vuelve regla. Es lo que separa
    // un trazo tembloroso de una línea de arquitecto.
    const simplificar = (pts, eps) => {
      const n = pts.length / 2; if (n < 3) return pts.slice();
      const keep = new Uint8Array(n); keep[0] = keep[n - 1] = 1;
      const pila = [[0, n - 1]];
      while (pila.length) {
        const [a, b] = pila.pop();
        const ax = pts[a * 2], ay = pts[a * 2 + 1], bx = pts[b * 2], by = pts[b * 2 + 1];
        const L = Math.hypot(bx - ax, by - ay) || 1e-6;
        let dmax = 0, idx = -1;
        for (let k = a + 1; k < b; k++) {
          const px = pts[k * 2], py = pts[k * 2 + 1];
          const d = Math.abs((bx - ax) * (ay - py) - (ax - px) * (by - ay)) / L;
          if (d > dmax) { dmax = d; idx = k; }
        }
        if (dmax > eps && idx > 0) { keep[idx] = 1; pila.push([a, idx], [idx, b]); }
      }
      const out = []; for (let k = 0; k < n; k++) if (keep[k]) out.push(pts[k * 2], pts[k * 2 + 1]);
      return out;
    };
    const esc = W / 1400;                    // los umbrales en píxeles se escalan con la resolución
    for (let pasada = 0; pasada < 2; pasada++) {
      for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
        const i = y * W + x; if (visto[i] || tinta[i] <= 0.03) continue;
        if (pasada === 0 && grado(i) !== 1) continue;
        const t = seguir(i);
        const n = t.pts.length / 2; if (n < 6) continue;
        let cx = 0, cy = 0; for (let k = 0; k < t.pts.length; k += 2) { cx += t.pts[k]; cy += t.pts[k + 1]; } cx /= n; cy /= n;
        t.dentro = enEdificio(cx, cy);
        // adentro: trazos de 14 px o más; afuera: sólo líneas largas (medianeras, vereda)
        if (t.dentro ? n < 14 * esc : n < 90 * esc) continue;
        if (enParasol(cx, cy)) {
          const x0 = t.pts[0], y0 = t.pts[1], x1 = t.pts[t.pts.length - 2], y1 = t.pts[t.pts.length - 1];
          if (n < 55 * esc || Math.abs(x1 - x0) > 0.22 * Math.abs(y1 - y0)) continue;   // corta o no vertical: afuera
          t.parasol = true;
        }
        const simp = simplificar(t.pts, t.dentro ? 1.1 * esc : 2.2 * esc);
        // afuera además tienen que ser casi rectas: nada de garabatos
        if (!t.dentro && simp.length / 2 > 6) continue;
        t.pts = simp; t.cx = cx; t.cy = cy;
        trazos.push(t);
      }
    }

    // ── el orden y el tiempo de cada trazo ──
    const ancla = { x: EJE.x * W, y: EJE.y * H };
    const dMax = Math.hypot(Math.max(ancla.x, W - ancla.x), Math.max(ancla.y, H - ancla.y));
    const VEL = W * 0.9;                           // px por segundo, antes de escalar al tiempo total
    // el largo real del trazo simplificado, en píxeles de recorrido
    trazos.forEach((t, idx) => {
      let L = 0; for (let k = 2; k < t.pts.length; k += 2) L += Math.hypot(t.pts[k] - t.pts[k - 2], t.pts[k + 1] - t.pts[k - 1]);
      t.largo = L;
      const d = Math.hypot((t.cx - ancla.x) * 0.75, (t.cy - ancla.y) * 0.55) / dMax;
      // adentro: el contorno y las losas primero (largo manda), arriba antes que
      // abajo, apenas de azar. Afuera: todo después del edificio.
      t.orden = t.dentro
        ? 0.18 * (t.cy / H) + 0.2 * (1 - t.fuerza) - 0.62 * Math.min(1, L / (420 * esc)) + 0.06 * hash2(idx, 7)
        : 1.2 + 0.5 * d + 0.1 * hash2(idx, 11);
      t.p = new Float32Array(t.pts); t.pts = null;
    });
    trazos.sort((a, b) => a.orden - b.orden);
    const M = trazos.length;
    const TD = DUR.lineas;
    // POCAS PLUMAS A LA VEZ. En el video se dibujan de a unas pocas líneas,
    // no cientos: acá arrancan 6 plumas y terminan 18. Cada trazo espera a que
    // su pluma se libere; después se escala todo para que entre en TD.
    const plumasMax = (r) => 6 + Math.floor(12 * r / Math.max(1, M - 1));
    const libres = [];
    trazos.forEach((t, r) => {
      const K = plumasMax(r);
      while (libres.length < K) libres.push(0);
      let k = 0; for (let j = 1; j < K; j++) if (libres[j] < libres[k]) k = j;
      t.dur = Math.max(0.12, t.largo / VEL);
      t.ini = libres[k]; t.fin = t.ini + t.dur;
      libres[k] = t.ini + t.dur * 0.82;              // apenas se solapan
    });
    const finTotal = trazos.reduce((m, t) => Math.max(m, t.fin), 0) || 1;
    const escalaT = (TD * 0.98) / finTotal;
    trazos.forEach((t) => { t.ini *= escalaT; t.dur *= escalaT; t.fin = t.ini + t.dur; });
    const porFin = trazos.slice().sort((a, b) => a.fin - b.fin);
    // las guías: las seis horizontales más largas del edificio se prolongan
    // a los costados en línea de puntos, como las líneas de nivel de un plano
    const guias = trazos.filter((t) => {
      if (!t.dentro) return false;
      const x0 = t.p[0], y0 = t.p[1], x1 = t.p[t.p.length - 2], y1 = t.p[t.p.length - 1];
      return Math.abs(y1 - y0) < 0.2 * Math.abs(x1 - x0) && t.largo > 90 * esc;
    }).sort((a, b) => b.largo - a.largo).slice(0, 6).map((t) => {
      const x0 = t.p[0], y0 = t.p[1], x1 = t.p[t.p.length - 2], y1 = t.p[t.p.length - 1];
      const m = (y1 - y0) / ((x1 - x0) || 1);
      return { fin: t.fin, xa: Math.min(x0, x1), xb: Math.max(x0, x1), ya: y0, m, base: x0 };
    });

    // ── la arcilla, el cielo, el papel, el ruido ──
    const arcilla = lienzo(W, H);
    const da = arcilla.getContext("2d").createImageData(W, H);
    for (let j = 0; j < N; j++) { const k = j * 4, v = 238 + (grisSin[j] - 128) * 0.2; da.data[k] = v + 4; da.data[k + 1] = v + 1; da.data[k + 2] = v - 6; da.data[k + 3] = 255; }
    arcilla.getContext("2d").putImageData(da, 0, 0);
    const cielo = lienzo(W, H); const gc = cielo.getContext("2d");
    gc.drawImage(sinLetras, 0, 0); gc.globalCompositeOperation = "destination-in";
    const grad = gc.createLinearGradient(0, H * 0.2, 0, H * 0.5); grad.addColorStop(0, "rgba(0,0,0,1)"); grad.addColorStop(1, "rgba(0,0,0,0)");
    gc.fillStyle = grad; gc.fillRect(0, 0, W, H);
    // el edificio NO deja pasar el cielo: en la etapa de arcilla la torre es
    // blanca y el cielo aparece sólo alrededor. La silueta sale de los propios
    // trazos, no de cajas: por columna, desde la primera franja densa de dibujo
    // hasta el piso. Así sigue la azotea escalonada y los bordes reales, y el
    // recorte deja de verse cuadrado (visto en captura del 3/9).
    const SW = 240, SH = Math.round(SW * H / W), cxS = W / SW, cyS = H / SH;
    const densS = new Float32Array(SW * SH);
    for (let i = 0; i < N; i++) if (tinta[i] > 0.15) { const x = i % W, y = (i / W) | 0; if (enEdificio(x, y)) densS[((y / cyS) | 0) * SW + ((x / cxS) | 0)] += 1; }
    const porCelda = cxS * cyS; for (let i = 0; i < densS.length; i++) densS[i] /= porCelda;
    const blurS = (arr, r) => { const out = new Float32Array(arr.length); for (let y = 0; y < SH; y++) for (let x = 0; x < SW; x++) { let sum = 0, n = 0; for (let yy = -r; yy <= r; yy++) for (let xx = -r; xx <= r; xx++) { const X = x + xx, Y = y + yy; if (X < 0 || X >= SW || Y < 0 || Y >= SH) continue; sum += arr[Y * SW + X]; n++; } out[y * SW + x] = sum / n; } return out; };
    const dd = blurS(blurS(densS, 1), 1);
    const UMB = 0.035, sil = new Float32Array(SW * SH);
    const columnaDensaDesde = (x, y0) => { for (let y = y0; y < SH; y++) { if (dd[y * SW + x] <= UMB) continue; let k = 0; for (let z = y; z < Math.min(SH, y + 8); z++) if (dd[z * SW + x] > UMB * 0.6) k++; if (k >= 5) return y; } return -1; };
    for (let x = 0; x < SW; x++) { const top = columnaDensaDesde(x, 0); if (top < 0) continue; for (let y = top; y < SH; y++) sil[y * SW + x] = 1; }
    // una pasada horizontal cierra los huecos de una columna suelta sin trazos (un vidrio oscuro)
    for (let y = 0; y < SH; y++) for (let x = 1; x < SW - 1; x++) if (!sil[y * SW + x] && sil[y * SW + x - 1] && sil[y * SW + x + 1]) sil[y * SW + x] = 1;
    const silSuave = blurS(blurS(sil, 2), 2);                 // la pluma del recorte, unos 35 px
    const silC = lienzo(SW, SH), gs = silC.getContext("2d"), ds = gs.createImageData(SW, SH);
    for (let i = 0; i < silSuave.length; i++) ds.data[i * 4 + 3] = Math.round(255 * silSuave[i]);
    gs.putImageData(ds, 0, 0);
    gc.globalCompositeOperation = "destination-out"; gc.imageSmoothingEnabled = true; gc.imageSmoothingQuality = "high";
    gc.drawImage(silC, 0, 0, W, H);
    gc.globalCompositeOperation = "source-over";
    const papel = lienzo(W, H); const gp = papel.getContext("2d");
    gp.fillStyle = "#F3EADA"; gp.fillRect(0, 0, W, H);
    const dpp = gp.getImageData(0, 0, W, H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const n = (hash2(x, y) * 9 | 0) - 4, k = (y * W + x) * 4; dpp.data[k] += n; dpp.data[k + 1] += n; dpp.data[k + 2] += n; }
    gp.putImageData(dpp, 0, 0);
    const NW = 160, NH = Math.round(160 * H / W);
    let ruido = new Float32Array(NW * NH);
    for (let y = 0; y < NH; y++) for (let x = 0; x < NW; x++) ruido[y * NW + x] = hash2(x + 99, y + 7);
    for (let paso = 0; paso < 3; paso++) {
      const r2 = new Float32Array(NW * NH);
      for (let y = 0; y < NH; y++) for (let x = 0; x < NW; x++) { let sum = 0, n = 0; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const yy = y + dy, xx = x + dx; if (yy < 0 || yy >= NH || xx < 0 || xx >= NW) continue; sum += ruido[yy * NW + xx]; n++; } r2[y * NW + x] = sum / n; }
      ruido = r2;
    }
    let mn = 1, mx = 0; ruido.forEach((v) => { if (v < mn) mn = v; if (v > mx) mx = v; });
    ruido = ruido.map((v) => (v - mn) / (mx - mn || 1));

    escena = { W, H, base: sinLetras, trazos, porFin, guias, esc, arcilla, cielo, papel, ruido, NW, NH, prepMs: Math.round(performance.now() - tPrep),
      hecho: lienzo(W, H), hechoHasta: 0, ultimoT: -1,
      mascara: lienzo(NW, NH), tmp: lienzo(W, H), out: lienzo(W, H) };
    heroListo = true;
  }

  /* dibuja un trazo, entero o hasta la fracción f, con presión de lapicera */
  function trazar(ctx, t, f) {
    const p = t.p, n = p.length / 2;
    if (n < 2) return;
    const e = escena, k = e.W / 1400;
    // fino y parejo, como una 0.3: el grosor no varía, el tono sí
    ctx.strokeStyle = t.parasol ? "rgba(41,33,26,0.5)" : t.dentro ? `rgba(41,33,26,${0.55 + 0.4 * t.fuerza})` : "rgba(41,33,26,0.28)";
    ctx.lineWidth = (t.dentro ? 1.1 : 0.9) * k;
    ctx.beginPath(); ctx.moveTo(p[0], p[1]);
    const fe = f >= 1 ? 1 : 1 - (1 - f) * (1 - f) * (1 - f * 0.4);   // arranca rápido, frena al llegar
    const hasta = f >= 1 ? n - 1 : (n - 1) * fe;
    const ent = Math.floor(hasta);
    for (let k = 1; k <= ent; k++) ctx.lineTo(p[k * 2], p[k * 2 + 1]);
    if (f < 1 && ent < n - 1) { const fr = hasta - ent; ctx.lineTo(p[ent * 2] + (p[ent * 2 + 2] - p[ent * 2]) * fr, p[ent * 2 + 1] + (p[ent * 2 + 3] - p[ent * 2 + 1]) * fr); }
    ctx.stroke();
  }

  function cotas(o, W, H, p, idiomaActual) {
    if (p <= 0) return;
    o.save(); o.globalAlpha = p * 0.42; o.strokeStyle = "#5a4a3c"; o.fillStyle = "#5a4a3c"; o.lineWidth = W / 1400;
    o.font = `${Math.round(W * 0.0105)}px Archivo, sans-serif`;
    const tick = (x, y, v) => { o.beginPath(); if (v) { o.moveTo(x - 5, y); o.lineTo(x + 5, y); } else { o.moveTo(x, y - 5); o.lineTo(x, y + 5); } o.stroke(); };
    const xA = W * 0.62, y0 = H * 0.07, y1 = H * 0.9;
    o.beginPath(); o.moveTo(xA, y0); o.lineTo(xA, y0 + (y1 - y0) * p); o.stroke(); tick(xA, y0, true); if (p > 0.95) tick(xA, y1, true);
    o.save(); o.translate(xA + 6, (y0 + y1) / 2); o.rotate(-Math.PI / 2); o.textAlign = "center";
    o.fillText(idiomaActual === "en" ? "6 floors" : idiomaActual === "pt" ? "6 andares" : "6 plantas", 0, 0); o.restore();
    const xs0 = W * 0.31, xs1 = W * 0.56, ys = H * 0.035;
    o.beginPath(); o.moveTo(xs0, ys); o.lineTo(xs0 + (xs1 - xs0) * p, ys); o.stroke(); tick(xs0, ys, false); if (p > 0.95) tick(xs1, ys, false);
    o.textAlign = "center"; o.fillText("37 – 55 m²", (xs0 + xs1) / 2, ys - 6);
    o.textAlign = "left"; o.fillText("Aniceto Latorre", W * 0.08, H * 0.965);
    o.beginPath(); o.moveTo(W * 0.08, H * 0.975); o.lineTo(W * 0.08 + W * 0.22 * p, H * 0.975); o.stroke();
    o.restore();
  }

  function mascaraMateriales(p) {
    const { NW, NH, ruido, mascara, W, H } = escena;
    const img = mascara.getContext("2d").createImageData(NW, NH);
    const cx = EJE.x, cy = 0.55, R = p * 1.35, pluma = 0.28;
    for (let y = 0; y < NH; y++) for (let x = 0; x < NW; x++) {
      const fx = x / NW, fy = y / NH, d = Math.hypot((fx - cx) * (W / H), fy - cy) / 1.1;
      const a = clamp01((R - d) / pluma + (ruido[y * NW + x] - 0.5) * 0.7), k = (y * NW + x) * 4;
      img.data[k] = img.data[k + 1] = img.data[k + 2] = 0; img.data[k + 3] = a * 255;
    }
    mascara.getContext("2d").putImageData(img, 0, 0);
    return mascara;
  }

  function pintarHero(t) {
    const e = escena, { W, H } = e;
    const o = e.out.getContext("2d");
    o.globalCompositeOperation = "source-over"; o.globalAlpha = 1;
    o.drawImage(e.papel, 0, 0);

    // 1 · los trazos: los terminados viven en `hecho`; los que están en curso se dibujan parciales
    const h = e.hecho.getContext("2d");
    if (t < e.ultimoT) { h.clearRect(0, 0, W, H); e.hechoHasta = 0; }   // se volvió atrás (capturas)
    e.ultimoT = t;
    h.lineCap = "round"; h.lineJoin = "round";
    while (e.hechoHasta < e.porFin.length && e.porFin[e.hechoHasta].fin <= t) { trazar(h, e.porFin[e.hechoHasta], 1); e.hechoHasta++; }
    o.drawImage(e.hecho, 0, 0);
    o.lineCap = "round"; o.lineJoin = "round";
    let enCurso = 0;
    for (let k = e.hechoHasta; k < e.porFin.length; k++) {
      const tr = e.porFin[k];
      if (tr.ini > t) continue;                 // todavía no arranca (porFin no está ordenado por inicio: se recorre)
      const f = (t - tr.ini) / tr.dur; if (f <= 0) continue;
      trazar(o, tr, Math.min(1, f)); enCurso++;
      if (enCurso > 1200) break;                 // tope de seguridad por cuadro
    }
    // las guías se extienden cuando su losa termina, y se van con la arcilla
    const vivas = 1 - fase(t, "arcilla");
    if (vivas > 0) {
      o.save(); o.strokeStyle = "rgba(41,33,26,0.22)"; o.lineWidth = e.esc * 0.9; o.setLineDash([5 * e.esc, 7 * e.esc]); o.lineCap = "butt";
      e.guias.forEach((g) => {
        const p = clamp01((t - g.fin) / 0.9); if (p <= 0) return;
        o.globalAlpha = vivas * p;
        const ext = W * 0.34 * p;
        const y = (x) => g.ya + (x - g.base) * g.m;
        o.beginPath(); o.moveTo(g.xa, y(g.xa)); o.lineTo(g.xa - ext, y(g.xa - ext)); o.stroke();
        o.beginPath(); o.moveTo(g.xb, y(g.xb)); o.lineTo(g.xb + ext, y(g.xb + ext)); o.stroke();
      });
      o.restore(); o.globalAlpha = 1;
    }
    const pC = fase(t, "cotas") * (1 - fase(t, "arcilla"));
    cotas(o, W, H, pC, idioma);

    // 3 · la arcilla con el cielo detrás
    const pA = fase(t, "arcilla");
    e.fundido = pA;                                   // el fundido al papel de arriba sólo cuando hay cielo (ver presentar)
    if (pA > 0) { o.globalAlpha = pA * 0.94; o.drawImage(e.arcilla, 0, 0); o.globalAlpha = pA; o.drawImage(e.cielo, 0, 0); o.globalAlpha = 1; }
    // 4 · los materiales
    const pM = fase(t, "materiales");
    if (pM > 0) {
      const m = mascaraMateriales(pM), t2 = e.tmp.getContext("2d");
      t2.clearRect(0, 0, W, H); t2.globalCompositeOperation = "source-over"; t2.drawImage(e.base, 0, 0);
      t2.globalCompositeOperation = "destination-in"; t2.imageSmoothingEnabled = true; t2.drawImage(m, 0, 0, W, H);
      o.drawImage(e.tmp, 0, 0);
    }
  }

  function presentar() {
    const e = escena, vw = boceto.clientWidth, vh = boceto.clientHeight;
    // con la pestaña oculta el canvas puede medir 0×0: no se toca, y cuando
    // vuelva a verse se repinta (resize / visibilitychange)
    if (!vw || !vh) return;
    const dpr = Math.min(2, devicePixelRatio || 1);          // a la densidad real de la pantalla
    const pw = Math.round(vw * dpr), ph = Math.round(vh * dpr);
    if (boceto.width !== pw || boceto.height !== ph) { boceto.width = pw; boceto.height = ph; }
    // el cuadro baja una franja (16 % del alto): la azotea y su cota quedan a la
    // vista debajo de la cabecera, y arriba el cielo sigue con las primeras
    // filas del propio cuadro estiradas (pedido del 3/9: «bajar un poco el hero»)
    const franja = Math.round(ph * 0.16);
    const esc = Math.max(pw / e.W, (ph - franja) / e.H), dw = e.W * esc, dh = e.H * esc, dx = (pw - dw) / 2, dy = franja;
    const g = boceto.getContext("2d"); g.imageSmoothingQuality = "high"; g.clearRect(0, 0, pw, ph);
    // la franja de arriba es papel, y el cuadro se funde al papel en un borde
    // corto: el render queda montado en la hoja, como el boceto. (Estirar o
    // reflejar las primeras filas del cuadro arrastraba la antena y el techo.)
    g.drawImage(e.papel, dx, dy - dh, dw, dh);                // el mismo papel con grano: sin costura en el boceto
    g.drawImage(e.out, dx, dy, dw, dh);
    if (e.fundido > 0) {
      const fundido = Math.round(ph * 0.05);
      const gr = g.createLinearGradient(0, franja - 1, 0, franja + fundido);
      gr.addColorStop(0, "rgba(243,234,218,1)"); gr.addColorStop(1, "rgba(243,234,218,0)");
      g.globalAlpha = e.fundido; g.fillStyle = gr; g.fillRect(0, franja - 1, pw, fundido + 1); g.globalAlpha = 1;
    }
  }

  /* el título aparece cuando el render está casi entero: «LA», y después «TORRE» */
  function dispararTitulo() {
    if (tituloDisparado) return; tituloDisparado = true;
    heroSec.classList.add("claro"); document.body.classList.add("hero-claro");
    heroTexto.classList.add("visible");
    if (window.gsap && !reduce) {
      const letras = $$(".hero-titulo .letra:not(.esp)");
      gsap.set(letras, { yPercent: 70, opacity: 0 });
      gsap.to(letras.slice(0, 2), { yPercent: 0, opacity: 1, duration: .9, ease: "power3.out", stagger: 0.08 });
      gsap.to(letras.slice(2), { yPercent: 0, opacity: 1, duration: .9, ease: "power3.out", stagger: 0.07, delay: 0.55 });
      gsap.from(".hero-rotulo, .hero-bajada, .hero-ctas, .hero-pista", { y: 14, opacity: 0, duration: .8, ease: "power2.out", stagger: 0.08, delay: 1.1 });
    }
  }
  function terminarHero() {
    if (heroTerminado) return; heroTerminado = true;
    dispararTitulo();
    // el canvas se queda: es el render sin el logotipo quemado. La imagen de abajo no se vuelve a ver.
  }
  function bucleHero(ts) {
    if (!heroListo) { requestAnimationFrame(bucleHero); return; }
    if (ultimoTs == null) ultimoTs = ts;
    const dt = Math.min(0.05, (ts - ultimoTs) / 1000); ultimoTs = ts;
    tHero += dt * (apurar ? 6 : 1);
    pintarHero(tHero); presentar();
    if (fase(tHero, "materiales") > 0.8) dispararTitulo();
    if (tHero >= TOTAL) { terminarHero(); return; }
    requestAnimationFrame(bucleHero);
  }
  function arrancarHero() {
    if (reduce) { boceto.style.display = "none"; heroSec.classList.add("claro"); document.body.classList.add("hero-claro"); heroTexto.classList.add("visible"); heroTerminado = true; return; }
    if (!heroListo) prepararHero();
    const apurarYa = () => { apurar = true; };
    addEventListener("wheel", apurarYa, { passive: true, once: true });
    addEventListener("touchstart", apurarYa, { passive: true, once: true });
    boceto.addEventListener("click", apurarYa, { once: true });
    requestAnimationFrame(bucleHero);
  }
  const sinPreparar = /[?&]sinpreparar/.test(location.search);   // sólo para medir el cálculo desde la consola
  if (!reduce && !sinPreparar) { if (heroImg.complete && heroImg.naturalWidth) setTimeout(prepararHero, 0); else heroImg.addEventListener("load", () => setTimeout(prepararHero, 0)); }
  addEventListener("resize", () => { if (heroListo) presentar(); });
  document.addEventListener("visibilitychange", () => { if (heroListo && !document.hidden) presentar(); });

  /* ── 6 · scroll suave, títulos partidos, parallax ──────────────────────── */
  let lenis = null;
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    // `?sinlenis` apaga el scroll suave: sirve para depurar y como salida para
    // quien lo prefiera nativo. Con reduced-motion tampoco se enciende.
    const sinLenis = /[?&]sinlenis/.test(location.search);
    if (!reduce && !sinLenis && window.Lenis) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      // los anclas del menú pasan por Lenis, si no saltan sin animar
      $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
        const el = $(a.getAttribute("href")); if (!el) return;
        e.preventDefault(); lenis.scrollTo(el, { offset: -92 });
      }));
    }

    // el hero ya no depende del scroll: se reproduce solo al cargar. Lo único
    // atado al scroll es saber cuándo se lo dejó atrás.
    ScrollTrigger.create({ trigger: ".hero", start: "bottom 60%", onEnter: () => document.body.classList.add("paso-el-hero"), onLeaveBack: () => document.body.classList.remove("paso-el-hero") });

    // títulos partidos: cada letra entra cuando el título llega a la vista
    $$(".partir").forEach((el) => {
      const texto = el.textContent;
      el.setAttribute("aria-label", texto);
      el.innerHTML = texto.split(/(\s+)/).map((pal) => /\s+/.test(pal) ? " " : `<span class="p" style="display:inline-block;white-space:nowrap">${[...pal].map((c) => `<span class="l" aria-hidden="true">${c}</span>`).join("")}</span>`).join("");
      if (reduce) return;
      gsap.from(el.querySelectorAll(".l"), {
        yPercent: 80, opacity: 0, duration: .8, ease: "power3.out", stagger: 0.018,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });
    // OJO: al cambiar de idioma el texto se repinta y las letras se pierden;
    // pintarIdioma vuelve a partir. Se hace después de cada repintado.
    const partirDeNuevo = () => $$(".partir").forEach((el) => {
      if (el.querySelector(".l")) return;
      const texto = el.textContent; el.setAttribute("aria-label", texto);
      el.innerHTML = texto.split(/(\s+)/).map((pal) => /\s+/.test(pal) ? " " : `<span class="p" style="display:inline-block;white-space:nowrap">${[...pal].map((c) => `<span class="l" aria-hidden="true">${c}</span>`).join("")}</span>`).join("");
    });
    document.addEventListener("idioma-pintado", partirDeNuevo);

    // parallax suave en las imágenes marcadas
    if (!reduce) $$(".parallax-lento").forEach((el) => {
      gsap.fromTo(el, { yPercent: 4 }, { yPercent: -4, ease: "none", scrollTrigger: { trigger: el.closest("section"), start: "top bottom", end: "bottom top", scrub: true } });
    });
    if (!reduce) $$(".parallax").forEach((img) => {
      gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });


    // la burbuja de WhatsApp se esconde donde ya hay un botón grande
    ScrollTrigger.create({ trigger: "#contacto", start: "top 65%", end: "bottom top", onToggle: (st) => document.body.classList.toggle("en-contacto", st.isActive) });

    // las partidas: la lista entra escalonada y la palabra grande sube
    $$(".partida").forEach((sec) => {
      gsap.from($$(".partida-lista li", sec), { y: 18, opacity: 0, duration: .7, ease: "power2.out", stagger: .09, scrollTrigger: { trigger: sec, start: "top 70%", once: true } });
      gsap.from($(".partida-palabra", sec), { yPercent: 40, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: sec, start: "top 60%", once: true } });
    });
    // el marco de adentro se abre al llegar: la máscara pasa de un óvalo a la caja entera
    const marco = $("#adentro-marco");
    if (marco) gsap.fromTo(marco, { clipPath: "inset(12% 16% round 220px)" }, { clipPath: "inset(0% 0% round 18px)", ease: "none", scrollTrigger: { trigger: marco, start: "top 90%", end: "top 30%", scrub: true } });
  } else {
    document.body.classList.add("paso-el-hero");
  }
  // arranca cuando termina la intro (o ya, si la intro ya se fue)
  if (cargado) arrancarHero(); else document.addEventListener("intro-terminada", arrancarHero, { once: true });

  /* ── 7 · tipologías, unidades, A/B, 3D ─────────────────────────────────── */
  let tipoActiva = TIPOS[0].clave;
  const resLista = $("#res-lista");
  TIPOS.forEach((tp) => {
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.type = "button"; b.setAttribute("role", "tab"); b.textContent = tp.nombre; b.dataset.tipo = tp.clave;
    b.addEventListener("click", () => pintarTipologia(tp.clave));
    li.appendChild(b); resLista.appendChild(li);
  });
  let fotoActiva = "a";
  function pintarTipologia(clave) {
    const cambia = clave !== tipoActiva;
    tipoActiva = clave;
    const tp = TIPOS.find((x) => x.clave === clave);
    $$("button", resLista).forEach((b) => b.setAttribute("aria-selected", b.dataset.tipo === clave ? "true" : "false"));
    $("#res-desc").textContent = t("tipo." + clave + ".desc");
    $("#res-amb").textContent = t("tipo." + clave + ".amb");
    $("#res-ubic").textContent = t("tipo." + clave + ".ubic");
    // la foto entra por fundido: dos imágenes que se alternan
    const entra = $(cambia ? (fotoActiva === "a" ? "#res-img-b" : "#res-img-a") : "#res-img-" + fotoActiva);
    const sale = $(cambia ? "#res-img-" + fotoActiva : (fotoActiva === "a" ? "#res-img-b" : "#res-img-a"));
    if (entra.getAttribute("src") !== tp.render) entra.src = tp.render;
    entra.alt = tp.nombre + " — " + t("tipo.renderPie");
    entra.classList.add("activa"); sale.classList.remove("activa");
    if (cambia) fotoActiva = fotoActiva === "a" ? "b" : "a";
    $("#res-lamina-img").src = tp.lamina; $("#res-lamina-img").alt = tp.nombre;
    $("#res-lamina-pie").textContent = tp.nombre + " · " + t("tipo.laminaPie");
    $("#res-consultar").addEventListener("click", () => { const u = UNIDADES.find((x) => slugDe(x.tip) === clave); if (u) $("#form-unidad").value = u.id; }, { once: true });
  }
  const tipoIdx = () => TIPOS.findIndex((x) => x.clave === tipoActiva);
  $("#res-prev").addEventListener("click", () => pintarTipologia(TIPOS[(tipoIdx() + TIPOS.length - 1) % TIPOS.length].clave));
  $("#res-next").addEventListener("click", () => pintarTipologia(TIPOS[(tipoIdx() + 1) % TIPOS.length].clave));
  $("#res-lamina-btn").addEventListener("click", () => { $("#res-lamina").hidden = false; });
  $("#res-lamina-cerrar").addEventListener("click", () => { $("#res-lamina").hidden = true; });
  function pintarContador() { $("#res-libres").textContent = String(UNIDADES.filter((u) => u.estado === "libre").length); }

  function pintarUnidades() {
    pintarContador();
    ["Norte", "Sur"].forEach((torre) => {
      const cont = $("#pisos-" + torre.toLowerCase()); cont.innerHTML = "";
      UNIDADES.filter((u) => u.torre === torre).sort((a, b) => b.piso - a.piso).forEach((u) => {
        const b = document.createElement("button");
        b.type = "button"; b.className = "unidad " + u.estado;
        b.innerHTML = `<b>${u.piso}.º ${u.id.slice(-1)}</b><small>${u.tip} · ${t("tipo." + slugDe(u.tip) + ".desc").split(" · ")[0]}</small><span class="m2">${u.sup} m²</span><i class="${u.estado}" title="${t("estado." + u.estado)}"></i>`;
        b.addEventListener("click", () => abrirFicha(u));
        cont.appendChild(b);
      });
    });
    const sel = $("#form-unidad"); const actual = sel.value;
    sel.innerHTML = `<option value="">${t("contacto.sinUnidad")}</option>` + UNIDADES.map((u) => `<option value="${u.id}">${u.piso}.º ${u.id.slice(-1)} · ${u.tip} · ${u.sup} m²</option>`).join("");
    if (actual) sel.value = actual;
  }

  /* la ficha de la unidad */
  let fichaU = null, fichaVista = "render";
  const fichaTexto = (u) => `${u.piso}.º ${u.id.slice(-1)} · ${t(u.torre === "Norte" ? "torre.norte" : "torre.sur")}`;
  function pintarFicha() {
    if (!fichaU) return;
    const u = fichaU, tp = TIPOS.find((x) => x.clave === slugDe(u.tip)) || TIPOS[0];
    const img = $("#ficha-img");
    img.src = fichaVista === "lamina" ? tp.lamina : tp.render;
    img.alt = u.tip + " — " + t(fichaVista === "lamina" ? "tipo.laminaPie" : "tipo.renderPie");
    img.classList.toggle("lamina", fichaVista === "lamina");
    $$(".ficha-vistas button").forEach((b) => b.setAttribute("aria-selected", b.dataset.vista === fichaVista ? "true" : "false"));
    $("#ficha-torre").textContent = t(u.torre === "Norte" ? "torre.norte" : "torre.sur");
    $("#ficha-titulo").textContent = `${u.piso}.º ${u.id.slice(-1)}`;
    const est = $("#ficha-estado"); est.textContent = t("estado." + u.estado); est.className = "ficha-estado " + u.estado;
    $("#ficha-tip").textContent = u.tip + " · " + t("tipo." + tp.clave + ".desc").split(" · ")[0];
    $("#ficha-sup").textContent = u.sup + " m²";
    $("#ficha-amb").textContent = t("tipo." + tp.clave + ".amb");
    $("#ficha-piso").textContent = String(u.piso);
    $("#ficha-nota").textContent = t("ficha." + u.estado);
    $("#ficha-wa").href = wa(t("wa.unidad").replace("{u}", fichaTexto(u)));
  }
  function abrirFicha(u) {
    fichaU = u; fichaVista = "render"; pintarFicha();
    $("#ficha").hidden = false; $("#ficha-fondo").hidden = false;
    void $("#ficha").offsetWidth; // fuerza el reflow para que la transición arranque desde afuera
    $("#ficha").classList.add("visible"); $("#ficha-fondo").classList.add("visible");
    document.body.classList.add("con-ficha"); if (lenis) lenis.stop();
    $("#ficha-cerrar").focus();
  }
  function cerrarFicha() {
    $("#ficha").classList.remove("visible"); $("#ficha-fondo").classList.remove("visible");
    document.body.classList.remove("con-ficha"); if (lenis) lenis.start();
    setTimeout(() => { $("#ficha").hidden = true; $("#ficha-fondo").hidden = true; }, 450);
  }
  $("#ficha-cerrar").addEventListener("click", cerrarFicha);
  $("#ficha-fondo").addEventListener("click", cerrarFicha);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#ficha").hidden) cerrarFicha(); });
  $$(".ficha-vistas button").forEach((b) => b.addEventListener("click", () => { fichaVista = b.dataset.vista; pintarFicha(); }));
  $("#ficha-consultar").addEventListener("click", () => { if (fichaU) $("#form-unidad").value = fichaU.id; cerrarFicha(); setTimeout(() => irA("#contacto"), 80); });
  $("#ficha-wa").addEventListener("click", () => clic("whatsapp", "ficha-" + (fichaU ? fichaU.id : "")));
  document.addEventListener("idioma-pintado", pintarFicha);


  /* adentro: los ambientes pasan solos, con un paneo lento, sólo mientras se ven */
  const marcoAd = $("#adentro-marco");
  if (marcoAd) {
    const imgs = $$(".adentro-img", marcoAd), puntos = $("#adentro-puntos");
    const PIES = ["adentro.estar", "vida.cocina", "vida.suite", "vida.terraza"];
    let ai = 0, timer = null;
    const irAImagen = (i) => {
      ai = i; imgs.forEach((im, k) => im.classList.toggle("activa", k === i));
      $$("button", puntos).forEach((b, k) => b.setAttribute("aria-current", k === i ? "true" : "false"));
      $("#adentro-t").textContent = t(PIES[i] + ".t"); $("#adentro-p").textContent = t(PIES[i] + ".p");
    };
    const reiniciar = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => irAImagen((ai + 1) % imgs.length), 5200); };
    imgs.forEach((_, i) => { const b = document.createElement("button"); b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-label", t(PIES[i] + ".t")); b.addEventListener("click", () => { irAImagen(i); reiniciar(); }); puntos.appendChild(b); });
    irAImagen(0);
    new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) reiniciar(); else clearInterval(timer); }), { threshold: .3 }).observe(marcoAd);
    document.addEventListener("idioma-pintado", () => irAImagen(ai));
  }

  const slugDe = (n) => n.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  function irA(sel) { const el = $(sel); if (!el) return; if (lenis) lenis.scrollTo(el, { offset: -92 }); else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); }

  // el estado real, del CRM; si no contesta, queda el respaldo
  fetch(CFG.crm + "/api/publico/propiedades?cartera=" + encodeURIComponent(CFG.cartera), { headers: { Accept: "application/json" } })
    .then((r) => r.ok ? r.json() : null)
    .then((j) => {
      if (!j) return;
      const ps = Array.isArray(j) ? j : j.propiedades || [];
      const map = ps.map((p) => {
        const armado = p.piso != null && p.unidad ? String(p.piso) + String(p.unidad) : "";
        const id = (armado || String(p.codigo || "")).toUpperCase().match(/[0-9][AB]/)?.[0];
        if (!id) return null;
        const base = RESPALDO.find((r) => r.id === id) || {};
        return { id, piso: p.piso ?? +id[0], torre: id[1] === "A" ? "Norte" : "Sur", tip: p.tipologia || base.tip || "", sup: p.supTotal ?? base.sup ?? 0,
          estado: p.estado === "VENDIDA" ? "vendida" : p.estado === "RESERVADA" ? "reservada" : "libre" };
      }).filter(Boolean);
      if (map.length) { UNIDADES = map; pintarUnidades(); }
    }).catch(() => {});

  let abActivo = "norte";
  function pintarAB(cual) {
    abActivo = cual;
    $$(".ab-btn").forEach((b) => b.setAttribute("aria-pressed", b.dataset.ab === cual ? "true" : "false"));
    $("#ab-texto").textContent = t("desdeArriba." + cual);
  }
  $$(".ab-btn").forEach((b) => b.addEventListener("click", () => pintarAB(b.dataset.ab)));

  // el 3D se carga cuando se pide: es el asset más pesado de la página
  $("#tresd-arrancar").addEventListener("click", () => {
    const marco = $("#tresd-marco");
    const f = document.createElement("iframe");
    f.src = CFG.tresd; f.title = t("tresD.titulo"); f.loading = "eager"; f.allow = "fullscreen";
    marco.appendChild(f); $("#tresd-arrancar").remove();
    clic("whatsapp_visita", "3d");   // se registra que alguien abrió el 3D
  });

  /* ── 8 · el CRM: visita, clics y consulta ──────────────────────────────── */
  const ctx = { campania: CFG.campaniaPorDefecto, origen: "directo" };
  try {
    const p = new URLSearchParams(location.search);
    ctx.campania = p.get("utm_campaign") || p.get("c") || ctx.campania;
    ctx.origen = p.get("utm_source") || p.get("o") || "directo";
  } catch (e) {}
  const cabeceras = () => ({ "Content-Type": "application/json", "x-sitio-clave": CFG.clave });
  const idGuardado = (donde, llave) => { try { let v = donde.getItem(llave); if (!v) { v = llave[0] + Math.random().toString(36).slice(2, 12) + Date.now().toString(36); donde.setItem(llave, v); } return v; } catch (e) { return null; } };
  const atribucion = () => ({ visitanteId: idGuardado(localStorage, "latorre_visitante"), utm_campaign: ctx.campania || null, utm_source: ctx.origen || null, referrer: document.referrer || null, dispositivo: innerWidth < 768 ? "celular" : "escritorio", idioma });
  function visita() {
    if (!CFG.clave) return;
    const cuerpo = JSON.stringify({ sesionId: idGuardado(sessionStorage, "sesion_latorre") || "s" + Math.random().toString(36).slice(2, 14), consentimiento: "si", ...atribucion(), paginaEntrada: location.href, zonaHoraria: (Intl.DateTimeFormat().resolvedOptions().timeZone || "").slice(0, 64) || null });
    fetch(CFG.crm + "/api/publico/visitas", { method: "POST", headers: cabeceras(), body: cuerpo, keepalive: true }).catch(() => {});
  }
  // los `tipo` que acepta el CRM son un enum cerrado: lo que no está no se manda
  const TIPOS_CLIC = ["whatsapp", "whatsapp_visita", "whatsapp_directo", "llamar", "correo", "instagram", "linkedin"];
  function clic(tipo, dato) {
    if (!CFG.clave || !TIPOS_CLIC.includes(tipo)) return;
    const cuerpo = JSON.stringify({ tipo, propiedadCodigo: $("#form-unidad")?.value || null, ...atribucion(), pagina: location.href + (dato ? "#" + dato : "") });
    fetch(CFG.crm + "/api/publico/clics", { method: "POST", headers: cabeceras(), body: cuerpo, keepalive: true }).catch(() => {});
  }
  const wa = (msg) => "https://wa.me/" + CFG.whatsapp + "?text=" + encodeURIComponent(msg);
  function enlacesWhatsApp() {
    ["#wa-contacto", "#wa-pie", "#wa-flotante"].forEach((s) => { const a = $(s); if (a) a.href = wa(t("wa.hola")); });
  }
  $$("#wa-contacto, #wa-pie, #wa-flotante").forEach((a) => a.addEventListener("click", () => clic("whatsapp", a.id)));

  const form = $("#form"), aviso = $("#form-aviso"), btn = $("#form-enviar");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = new FormData(form);
    if (f.get("empresa")) return;   // la trampa para bots
    const nombre = String(f.get("nombre") || "").trim(), tel = String(f.get("telefono") || "").trim();
    if (nombre.length < 2 || tel.length < 6) { form.reportValidity(); return; }
    btn.disabled = true; btn.textContent = t("contacto.enviando");
    const unidad = String(f.get("unidad") || "");
    const cuerpo = { nombre, telefono: tel, interes: unidad ? "Edificio La Torre — unidad " + unidad : "Edificio La Torre", mensaje: String(f.get("mensaje") || "") || null, canal: "PORTAL", utm_campaign: ctx.campania || null, utm_source: ctx.origen || null, paginaConsulta: location.href, dispositivo: innerWidth < 768 ? "celular" : "escritorio", idioma };
    try {
      const r = await fetch(CFG.crm + "/api/publico/consultas", { method: "POST", headers: cabeceras(), body: JSON.stringify(cuerpo) });
      if (!r.ok) throw new Error("crm");
      aviso.hidden = false; aviso.className = "form-aviso"; aviso.textContent = t("contacto.ok"); form.reset();
    } catch (err) {
      aviso.hidden = false; aviso.className = "form-aviso mal";
      aviso.innerHTML = t("contacto.fallo").replace("WhatsApp", `<a href="${wa(unidad ? t("wa.unidad", { u: unidad }) : t("wa.hola"))}" target="_blank" rel="noreferrer">WhatsApp</a>`);
    }
    btn.disabled = false; btn.textContent = t("contacto.enviar");
  });

  /* ── 9 · cookies: consentimiento por navegación, un solo botón ─────────── */
  const ck = $("#cookies");
  try { if (localStorage.getItem("latorre_cookies") !== "visto") ck.hidden = false; } catch (e) { ck.hidden = false; }
  $("#cookies-ok").addEventListener("click", () => { ck.hidden = true; try { localStorage.setItem("latorre_cookies", "visto"); } catch (e) {} });

  /* ── arranque ──────────────────────────────────────────────────────────── */
  pintarIdioma();
  document.dispatchEvent(new Event("idioma-pintado"));
  visita();
  window.PORTADA = { hero: { pintar: pintarHero, presentar, listo: () => heroListo, escena: () => escena, preparar: prepararHero, TOTAL, DUR, INICIO }, lenis: () => lenis, DICC, pintarIdioma, cambiarIdioma: (i) => { idioma = i; pintarIdioma(); document.dispatchEvent(new Event("idioma-pintado")); }, UNIDADES: () => UNIDADES };
})();
