/* ══════════════════════════════════════════════════════════════════════════
   LA TORRE — portada nueva. Un solo archivo, sin framework.

   Secciones de este archivo:
     1 · configuración y datos (CRM, unidades de respaldo, tipologías)
     2 · el diccionario ES / EN / PT — todo el texto visible vive acá
     3 · i18n: pintar el idioma y el conmutador
     4 · la intro y la cabecera
     5 · el hero: del boceto al render, al ritmo del scroll
     6 · scroll suave (Lenis) + títulos partidos + parallax (GSAP)
     7 · tipologías, unidades, A/B, la visita horizontal, el 3D
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
    tresd: "../volumen.html",
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
    { clave:"horizonte", nombre:"Horizonte", lamina:"../../img/plano-tipologia-1-horizonte.jpg", render:"../../img/render-tipologia-1.jpg", foto:"../../img/area-dormitorio.jpg" },
    { clave:"evolucion", nombre:"Evolución", lamina:"../../img/plano-tipologia-2-evolucion.jpg", render:"../../img/render-tipologia-2.jpg", foto:"../../img/area-terraza.jpg" },
    { clave:"esencia",   nombre:"Esencia",   lamina:"../../img/plano-tipologia-3-esencia.jpg",   render:"../../img/render-tipologia-3.jpg", foto:"../../img/area-suite.jpg" },
    { clave:"cuspide",   nombre:"Cúspide",   lamina:"../../img/plano-tipologia-4-cuspide.jpg",   render:"../../img/render-tipologia-4.jpg", foto:"../../img/area-estar.jpg" },
  ];
  let UNIDADES = RESPALDO.slice();
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── 2 · el diccionario ────────────────────────────────────────────────── */
  const DICC = {
    es: {
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

  const cab = $(".cab"), hamb = $(".hamb");
  hamb.addEventListener("click", () => {
    const abierto = document.body.classList.toggle("menu-abierto");
    hamb.setAttribute("aria-expanded", abierto ? "true" : "false");
  });
  $$(".cab-nav a").forEach((a) => a.addEventListener("click", () => { document.body.classList.remove("menu-abierto"); hamb.setAttribute("aria-expanded", "false"); }));
  addEventListener("keydown", (e) => { if (e.key === "Escape") { document.body.classList.remove("menu-abierto"); hamb.setAttribute("aria-expanded", "false"); } });

  /* ── 5 · el hero: de cero al render, en cinco etapas ───────────────────── */
  /* Leído cuadro por cuadro del video de la referencia (15,6 s, se reproduce
     solo al cargar, sin scroll) y de la grabación de David:
       1) el dibujo NACE DE CERO: las líneas se van uniendo en el orden en que
          dibuja un arquitecto — el contorno principal de la torre, después
          los pisos, después el detalle, y el entorno al final —, con cotas
          fantasma;
       2) el boceto completo;
       3) un modelo de arcilla blanco con el cielo apareciendo detrás;
       4) los materiales que entran desde el centro con una máscara suave;
       5) el render final, y recién ahí el logotipo: primero «LA», después
          «TORRE».
     Todo se calcula en la página a partir de UN render. El logotipo viene
     quemado en el JPG, así que se fabrica un render sin letras rellenando por
     interpolación lo que hay detrás, y las letras reales se dibujan al final.

     CÓMO SE ORDENA EL DIBUJO. A cada píxel de tinta se le asigna un momento
     de aparición: pesa la distancia al eje de la torre (lo cercano primero),
     la fuerza del trazo (lo fuerte primero) y un poco de azar para que no
     parezca un barrido. Ese momento se reparte en bandas, cada banda es una
     capa, y en cada cuadro se dibujan las bandas que ya llegaron. Así el
     costo por cuadro son N drawImage y no un millón de píxeles. */
  const boceto = $(".hero-boceto");
  const heroSec = $(".hero");
  const heroTexto = $(".hero-texto");
  const LOGO = { la: { x0: 0.42, x1: 0.545, y0: 0.325, y1: 0.45 }, torre: { x0: 0.405, x1: 0.595, y0: 0.44, y1: 0.675 } };
  const EJE = { x: 0.43, y: 0.5 };                 // el eje de la torre en el hero, para ordenar el dibujo
  const DUR = { lineas: 4.6, cotas: 1.6, arcilla: 1.4, materiales: 2.9, la: 0.7, torre: 0.9, cierre: 0.7 };
  const INICIO = { lineas: 0, cotas: 2.2, arcilla: 4.5, materiales: 5.6, la: 8.6, torre: 9.3, cierre: 10.2 };
  const TOTAL = INICIO.cierre + DUR.cierre;
  const esCelular = innerWidth < 900;
  const BANDAS = esCelular ? 12 : 20;
  let escena = null, tHero = 0, heroListo = false, heroTerminado = false, apurar = false, ultimoTs = null, preparando = false;

  const lienzo = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
  const suave = (x) => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);
  const fase = (t, k) => suave((t - INICIO[k]) / DUR[k]);
  const clamp01 = (x) => x < 0 ? 0 : x > 1 ? 1 : x;

  function prepararHero() {
    if (preparando || heroListo) return; preparando = true;
    const W = Math.min(esCelular ? 900 : 1400, heroImg.naturalWidth), H = Math.round(W * heroImg.naturalHeight / heroImg.naturalWidth);
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
      if (enCaja(x, y, LOGO.la)) letra[j] = 1; else if (enCaja(x, y, LOGO.torre)) letra[j] = 2;
    }
    const letraD = new Uint8Array(N);
    for (let y = 2; y < H - 2; y++) for (let x = 2; x < W - 2; x++) {
      const j = y * W + x; if (!letra[j]) continue;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const k = j + dy * W + dx; if (!letraD[k]) letraD[k] = letra[j]; }
    }

    // ── el render SIN letras: cada corrida de letra se rellena interpolando en su fila ──
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
        for (let xx = x; xx < x2; xx++) {
          const f = (xx - x + 1) / n, k = (y * W + xx) * 4;
          for (let c = 0; c < 3; c++) dsl.data[k + c] = src[ki + c] * (1 - f) + src[kd + c] * f;
          dsl.data[k + 3] = 255;
        }
        x = x2;
      }
    }
    sinLetras.getContext("2d").putImageData(dsl, 0, 0);
    const grisSin = new Float32Array(N);
    for (let j = 0; j < N; j++) { const k = j * 4; grisSin[j] = dsl.data[k] * 0.299 + dsl.data[k + 1] * 0.587 + dsl.data[k + 2] * 0.114; }

    // ── la tinta: Sobel + supresión de no-máximos, para que el trazo sea una línea y no una mancha ──
    const mag = new Float32Array(N), dirq = new Uint8Array(N);
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      const i = y * W + x;
      const gx = -grisSin[i - W - 1] + grisSin[i - W + 1] - 2 * grisSin[i - 1] + 2 * grisSin[i + 1] - grisSin[i + W - 1] + grisSin[i + W + 1];
      const gy = -grisSin[i - W - 1] - 2 * grisSin[i - W] - grisSin[i - W + 1] + grisSin[i + W - 1] + 2 * grisSin[i + W] + grisSin[i + W + 1];
      mag[i] = Math.sqrt(gx * gx + gy * gy) / 4;
      const ang = Math.atan2(gy, gx);                        // -π..π
      const q = Math.round(ang / (Math.PI / 4)) & 3;           // 0: horizontal, 1: diag, 2: vertical, 3: diag
      dirq[i] = q;
    }
    const tinta = new Float32Array(N);                          // 0..1
    const UMBRAL = 11;
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      const i = y * W + x, m = mag[i]; if (m < UMBRAL) continue;
      let a, b;
      switch (dirq[i]) { case 0: a = mag[i - 1]; b = mag[i + 1]; break; case 1: a = mag[i - W + 1]; b = mag[i + W - 1]; break; case 2: a = mag[i - W]; b = mag[i + W]; break; default: a = mag[i - W - 1]; b = mag[i + W + 1]; }
      if (m < a || m < b) continue;                             // no es la cresta del borde
      tinta[i] = clamp01((m - UMBRAL) / 70);
    }

    // ── donde hay demasiado trazo junto (las copas de los árboles) la tinta se
    //    aclara: un dibujante no rellena una copa a rayas, la sugiere ──
    const dens = new Float32Array(N);
    const R2 = 6;
    for (let y = R2; y < H - R2; y += 2) for (let x = R2; x < W - R2; x += 2) {
      let n = 0;
      for (let dy = -R2; dy <= R2; dy += 2) for (let dx = -R2; dx <= R2; dx += 2) if (tinta[(y + dy) * W + x + dx]) n++;
      const v = n / 49;
      dens[y * W + x] = v; dens[y * W + x + 1] = v; dens[(y + 1) * W + x] = v; dens[(y + 1) * W + x + 1] = v;
    }
    for (let i = 0; i < N; i++) if (tinta[i] && dens[i] > 0.2) tinta[i] *= Math.max(0.12, 1 - (dens[i] - 0.2) * 2.2);

    // ── el momento de aparición de cada píxel de tinta ──
    // distancia al eje de la torre (0 en el eje, 1 en el borde más lejano),
    // fuerza del trazo (lo fuerte primero) y azar. Después se normaliza por
    // rango para que cada banda tenga más o menos la misma cantidad de tinta.
    const momento = new Float32Array(N);
    const ancla = { x: EJE.x * W, y: EJE.y * H };
    const dMax = Math.hypot(Math.max(ancla.x, W - ancla.x), Math.max(ancla.y, H - ancla.y));
    const hist = new Uint32Array(1024); let total = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x; if (!tinta[i]) continue;
      const d = Math.hypot((x - ancla.x) * 0.75, (y - ancla.y) * 0.55) / dMax;   // la torre es alta: la distancia vertical pesa menos
      const fuerza = 1 - tinta[i];
      const azar = ((x * 7919 + y * 104729) % 1000) / 1000;
      const m = 0.58 * d + 0.27 * fuerza + 0.15 * azar;
      momento[i] = m; hist[Math.min(1023, (m * 1023) | 0)]++; total++;
    }
    const acum = new Float32Array(1024); let corr = 0;
    for (let k = 0; k < 1024; k++) { corr += hist[k]; acum[k] = corr / (total || 1); }

    // ── las bandas: una capa por banda, con la tinta que le toca ──
    const capas = [];
    const datos = [];
    for (let k = 0; k < BANDAS; k++) { const c = lienzo(W, H); capas.push(c); datos.push(c.getContext("2d").createImageData(W, H)); }
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x; if (!tinta[i]) continue;
      const r = acum[Math.min(1023, (momento[i] * 1023) | 0)];  // 0..1 por rango
      // r^0.55: la primera banda tiene menos del 1 % de la tinta —el dibujo
      // nace de cero— y la última carga un sexto. (Con r^1.5 era al revés:
      // la primera banda se llevaba el 19 % y el dibujo arrancaba ya armado.)
      const k = Math.min(BANDAS - 1, (Math.pow(r, 0.55) * BANDAS) | 0);
      const d = datos[k].data, o = i * 4;
      d[o] = 41; d[o + 1] = 33; d[o + 2] = 26; d[o + 3] = 90 + tinta[i] * 165;   // presión de lapicera
    }
    capas.forEach((c, k) => c.getContext("2d").putImageData(datos[k], 0, 0));

    // ── la arcilla, ya sin letras ──
    const arcilla = lienzo(W, H);
    const da = arcilla.getContext("2d").createImageData(W, H);
    const letrasLa = lienzo(W, H), letrasTorre = lienzo(W, H);
    const dl = letrasLa.getContext("2d").createImageData(W, H), dt = letrasTorre.getContext("2d").createImageData(W, H);
    for (let j = 0; j < N; j++) {
      const k = j * 4;
      const v = 238 + (grisSin[j] - 128) * 0.2;
      da.data[k] = v + 4; da.data[k + 1] = v + 1; da.data[k + 2] = v - 6; da.data[k + 3] = 255;
      const cap = letraD[j] === 1 ? dl : letraD[j] === 2 ? dt : null;
      if (cap) { cap.data[k] = src[k]; cap.data[k + 1] = src[k + 1]; cap.data[k + 2] = src[k + 2]; cap.data[k + 3] = 255; }
    }
    arcilla.getContext("2d").putImageData(da, 0, 0);
    letrasLa.getContext("2d").putImageData(dl, 0, 0);
    letrasTorre.getContext("2d").putImageData(dt, 0, 0);

    // el cielo aparece detrás de la arcilla
    const cielo = lienzo(W, H); const gc = cielo.getContext("2d");
    gc.drawImage(sinLetras, 0, 0);
    gc.globalCompositeOperation = "destination-in";
    const grad = gc.createLinearGradient(0, H * 0.2, 0, H * 0.5);
    grad.addColorStop(0, "rgba(0,0,0,1)"); grad.addColorStop(1, "rgba(0,0,0,0)");
    gc.fillStyle = grad; gc.fillRect(0, 0, W, H);

    // ── el papel: crema con un grano apenas visible ──
    const papel = lienzo(W, H); const gp = papel.getContext("2d");
    gp.fillStyle = "#F3EADA"; gp.fillRect(0, 0, W, H);
    const dpp = gp.getImageData(0, 0, W, H);
    // un hash que mezcla x e y: con uno lineal el grano salía como rayas diagonales
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let h = (x * 374761393 + y * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); h = (h ^ (h >>> 16)) >>> 0;
      const n = (h % 9) - 4, k = (y * W + x) * 4;
      dpp.data[k] += n; dpp.data[k + 1] += n; dpp.data[k + 2] += n;
    }
    gp.putImageData(dpp, 0, 0);

    // ── el ruido de la máscara de materiales ──
    const NW = 160, NH = Math.round(160 * H / W);
    let ruido = new Float32Array(NW * NH);
    for (let i = 0; i < ruido.length; i++) ruido[i] = ((i * 2654435761) >>> 0) % 1000 / 1000;
    for (let paso = 0; paso < 3; paso++) {
      const r2 = new Float32Array(NW * NH);
      for (let y = 0; y < NH; y++) for (let x = 0; x < NW; x++) {
        let sum = 0, n = 0;
        for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const yy = y + dy, xx = x + dx; if (yy < 0 || yy >= NH || xx < 0 || xx >= NW) continue; sum += ruido[yy * NW + xx]; n++; }
        r2[y * NW + x] = sum / n;
      }
      ruido = r2;
    }
    let mn = 1, mx = 0; ruido.forEach((v) => { if (v < mn) mn = v; if (v > mx) mx = v; });
    ruido = ruido.map((v) => (v - mn) / (mx - mn || 1));

    escena = { W, H, base: sinLetras, capas, arcilla, cielo, papel, ruido, NW, NH, letrasLa, letrasTorre,
      mascara: lienzo(NW, NH), tmp: lienzo(W, H), out: lienzo(W, H) };
    heroListo = true;
  }

  /* las cotas fantasma del dibujo: sólo datos reales del proyecto */
  function cotas(o, W, H, p, idiomaActual) {
    if (p <= 0) return;
    o.save();
    o.globalAlpha = p * 0.55;
    o.strokeStyle = "#5a4a3c"; o.fillStyle = "#5a4a3c"; o.lineWidth = 1;
    o.font = `${Math.round(W * 0.011)}px Archivo, sans-serif`;
    const tick = (x, y, v) => { o.beginPath(); if (v) { o.moveTo(x - 5, y); o.lineTo(x + 5, y); } else { o.moveTo(x, y - 5); o.lineTo(x, y + 5); } o.stroke(); };
    // la altura: seis plantas
    const xA = W * 0.62, y0 = H * 0.07, y1 = H * 0.9;
    o.beginPath(); o.moveTo(xA, y0); o.lineTo(xA, y0 + (y1 - y0) * p); o.stroke();
    tick(xA, y0, true); if (p > 0.95) tick(xA, y1, true);
    o.save(); o.translate(xA + 6, (y0 + y1) / 2); o.rotate(-Math.PI / 2); o.textAlign = "center";
    o.fillText(idiomaActual === "en" ? "6 floors" : idiomaActual === "pt" ? "6 andares" : "6 plantas", 0, 0); o.restore();
    // las superficies
    const xs0 = W * 0.31, xs1 = W * 0.56, ys = H * 0.035;
    o.beginPath(); o.moveTo(xs0, ys); o.lineTo(xs0 + (xs1 - xs0) * p, ys); o.stroke();
    tick(xs0, ys, false); if (p > 0.95) tick(xs1, ys, false);
    o.textAlign = "center"; o.fillText("37 – 55 m²", (xs0 + xs1) / 2, ys - 6);
    // la calle
    o.textAlign = "left"; o.fillText("Aniceto Latorre", W * 0.08, H * 0.965);
    o.beginPath(); o.moveTo(W * 0.08, H * 0.975); o.lineTo(W * 0.08 + W * 0.22 * p, H * 0.975); o.stroke();
    o.restore();
  }

  function mascaraMateriales(p) {
    const { NW, NH, ruido, mascara, W, H } = escena;
    const img = mascara.getContext("2d").createImageData(NW, NH);
    const cx = EJE.x, cy = 0.55, R = p * 1.35, pluma = 0.28;
    for (let y = 0; y < NH; y++) for (let x = 0; x < NW; x++) {
      const fx = x / NW, fy = y / NH;
      const d = Math.hypot((fx - cx) * (W / H), fy - cy) / 1.1;
      const a = clamp01((R - d) / pluma + (ruido[y * NW + x] - 0.5) * 0.7);
      const k = (y * NW + x) * 4;
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

    // 1 · las líneas se van uniendo, banda por banda
    const pL = fase(t, "lineas");
    const pos = pL * BANDAS;
    for (let k = 0; k < BANDAS; k++) {
      const a = clamp01(pos - k);                 // cada banda entra en su ranura
      if (a <= 0) break;
      o.globalAlpha = a; o.drawImage(e.capas[k], 0, 0);
    }
    o.globalAlpha = 1;
    // las cotas aparecen a mitad del dibujo y se van con la arcilla
    const pC = fase(t, "cotas") * (1 - fase(t, "arcilla"));
    cotas(o, W, H, pC, idioma);

    // 3 · la arcilla, con el cielo detrás
    const pA = fase(t, "arcilla");
    if (pA > 0) {
      o.globalAlpha = pA * 0.94; o.drawImage(e.arcilla, 0, 0);
      o.globalAlpha = pA; o.drawImage(e.cielo, 0, 0);
      o.globalAlpha = 1;
    }
    // 4 · los materiales
    const pM = fase(t, "materiales"), pLa = fase(t, "la"), pTo = fase(t, "torre");
    if (pM > 0) {
      const m = mascaraMateriales(pM);
      const t2 = e.tmp.getContext("2d");
      t2.clearRect(0, 0, W, H); t2.globalCompositeOperation = "source-over";
      t2.drawImage(e.base, 0, 0);
      t2.globalCompositeOperation = "destination-in"; t2.imageSmoothingEnabled = true;
      t2.drawImage(m, 0, 0, W, H);
      o.drawImage(e.tmp, 0, 0);
    }
    // 5 · el logotipo, al final: LA y después TORRE
    if (pLa > 0) { o.globalAlpha = pLa; o.drawImage(e.letrasLa, 0, 0); }
    if (pTo > 0) { o.globalAlpha = pTo; o.drawImage(e.letrasTorre, 0, 0); }
    o.globalAlpha = 1;
  }

  function presentar() {
    const e = escena;
    const vw = boceto.clientWidth, vh = boceto.clientHeight;
    if (boceto.width !== vw || boceto.height !== vh) { boceto.width = vw; boceto.height = vh; }
    const esc = Math.max(vw / e.W, vh / e.H);
    const dw = e.W * esc, dh = e.H * esc, dx = (vw - dw) / 2, dy = (vh - dh) * 0.30;
    const g = boceto.getContext("2d");
    g.clearRect(0, 0, vw, vh); g.drawImage(e.out, dx, dy, dw, dh);
  }

  function terminarHero() {
    if (heroTerminado) return;
    heroTerminado = true;
    boceto.style.transition = "opacity .7s ease"; boceto.style.opacity = "0";
    heroSec.classList.add("claro"); document.body.classList.add("hero-claro");
    heroTexto.classList.add("visible");
    if (window.gsap && !reduce) gsap.from(".hero-texto > *", { y: 18, opacity: 0, duration: .9, ease: "power2.out", stagger: 0.1 });
    setTimeout(() => { boceto.style.display = "none"; }, 800);
  }

  function bucleHero(ts) {
    if (!heroListo) { requestAnimationFrame(bucleHero); return; }
    if (ultimoTs == null) ultimoTs = ts;
    const dt = Math.min(0.05, (ts - ultimoTs) / 1000); ultimoTs = ts;
    tHero += dt * (apurar ? 6 : 1);
    pintarHero(tHero); presentar();
    if (fase(tHero, "materiales") > 0.55) { heroSec.classList.add("claro"); document.body.classList.add("hero-claro"); }
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
  // el cálculo pesado se hace mientras corre el contador de la intro, no después
  if (!reduce) { if (heroImg.complete && heroImg.naturalWidth) setTimeout(prepararHero, 0); else heroImg.addEventListener("load", () => setTimeout(prepararHero, 0)); }
  addEventListener("resize", () => { if (heroListo && !heroTerminado) presentar(); });

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
        e.preventDefault(); lenis.scrollTo(el, { offset: -72 });
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
    if (!reduce) $$(".parallax").forEach((img) => {
      gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });

    // la cabecera se vuelve sólida al dejar el hero
    ScrollTrigger.create({ start: "top -60", onUpdate: (st) => cab.classList.toggle("solida", st.scroll() > 60) });
    ScrollTrigger.create({ trigger: "#inicio", start: "bottom 70%", onEnter: () => cab.classList.add("solida"), onLeaveBack: () => cab.classList.remove("solida") });

    // la burbuja de WhatsApp se esconde donde ya hay un botón grande
    ScrollTrigger.create({ trigger: "#contacto", start: "top 65%", end: "bottom top", onToggle: (st) => document.body.classList.toggle("en-contacto", st.isActive) });

    // la visita, horizontal y pinneada
    const riel = $("#visita-riel");
    if (!reduce && riel) {
      const recorrido = () => riel.scrollWidth - innerWidth;
      gsap.to(riel, { x: () => -recorrido(), ease: "none",
        scrollTrigger: { trigger: "#vida", start: "top top", end: () => "+=" + recorrido(), pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 } });
    }
  } else {
    document.body.classList.add("paso-el-hero");
  }
  // arranca cuando termina la intro (o ya, si la intro ya se fue)
  if (cargado) arrancarHero(); else document.addEventListener("intro-terminada", arrancarHero, { once: true });

  /* ── 7 · tipologías, unidades, A/B, 3D ─────────────────────────────────── */
  let tipoActiva = TIPOS[0].clave;
  const solapas = $("#solapas-tipo");
  TIPOS.forEach((tp) => {
    const b = document.createElement("button");
    b.type = "button"; b.role = "tab"; b.textContent = tp.nombre; b.dataset.tipo = tp.clave;
    b.addEventListener("click", () => pintarTipologia(tp.clave));
    solapas.appendChild(b);
  });
  function pintarTipologia(clave) {
    tipoActiva = clave;
    const tp = TIPOS.find((x) => x.clave === clave);
    $$("button", solapas).forEach((b) => b.setAttribute("aria-selected", b.dataset.tipo === clave ? "true" : "false"));
    $("#tipo-lamina").src = tp.lamina; $("#tipo-lamina").alt = tp.nombre;
    $("#tipo-lamina-pie").textContent = t("tipo.laminaPie");
    $("#tipo-nombre").textContent = tp.nombre;
    $("#tipo-desc").textContent = t("tipo." + clave + ".desc");
    $("#tipo-amb").textContent = t("tipo." + clave + ".amb");
    $("#tipo-ubic").textContent = t("tipo." + clave + ".ubic");
    $("#tipo-render").src = tp.render; $("#tipo-render").alt = tp.nombre;
    $("#tipo-render-pie").textContent = t("tipo.renderPie");
  }

  function pintarUnidades() {
    ["Norte", "Sur"].forEach((torre) => {
      const cont = $("#pisos-" + torre.toLowerCase()); cont.innerHTML = "";
      UNIDADES.filter((u) => u.torre === torre).sort((a, b) => b.piso - a.piso).forEach((u) => {
        const b = document.createElement("button");
        b.type = "button"; b.className = "unidad " + u.estado;
        b.innerHTML = `<b>${u.piso}.º ${u.id.slice(-1)}</b><small>${u.tip} · ${t("tipo." + slugDe(u.tip) + ".desc").split(" · ")[0]}</small><span class="m2">${u.sup} m²</span><i class="${u.estado}" title="${t("estado." + u.estado)}"></i>`;
        b.addEventListener("click", () => { $("#form-unidad").value = u.id; irA("#contacto"); });
        cont.appendChild(b);
      });
    });
    const sel = $("#form-unidad"); const actual = sel.value;
    sel.innerHTML = `<option value="">${t("contacto.sinUnidad")}</option>` + UNIDADES.map((u) => `<option value="${u.id}">${u.piso}.º ${u.id.slice(-1)} · ${u.tip} · ${u.sup} m²</option>`).join("");
    if (actual) sel.value = actual;
  }
  const slugDe = (n) => n.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  function irA(sel) { const el = $(sel); if (!el) return; if (lenis) lenis.scrollTo(el, { offset: -72 }); else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); }

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
  window.PORTADA = { hero: { pintar: pintarHero, presentar, listo: () => heroListo, escena: () => escena, preparar: prepararHero, TOTAL }, lenis: () => lenis, DICC, pintarIdioma, cambiarIdioma: (i) => { idioma = i; pintarIdioma(); document.dispatchEvent(new Event("idioma-pintado")); }, UNIDADES: () => UNIDADES };
})();
