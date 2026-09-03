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
> Todo lo que sea **pixel nuevo** hay que fabricarlo: no hay arquitecto a quien pedírselo.
>
> Y ahí está la vuelta de tuerca: **si el volumen se modela, casi no hace falta pixel nuevo.**
> En un 3D de verdad el sol es una luz, no una imagen.

Y sobre Higgsfield puntualmente: **su precio no se pudo verificar**. La página de precios la arma
JavaScript y no se puede leer; los blogs que la indexan se contradicen entre sí (USD 9, USD 19,
USD 47, USD 59). No va a ningún presupuesto hasta que alguien entre y saque captura.

---

## Lo que pediste son cinco cosas distintas

Conviene separarlas, porque tienen dependencias muy distintas y una sola de ellas es la cara:

| # | Qué | Se resuelve con |
|---|---|---|
| 1 | La cámara se planta de frente y el edificio gira | El volumen modelado en código |
| 2 | Día → noche con el sol que se va y las ventanas que se prenden | El volumen modelado — el sol es una luz |
| 3 | Nubes que se mueven | El material ya está |
| 4 | Ver piso por piso y elegir la unidad | Los planos que ya están |
| 5 | Recorrer la unidad por dentro | Panorámicas 360, y es la única que queda afuera |

**Cuatro de las cinco se pueden hacer con lo que hay hoy.** La quinta queda para después.

Y las cuatro primeras convergen en una sola pieza: **el volumen del edificio modelado como
geometría en código.** Esa pieza no es una imagen que haya que conseguir, es un archivo que se
escribe — y se escribe a partir del corte y la planta que ya están en el material.

---

## La bifurcación que decide todo

> **Actualizado el 2/9, y cambia la recomendación entera.** David confirmó que el arquitecto
> **no tiene modelo 3D ni vista de arriba**: no hay a quién pedirle nada. Y al revisar el
> material apareció que eso importa mucho menos de lo que parecía, porque **los planos sí
> están**. Lo que sigue reemplaza la versión anterior de esta sección, que mandaba a pedirle
> cinco archivos a alguien que no los tiene.

### No hay modelo 3D, pero sí hay plano y corte — que es con lo que se modela

Los 26 renders son salidas de un modelo, no el modelo. Pero **reconstruir el 3D a partir de los
renders es el camino equivocado**, y conviene saber por qué antes de perder un día:

- **Fotogrametría y Gaussian Splatting quedan afuera por definición**: necesitan muchas vistas
  solapadas de la misma geometría, tomadas alrededor del objeto. Del exterior hay **una sola
  vista**. No hay nada que triangular.
- **Los modelos de imagen a 3D alucinan las caras que no ven** y erran las proporciones. En un
  producto que se está vendiendo eso no es un detalle estético: Francisco o un comprador lo
  notan, y una malla alucinada no se corrige, se tira.

Lo que sí hay, y es exactamente el material con el que un estudio arma un modelo:

| Documento | Dónde está | Qué da |
|---|---|---|
| **El corte del conjunto** | Panel derecho de `esquema-torres.jpg` | Torre Norte, Torre Sur, el núcleo de escalera al medio, seis niveles y el acceso por Aniceto Latorre |
| **La planta completa del nivel** | Inserto «Ubicación en planta» de las cuatro láminas de tipología | La huella entera: una unidad por torre y la circulación al medio |
| **La unidad a escala** | Las mismas láminas, panel derecho | La planta del departamento con artefactos |
| **La escala real** | «37 m2» escrito en la lámina | Calibra todo lo demás |
| **El norte** | La rosa de los vientos de la lámina | Sin esto el recorrido del sol es decorativo, no correcto |
| **Materiales y proporción** | `hero-cover.jpg` | Ladrillo visto en las esquinas, parasoles, balcones, dos caras a la vista |

**Y el edificio es simple**: dos volúmenes rectangulares con un núcleo de circulación al medio,
seis niveles, dos unidades por nivel. No es una geometría difícil, son cajas apiladas.

### El bloqueante de las plantas: RESUELTO, y no hacía falta preguntar

Se había marcado una contradicción entre las «6 plantas por torre» del sitio y los 8 niveles de
`fachada-balcarce.jpg`. Leyendo el corte y la planta se cierra sola:

- El corte del conjunto muestra **seis niveles** y nombra las dos torres.
- La planta muestra **una unidad por torre y por nivel**.
- **6 niveles × 2 unidades = 12 unidades.** Es exactamente lo que dice el sitio, y cierra también
  con las «6 unidades» de cada torre.

O sea que el sitio **siempre estuvo bien**, y la lámina de la fachada —8 niveles, balcones de
vidrio, núcleo vidriado— es de otro edificio, que es lo que Francisco había avisado. Confirmado
por dos caminos independientes.

### Lo único que sigue sin haber, y no lo fabrica nadie

Las **panorámicas equirectangulares** para el recorrido adentro de la unidad. Sin modelo no hay
de dónde renderizarlas, y las que generan por IA topean en 6144×3072 con la proyección
distorsionada. El recorrido 360 queda para cuando exista un modelo — el propio, si se llega a
modelar el interior, o el del arquitecto si algún día aparece.

Y opcionalmente, **el hero sin el logotipo quemado adentro del JPG**, si se quiere el parallax
2.5D. Eso sí lo arregla un modelo de imagen por centavos.

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

Si se va por el camino del compuesto y no por el del volumen, el nocturno se fabrica en Photoshop
sobre el hero: son 3 a 5
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

### Etapa 4 · El volumen modelado en código — la pieza que resuelve cuatro pedidos de una

Es la etapa que cambió cuando se confirmó que no hay modelo 3D. **No hay que reconstruir el
edificio de los renders: hay que construirlo de los planos**, y no hace falta aprender a modelar.

Dos volúmenes rectangulares, un núcleo al medio, seis niveles, dos unidades por nivel. Eso es un
bucle con cajas: **geometría paramétrica, o sea código**, que es justo lo que un modelo de código
escribe bien. Se le pasan las proporciones leídas del corte y de la planta, calibradas con los
37 m² que dice la lámina, y emite la escena de three.js.

**Y no tiene que ser fotorrealista. Tiene que ser navegable y correcto.** El patrón que funciona
es un volumen limpio y abstracto —hormigón, vidrio, el ladrillo de las esquinas— que se orbita y
se clickea, y **cuando el usuario elige una unidad se le muestra el render de verdad**. El 3D es
la navegación; los renders son el contenido. Así se ve caro sin fingir una foto, que además es
justo la forma de no caer en la estética de imagen generada.

Lo que habilita, todo junto y sin material nuevo:

- **El giro y la cámara de frente**: `OrbitControls`, o las cámaras predefinidas de `model-viewer`.
- **La vista de arriba**: es otro ángulo de cámara, no un render que haya que conseguir.
- **Piso por piso**: los niveles son objetos de la escena, se resaltan y se clickean.
- **Las secciones que quiere mostrar** (la cochera, las dos torres, los caminos): cámaras
  guardadas, una por sección, cada una con su render al costado.
- **Y el día/noche de verdad.** Éste es el que más se subestima: `Sky.js` de three.js son
  **3,8 KB**, animan `sunPosition`, y con el sol bajando el cielo hace naranja → azul → negro
  solo. Las sombras se mueven porque hay una luz de verdad. Las ventanas se prenden con un
  material emisivo, escalonadas. **No hace falta ningún render nocturno, ni resolver el registro
  de dos imágenes, ni pagar nada.** Y es interactivo, que era la mitad del pedido.

El norte de la lámina no es un detalle: con la orientación puesta, el recorrido del sol es el real
de Salta y no una animación decorativa.

**Lo que cuesta**: es la etapa más larga en horas, y la única con riesgo de que quede pobre si el
volumen se modela apurado. **Y hay que rotularlo como esquema volumétrico**, no venderlo como
plano exacto — igual que el sitio ya rotula «render ilustrativo».

### Etapa 4b · La alternativa barata, si la 4 se complica

Si el volumen no cierra o hay que mostrar algo antes, el giro se puede fingir con video. Un giro
de **72 cuadros a 1440×810**:

| Cómo se sirve | Peso medido |
|---|---|
| **Video H.264** | **0,76 MB** |
| Video WebM/VP9 | 0,65 MB |
| Los mismos cuadros como WebP sueltos | 6,37 MB |
| El mejor GLB que se pudo generar de un interior arquitectónico real | 3,54 MB |

El video gana 8 a 1 porque comprime entre cuadros, y **se puede arrastrar con el dedo** fijando
`video.currentTime`. Es exactamente lo que hace Winbuild, con la diferencia de que ellos mandan
97 MB. **La contra es la de siempre: un video no es interactivo.** Y sin modelo, los cuadros hay
que sacarlos del volumen modelado igual — o sea que esta etapa depende de la 4, no la reemplaza.

Como referencia de lo caro que es servir cuadros sueltos: la página de AirPods Pro de Apple son
148 imágenes y unos 55,8 MB — y Apple sirve **una sola imagen fija** en conexiones móviles lentas.

### Etapa 5 · Con qué motor se sirve el volumen

- **`model-viewer` 4.3.1**: una sola etiqueta, 285 KB, y trae Draco y KTX2 sin configurar nada.
  Tiene los atributos `camera-orbit` y `camera-target`, que es literalmente «que la cámara se pare
  de frente al edificio». Es el camino corto si el volumen se exporta como GLB.
- **three.js**: 328 KB con OrbitControls, GLTFLoader y Draco (230 KB sin Draco). **Es el que
  corresponde acá**, porque si la geometría se genera por código no hace falta ni cargar un GLB:
  se construye en el navegador y pesa lo que pesa el código. Aviso: **ya no tiene build UMD**
  (`three.min.js` da 404), así que va sí o sí con `importmap`.
- **Babylon queda afuera** por peso (1,78 MB gzip) y **Spline** por peso y marca de agua (978 KB y
  el plan gratis marca las exportaciones).

**Un volumen generado por código pesa cero en descarga.** No hay texturas de 40 MB ni modelo que
bajar: son unos cientos de líneas más el runtime. Es la ventaja escondida de modelar en código en
vez de importar un GLB de un estudio.

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

> **Ojo con una trampa que tenía la versión anterior de esta sección**: el prompt del explorador
> apuntaba a `fachada-balcarce.jpg`, que es **el edificio equivocado**. Esa lámina no es La Torre
> y ya se sacó del sitio. El explorador va sobre el hero o sobre el volumen modelado, y ahí los
> polígonos **no salen por fórmula**: el hero es una perspectiva, no una elevación ortográfica.

**Por dónde empezar, en orden:**

**1 · El volumen del edificio.** Es la pieza que resuelve cuatro de los cinco pedidos, y es puro
código. El prompt tiene que llevar las medidas, no adjetivos:

> «Armá en three.js el volumen de un edificio de dos torres. Huella alargada de proporción
> aproximada 3:1, con un núcleo de circulación al centro que separa Torre Norte de Torre Sur.
> Seis niveles de departamentos sobre una planta baja de acceso y cocheras. Una unidad por torre
> y por nivel. Balcones en voladizo sobre la cara al frente. El núcleo sobresale por encima del
> último nivel con la sala de máquinas. Materiales planos y sobrios: hormigón, vidrio, y ladrillo
> visto en las esquinas verticales. Calibrá la escala para que la unidad chica dé 37 m². Cada
> nivel y cada unidad tienen que ser objetos separados y seleccionables. Sumá `Sky.js` con
> `sunPosition` animable y las ventanas con material emisivo que se prenda escalonado.»

Después se ajusta contra el corte de `esquema-torres.jpg` y la planta de las láminas, que son las
dos fuentes de verdad. **La escala se calibra con los 37 m².**

**2 · El explorador de pisos.** Con el volumen andando, sale de arriba: los niveles ya son objetos
y se clickean. Sin el volumen, va con polígonos SVG sobre el hero, dibujados a mano con el Shape
Generator de MDN (sube la imagen, tildás Polygon, clickeás los vértices y te devuelve el
`<polygon>` listo). Y en los dos casos: `viewBox` igual a las dimensiones intrínsecas de la
imagen, `preserveAspectRatio="none"`, `tabindex="0"` + `role="button"` + `keydown` en cada
polígono, y todo el hover envuelto en `@media (hover: hover) and (pointer: fine)`.

**3 · La elección de la unidad adentro del piso.** El inserto «Ubicación en planta» de las láminas
ya muestra la huella con las dos unidades. Se redibuja como SVG y queda el segundo nivel de
navegación: torre → piso → unidad.

**Lo demás que escribe entero, sin ninguna herramienta paga:**

| Efecto | Qué pedirle |
|---|---|
| Parallax 2.5D | «Cuatro capas con `translate3d`, atadas al scroll y al giroscopio, sin librerías. Con `prefers-reduced-motion` respetado.» |
| Nubes | Las dos versiones: el shader fbm de 3-4 octavas (con caída a 2 en celular) y la barata de dos PNG con `translateX`. Compará y quedate con la que se banque el celular. |
| Día/noche sin 3D | Si el volumen no llega: «Base diurna, cielo nocturno enmascarado encima, el edificio oscurecido con `mix-blend-mode: multiply` **sobre los mismos píxeles**, y las ventanas en `screen` escalonadas.» Nunca dos renders fundidos: fantasmean. |
| Los recortes | El **script de Python** que corre SAM2 o Depth Anything V2 y exporta las capas. El juicio visual del recorte es tuyo. |

**Lo que no te va a poder dar, por más que se lo pidas:**

- Las panorámicas equirectangulares del recorrido interior.
- El hero sin el logotipo quemado adentro del JPG (eso es un modelo de imagen, y son centavos).
- Cualquier clip de video.

**Y la que más importa: no te va a poder decir si el volumen quedó bien.** Eso se mira contra el
corte y el hero, y el ojo es tuyo. Un volumen mal proporcionado se nota, y es lo único de todo
esto que se ve peor que no hacer nada.

---

## Los números

| Etapa | Peso que suma | Trabajo | Bloqueada por |
|---|---|---|---|
| 1 · Explorador de pisos | **+36 KB** en WebP a 750 px | Polígonos a mano sobre el hero, o gratis si ya está la etapa 4 | Nada |
| 2 · Día/noche | **+0 KB** si sale del volumen · +0,7 MB si va compuesto | ~30 líneas | Nada, si va por el volumen |
| 3 · Nubes y parallax | +1,5 a 2,5 MB (los PNG con alfa pesan más que el JPG) | 2-3 h de recorte + ~50 líneas | Nada |
| 4 · El volumen en código | **+230 a 328 KB** (el runtime; la geometría no se descarga) | La más larga: días, no horas | Nada |
| 4b · Giro con video | +0,76 MB | — | Depende de la 4 |
| 5 · Recorrido 360 | +1,02 MB la primera vista, con teselas | — | Las panorámicas, que no existen |

**Contra el presupuesto**: los USD 300 aprobados cubren el sitio que ya está publicado. Todo esto
es alcance nuevo y se cotiza aparte. La referencia de mercado es Winbuild: **USD 3.000 a 5.000 de
setup más USD 200 a 300 por mes** por un producto que, ahora sabemos, son videos y polígonos SVG,
pesa 97 MB y **no tiene día/noche**.

---

## Dos cosas sueltas que aparecieron y conviene anotar

- **La lámina de Tipología 1 dice «Kichenette»** en el listado de ambientes del panel izquierdo,
  con la falta quemada adentro del JPG. El plano de al lado, en la misma lámina, dice
  «KITCHENETTE» bien. En nuestro código también está bien escrito. Se corrige pidiéndole la
  lámina de nuevo a quien la armó, o tapando esa línea.
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

---

## Post scriptum del 2/9: por qué este documento cambió de rumbo a mitad de camino

La primera versión daba por sentado que el arquitecto tenía el modelo y mandaba a pedirle cinco
archivos. Cuando David confirmó que **no hay modelo ni vista de arriba**, se revisó el material de
nuevo y aparecieron tres cosas que estaban a la vista y nadie había mirado:

1. **El corte del conjunto**, en el panel derecho de `esquema-torres.jpg`, con las dos torres
   nombradas, el núcleo de escalera y los seis niveles.
2. **La planta completa del nivel**, en el inserto de las cuatro láminas de tipología.
3. **Los 37 m² y la rosa de los vientos**, que son la escala y la orientación.

Con plano, corte, escala y norte no hace falta reconstruir nada de los renders: **se modela**. Y
modelar en código lo que es una pila de cajas resuelve de un saque el giro, la cámara, la vista de
arriba, el piso por piso y el día/noche — que eran cinco pedidos separados y resultaron ser uno.

La moraleja, para la próxima: **antes de buscar la herramienta, leer el material.** El
relevamiento de las cinco familias de técnica costó 66 agentes y cinco millones de tokens, y la
decisión la definió mirar con atención dos imágenes que ya estaban en el repo.

---

## Referencia leída el 3/9: Belgrade Arbor (belgradearbor.rs)

David la trajo como el nivel al que quiere llegar. Se abrió y se leyeron los bundles.

**La página del 3D (`/en/3d`)** es exactamente nuestra arquitectura: three.js con React
Three Fiber sobre Next.js, el mismo `Sky.js` con `sunPosition`, un slider «Time of day»,
unidades seleccionables, GLTFLoader con Draco, KTX2 y Meshopt, entorno HDR y EffectComposer.
La diferencia es el asset: **descarga 35 MB**, de los cuales `zgrada.glb` (el edificio) son
**15,1 MB** y `nature.glb` (el entorno) **16 MB** — un modelo hecho por un artista 3D a partir
del modelo del arquitecto. Nuestro volumen generado por código pesa el runtime y nada más.

**La portada (`/en`)** pesa **3,4 MB en total**. Next.js, Tailwind, **GSAP** (ScrollTrigger,
ScrollSmoother, SplitText) y **Lenis** para el scroll suave. El hero «que se arma de un
borrador» es un **video** (`hero-m.webm`, 1,8 MB en celular) con el boceto convirtiéndose en
render, reproducido al ritmo del scroll (`requestVideoFrameCallback` + canvas). Las demás
secciones usan videos en loop dentro de máscaras SVG, solapas por tipología, un «view from
above» con dos vistas, y un plan de cuotas. Tipografía **PP Editorial Old**, que es comercial
y no se puede copiar.

**Lo que se puede imitar hoy con lo que hay**: la mecánica entera —scroll suave, títulos que
entran partidos por letra, secciones con parallax, videos enmascarados, solapas de tipología,
el 3D con hora del día— porque es código. **Lo que necesita material**: el video del boceto al
render (hay que fabricarlo: un dibujo lineal del hero se puede generar por detección de
bordes o con un modelo de imagen, y el fundido se anima en código), y los videos de ambiente
de cada sección (o se reemplazan por los renders con movimiento 2.5D).

