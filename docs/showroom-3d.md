# El showroom 3D de La Torre — qué se puede, qué cuesta y en qué orden

> Relevamiento del **2026-09-02**. Cinco frentes investigados en paralelo, con los pesos y los
> precios medidos y no estimados. Es un documento para decidir, no para construir: acá no se
> escribió una línea de código del showroom.

---

## Lo primero, para que no pierdas el día de mañana

**Fable 5.1 no genera video ni imágenes.** Es un modelo de razonamiento y código. Escribe el
parallax, el crossfade, el shader de nubes, el scrub del canvas, el mapa de polígonos y hasta el
script de Python que corre el modelo de profundidad. No puede entregarte un render nocturno ni un
clip de nubes.

Probarlo *"en vez de pagar Higgsfield"* es comparar dos cosas distintas: **Fable no reemplaza a
Higgsfield, reemplaza al programador.** La regla para mañana, y sirve para todo:

> Todo lo que sea **código y geometría de movimiento** se lo pedís al modelo.
> Todo lo que sea **pixel nuevo** sale del arquitecto, de Photoshop, o de un motor de video.

Y sobre Higgsfield puntualmente: **su precio no se pudo verificar**. La página de precios la arma
JavaScript y no se puede leer; los blogs que la indexan se contradicen entre sí (USD 9, USD 19,
USD 47, USD 59). No va a ningún presupuesto hasta que alguien entre y saque captura.

---

## Lo que pediste son cinco cosas distintas

Conviene separarlas, porque tienen dependencias muy distintas y una sola de ellas es la cara:

| # | Qué | Depende de |
|---|---|---|
| 1 | La cámara se planta de frente y el edificio gira | Cuadros de una órbita, o el modelo 3D |
| 2 | Día → noche con el sol que se va y las ventanas que se prenden | **Un render nocturno** del mismo encuadre |
| 3 | Nubes que se mueven | Nada: el material ya está |
| 4 | Ver piso por piso y elegir la unidad | Nada nuevo, pero hay un bloqueante (abajo) |
| 5 | Recorrer la unidad por dentro | **Panorámicas 360** renderizadas del modelo |

**Sólo la 3 y la 4 se pueden hacer con lo que hay hoy.** Las otras tres necesitan material que
todavía no existe, y ninguna cantidad de código lo fabrica.

---

## La bifurcación que decide todo

### No hay modelo 3D, y 26 renders no son un modelo

Los renders son salidas de un modelo, no el modelo. Ningún motor —three.js, model-viewer,
Babylon, el que sea— puede mostrar un edificio sin geometría. Y una imagen plana de 2200×1237
**no se convierte** en una panorámica equirectangular: son cosas distintas, hay que volver a
renderizar.

**Lo que hay que pedirle al arquitecto**, en este orden de valor:

1. **El render nocturno de la fachada, con el encuadre exacto de `hero-cover.jpg`.** Es el que
   más resultado da por lo que cuesta. Ojo: `img/render-nocturno.jpg` está mal nombrado — es el
   pasillo de acceso a plena luz del día. Hoy no existe la mitad nocturna.
2. **El archivo del modelo** (SketchUp, Revit, 3ds Max) para exportarlo a glTF/GLB. SketchUp 2026
   exporta glTF de fábrica; Revit necesita un plugin; 3ds Max exporta directo.
3. **De 60 a 120 cuadros de una órbita** alrededor de la torre. Es lo que da el giro sin modelo.
4. **Panorámicas equirectangulares** de una tipología: cámara esférica, FOV 360×180, relación
   2:1, y **el viñeteo apagado** (si no, queda una costura vertical visible). Alcanzan 3 a 5 por
   unidad: estar, cocina, dormitorio, baño y balcón. En Enscape sale en segundos; en V-Ray o
   Corona tarda mucho más.
5. **El hero sin el logotipo quemado adentro.** Hoy «LA TORRE» está pintado en el JPG: si separás
   el render en capas, el texto se mueve con ellas.

---

## La competencia no hace 3D, y eso es una buena noticia

Se abrieron seis plataformas en producción y se leyeron los bundles. **Ninguno de los showrooms
comerciales del rubro es 3D de verdad.**

| Plataforma | Con qué está hecho | Peso | Precio |
|---|---|---|---|
| **Winbuild** (el líder en Argentina) | MP4 pre-renderizados, uno por transición de cámara, más un JPG por piso con un polígono SVG encima. Sin three.js, sin babylon, sin un solo `.glb` | **97 MB** para ver el edificio, 121 MB con los pisos abiertos | USD 3.000-5.000 de setup + USD 200-300/mes |
| **Web3D** | La misma receta, y la deja documentada en un `project.json` público: 3 posiciones de cámara (0°, 120°, 240°), 6 videos de transición, y un SVG de 910 bytes con un `<polygon>` trazado en Illustrator | 35 MB el giro completo | — |
| **Torre Tale** (Praux3D) | El que mencionaste. Es un tour 3DVista de panorámicas cosidas en cubemap, no 3D | 14,6 MB y 129 pedidos sólo para la primera vista | USD 499 pago único, self-hosting permitido |
| **Shapespark** | Acá sí hay 3D real, con motor WebGL propio | — | El self-hosting sólo desde **USD 249/mes** |
| **Unreal Pixel Streaming** | Lo único que hace literalmente todo lo que pediste, porque hay un motor renderizando de verdad | Video en vivo | USD 29/mes con **300 minutos totales** sumando todos los visitantes, después USD 0,10/min. Una campaña de Meta con 500 visitas de 3 minutos son 1.500 minutos |
| **Matterport** | El estándar del recorrido 3D real | — | Se descarta **por física, no por plata**: escanea espacios construidos, y la Torre está en pozo |

**Dos hallazgos que valen plata:**

- **Ni Winbuild ni Web3D tienen transición día/noche.** Se verificó grepeando los dos bundles: los
  únicos «night» son cadenas de idioma de una librería de fechas y un nombre de ícono. Es lo más
  barato de todo lo que pediste, y **ninguno de los dos lo tiene**. Ese es el diferenciador.
- **El único material que te falta para replicar la mecánica entera de Winbuild es el video de
  rotación.** Los polígonos SVG y los renders por sección los podés hacer hoy.

---

## El camino por etapas

Ordenado por relación resultado/esfuerzo, no por espectacularidad.

### Etapa 1 · El explorador de pisos — se puede empezar esta semana

Es lo que en el rubro se llama *site plan interactivo*, y en producción siempre es lo mismo: un
`<svg>` encima del `<img>`, con el `viewBox` igual a las dimensiones intrínsecas de la imagen y
`preserveAspectRatio="none"`. Así los polígonos siguen a la foto de 320 px a 4K **sin un solo
listener de resize**. Se leyó el DOM en vivo de un showcase real y es exactamente eso.

- **No hay librería que haga esto y no hace falta.** Todo el mundo lo escribe a mano. Las que
  existen son sólo de pan/zoom (`svg-pan-zoom`, 8 KB gzip) y acá no se necesitan.
- **`<map>`/`<area>` está descartado**: sus coordenadas son píxeles CSS absolutos, así que se
  desalinean apenas la imagen escala.
- **Canvas también**: recién conviene arriba de ~1.000 formas. Acá son 12.
- **Y los polígonos no hay que dibujarlos a mano.** La elevación de fachada es ortográfica, con un
  paso de piso perfectamente regular de 222 px (medido por autocorrelación, fuerza 0,757). La
  grilla sale por fórmula.

**Peso**: la fachada convertida a WebP pesa **36 KB** sirviendo 750 px al celular (hoy son 503 KB
en JPG). El explorador entero pesa menos que una sola foto del sitio.

**Lo que hay que resolver antes**, y es un bloqueante duro: el sitio dice «12 unidades · 6 plantas
por torre» y **la elevación muestra 8 niveles residenciales**. Con dos columnas por nivel serían
16, no 12. Es la misma contradicción por la que hoy se sacó esa lámina del avance de obra. Un
explorador de pisos hace pública esa contradicción, así que primero se confirma con Francisco
cuántas plantas y cuántas unidades por planta hay de verdad.

**Cómo se conecta con el sistema**: el estado de cada unidad vive en `contenido/unidades.json`
dentro del repo y se pinta en el primer render sin esperar a nadie; recién después un `fetch` al
CRM lo actualiza si contesta. Si el CRM está caído, el edificio se ve igual con el último estado
conocido en vez de quedar sin colores. Encaja con la regla de que toda web nace editable.

### Etapa 2 · El día y la noche — el diferenciador, y es barato

Son unas 30 líneas de CSS sin ninguna librería. **El código no es el problema: falta el render
nocturno.**

Tres detalles que hacen la diferencia entre que se vea bien o berreta:

- **Usá `opacity`, no `mask-mode: luminance`.** Ese modo no es Baseline: MDN dice textual que no
  funciona en algunos de los navegadores más usados. Dos imágenes apiladas con opacity andan en
  todo y pesan cero.
- **Las ventanas encendidas van como tercera capa, no adentro del fade.** Un PNG con alfa que
  tenga sólo las ventanas y los apliques, en modo `screen`, con su propio timing escalonado. Si va
  todo junto, el ojo lee un cambio de brillo; separado, se siente que el edificio se prende solo.
- **Las ventanas van entre 2700 K y 3000 K, con brillo desparejo y algunas apagadas.** Todas
  iguales y encendidas se leen falsas al instante.

Si el arquitecto no da el render nocturno, se puede fabricar en Photoshop sobre el hero: son 3 a 5
horas y hay receta canónica (sacar las capas cálidas, borrar con clone stamp las sombras duras de
sol porque delatan el día, capa azul en Multiply con máscara, cielo nocturno, y la luz pintada a
mano).

**No lo ates al scroll con CSS puro**: `animation-timeline` tiene 86 % de soporte y en iPhone
recién desde iOS 26. Con público de celular en Argentina, va con JavaScript.

### Etapa 3 · Las nubes y el parallax 2.5D

El hero separa solo en cuatro planos: cielo con cúmulos arriba, la torre al centro, árboles en
primer plano y las medianeras al fondo. Se recorta con **SAM2 corriendo en el navegador** (gratis,
los archivos no salen de la máquina), 2 a 3 horas de trabajo, y el recorte fino de las copas de
los árboles hay que revisarlo a ojo.

Después se mueven con `translate3d` y un listener de scroll: **unas 40 líneas y cero dependencias**.
Traer GSAP (28 KB) o three.js (149 KB) para esto es meter peso para no usar el 98 %.

Para las nubes hay dos caminos. El shader de ruido en WebGL es más lindo y es caro: una GPU de
celular tiene alrededor de **un tercio** del rendimiento de una de escritorio, y el presupuesto
atmosférico cae de 5 ms a 2 ms por cuadro. La opción aburrida y correcta son dos PNG con alfa
desplazándose con `translateX` — y si ya recortaste el cielo para el parallax, **el material es el
mismo**: sale gratis.

### Etapa 4 · El edificio que gira — con video, no con 3D

Acá está el dato que decide el presupuesto. Un giro de **72 cuadros a 1440×810**:

| Cómo se sirve | Peso medido |
|---|---|
| **Video H.264** | **0,76 MB** |
| Video WebM/VP9 | 0,65 MB |
| Los mismos cuadros como WebP sueltos | 6,37 MB |
| El mejor GLB que se pudo generar de un interior arquitectónico real | 3,54 MB |

El video gana 8 a 1 porque comprime entre cuadros, y **se puede arrastrar con el dedo** fijando
`video.currentTime`: el usuario gira el edificio igual. Es exactamente lo que hace Winbuild, con
la diferencia de que ellos mandan 97 MB.

Como referencia de lo caro que es la alternativa de secuencia de imágenes: la página de AirPods
Pro de Apple son 148 imágenes y unos 55,8 MB — y Apple sirve **una sola imagen fija** en conexiones
móviles lentas.

### Etapa 5 · El 3D de verdad, cuando exista el GLB

Si algún día llega el modelo, el camino está medido:

- **`model-viewer` 4.3.1**: una sola etiqueta, 285 KB, y trae Draco y KTX2 sin configurar nada.
  Tiene los atributos `camera-orbit` y `camera-target`, que es literalmente «que la cámara se pare
  de frente al edificio».
- **three.js** da más control: 328 KB con OrbitControls, GLTFLoader y Draco (230 KB sin Draco).
  Aviso: **ya no tiene build UMD** (`three.min.js` da 404), así que va sí o sí con `importmap`.
- **El día/noche en 3D no necesita HDRIs**: `Sky.js` de three.js son **3,8 KB** y anima
  `sunPosition` — bajás el sol bajo el horizonte y el cielo hace naranja → azul → negro solo. Dos
  HDRI de 1k pesarían 1,33 y 1,67 MB.
- **Babylon queda afuera** por peso (1,78 MB gzip) y **Spline** por peso y marca de agua (978 KB y
  el plan gratis marca las exportaciones).

**Y la regla que cambia el presupuesto de un modelo 3D**: en un edificio **las texturas son el
82 % del peso**. Comprimiendo un interior arquitectónico real: sólo Draco baja un 15 %; pasar las
texturas a WebP sin tocar un vértice baja un **62 %**; y 512 px + WebP + Draco baja un **93 %**
(de 50 MB a 3,54 MB). Draco es una nota al pie. La estrategia de texturas es el juego entero.

GitHub Pages aguanta: 100 GB/mes de ancho de banda son unas 28.000 visitas cargando el 3D.

### Etapa 6 · El recorrido adentro de la unidad

Se hace con panorámicas equirectangulares servidas como JPEG estáticos y un visor JS. **100 %
compatible con el sitio estático, sin framework y sin build.**

- **Pannellum 2.5.7**: **20 KB gzip totales**, dos etiquetas, con hotspots y encadenado de escenas
  incluidos. Es el que corresponde si el recorrido son 3 a 5 ambientes de una tipología.
- **Photo Sphere Viewer 5.15.1**: 147 KB gzip con todo el stack (arrastra three.js), pero es el
  único que trae **plano de planta con el puntito de dónde estás parado** como plugin oficial.
  También anda sin build, con `importmap` — así se sirve su propio sitio.
- **Marzipano está archivado**: último push en octubre de 2023. Es el que más aparece en tutoriales
  viejos, justamente por eso conviene decirlo. **Su herramienta de recorte de teselas sí sigue
  sirviendo**, corre entera en el navegador y exporta un zip listo para GitHub Pages.

**Pesos de una panorámica de 6000×3000**: 4,62 MB en JPEG, 2,13 MB en WebP q75, 1,53 MB si se baja
a 4096×2048. Sobre las teselas se corrió la prueba: cortarla da 126 archivos y 6,24 MB en disco
—o sea **más** que el JPEG único— pero **el celular baja 1,02 MB para la primera vista** y 323 KB
para el preview. El ahorro es de latencia, no de almacenamiento.

---

## Lo que no conviene prometer

- **Recorrido piso por piso navegable en 3D**, mientras no exista el modelo.
- **Cambio de día a noche "de verdad"** en 3D: eso es un re-render con otro sol, no un filtro.
- **Cualquier SaaS del rubro con abono mensual.** CloudPano son USD 27-33/mes y Matterport unos
  USD 69/mes más el espacio: se comen enteros los USD 45 del abono, que además tiene que cubrir
  servidor, backups y monitoreo del CRM.
- **Video generativo para el showroom.** No por el precio —un clip de 8 segundos sale entre USD
  0,40 y USD 0,96 por API, y probás los tres motores por menos de USD 5— sino por dos motivos:
  **deforma la geometría** justo donde más se nota acá (las barandas de listones horizontales y el
  módulo de ladrillo visto son exactamente el tipo de grilla repetitiva que estos modelos hacen
  bailar), y sobre todo **no es interactivo**: no podés parar la cámara de frente ni dejar que el
  usuario cambie día por noche, que es la mitad de lo que pediste. Sirve para el hero, no para el
  showroom.
- **Los tiers gratis de video, para publicar.** Runway Free son 125 créditos por única vez y con
  marca; Pika Free es 480p, con marca y **sin uso comercial**; Kling free también marca. Veo, Sora
  por API y Luma directamente no tienen gratis. **Ninguno da a la vez uso comercial y sin marca.**
- **Immersity AI** (el atajo pago para 2.5D) tiene el mismo problema: el gratis es 720p, con marca
  y sin uso comercial. El primer plan usable son USD 4,99/mes.

---

## Mañana con Fable: qué pedirle y qué no

**Lo que escribe entero, sin ninguna herramienta paga:**

| Efecto | Qué pedirle |
|---|---|
| Explorador de pisos | «Generá el overlay SVG sobre `fachada-balcarce.jpg` (1847×2600), con `viewBox` igual a esas dimensiones y `preserveAspectRatio="none"`. Un polígono por unidad, con la grilla calculada por fórmula a partir de un paso de piso de 222 px desde y=380. Estados libre/reservada/vendida por color, `tabindex="0"` + `role="button"` + `keydown` en cada uno, y todo el hover envuelto en `@media (hover: hover) and (pointer: fine)`.» |
| Día → noche | «Tres capas apiladas: render diurno, render nocturno con `opacity` animada, y un PNG con alfa de las ventanas encendidas en modo `screen`, escalonadas una por una. Sin `mask-mode: luminance`. Atado al scroll con JavaScript, no con `animation-timeline`.» |
| Parallax 2.5D | «Cuatro capas con `translate3d`, atadas al scroll y al giroscopio, sin librerías. Con `prefers-reduced-motion` respetado.» |
| Nubes | Las dos versiones: el shader fbm de 3-4 octavas (con caída a 2 en celular) y la barata de dos PNG con `translateX`. Compará y quedate con la que se banque el celular. |
| Giro del edificio | «Un `<canvas>` o un `<video>` arrastrable fijando `currentTime`, con precarga por `IntersectionObserver` y una imagen fija de fallback en conexiones lentas.» |
| Los recortes | El **script de Python** que corre SAM2 o Depth Anything V2 y exporta las capas. El juicio visual del recorte es tuyo. |

**Lo que no te va a poder dar, por más que se lo pidas:**

- El render nocturno de la fachada.
- El hero sin el logotipo quemado.
- El PNG de las ventanas encendidas.
- Los 60 a 120 cuadros de la órbita.
- Cualquier clip de video.
- Las panorámicas equirectangulares.

**Todo lo que falta es pixel, no código.** Si mañana querés avanzar sin depender de nadie, el
mejor uso del día es la **Etapa 1**: el explorador de pisos no necesita material nuevo, y es lo
que Winbuild cobra USD 3.000 por hacer.

---

## Los números

| Etapa | Peso que suma | Trabajo | Bloqueada por |
|---|---|---|---|
| 1 · Explorador de pisos | **+36 KB** (la fachada en WebP a 750 px pesa menos que hoy) | — | Confirmar 6 u 8 plantas |
| 2 · Día/noche | +0,7 MB (el render nocturno) | ~30 líneas + 3-5 h si hay que pintarlo | El render nocturno |
| 3 · Nubes y parallax | +1,5 a 2,5 MB (los PNG con alfa pesan más que el JPG) | 2-3 h de recorte + ~50 líneas | Nada |
| 4 · Giro con video | **+0,76 MB** | — | 60-120 cuadros del arquitecto |
| 5 · 3D real | +3,54 MB el GLB, +285 KB el visor | — | El modelo 3D |
| 6 · Recorrido 360 | +1,02 MB la primera vista, con teselas | — | Las panorámicas |

**Contra el presupuesto**: los USD 300 aprobados cubren el sitio que ya está publicado. Todo esto
es alcance nuevo y se cotiza aparte. La referencia de mercado es Winbuild: **USD 3.000 a 5.000 de
setup más USD 200 a 300 por mes** por un producto que, ahora sabemos, son videos y polígonos SVG,
pesa 97 MB y **no tiene día/noche**.

---

## Dos cosas sueltas que aparecieron y conviene anotar

- **La lámina de Tipología 1 dice «Kichenette»**, con la falta de ortografía quemada adentro del
  JPG del brochure. En el código está bien escrito. Se corrige pidiéndole la lámina de nuevo a
  quien la armó.
- **Las láminas de tipología traen un inserto chiquito** que dice «Ubicación en planta: Torre
  Norte / Planta 6» y muestra la planta completa del nivel con las dos torres. Ese inserto es
  justo el activo que hace falta para el explorador de planta, y ya lo tenemos.

---

## Nota sobre cómo se hizo esto

Cinco frentes en paralelo, con los pesos y los precios **medidos**, no citados: se bajaron los
runtimes del CDN y se pesaron con gzip, se comprimió un modelo arquitectónico real en seis
variantes, se cronometró el primer cuadro en Chrome, se cortaron teselas de una panorámica de
verdad, y se leyeron los bundles de producción de la competencia.

La pasada de verificación adversarial —dos escépticos por hallazgo, uno preguntando si de verdad
anda en un sitio estático y otro si de verdad le sirve a este proyecto— **quedó cortada a la
mitad** por el límite semanal de la cuenta. Los hallazgos de arriba llevan su fuente y sus
números; los que dicen «no verificado» son los que no se pudieron confirmar de primera mano, y son
exactamente dos: el precio de Higgsfield y el de Kuula, los dos porque publican los montos por
JavaScript.
