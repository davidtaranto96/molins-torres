# Edificio La Torre — sitio del emprendimiento

Sitio propio del **Edificio La Torre**, el emprendimiento de 12 unidades sobre
Balcarce y Aniceto Latorre, Salta Capital, que comercializa **Molins Negocios
Inmobiliarios** (Francisco Molins · CUCIS 251 · Grupo LPZ-Molins).

Se separa del portal de Molins por decisión comercial, escrita en el
presupuesto aprobado el 26/8:

> *"Metida como una sección adentro de tu portal se pierde —queda con la cara de
> Molins, no con la del edificio— y se desaprovecha el diseño que ya se está
> pagando. Por eso: sitio propio, con su nombre, su dirección y la marca nueva."*

**Independiente en lo que se ve, conectado en lo que importa**: cada consulta
cae en el CRM de Molins con la campaña de la que salió y se reparte entre
Francisco y Luis igual que las demás.

## Estado

### Ronda de correcciones del 31/8 (móvil)

Rediseño narrativo + QA completo del celular, sobre las capturas de David.
Lo que quedó, y lo que hay que saber para no repetirlo:

- **El bug del menú**: con la página scrolleada el header lleva `backdrop-filter`,
  y **un ancestro con backdrop-filter se vuelve el bloque contenedor de sus hijos
  `position:fixed`** — el panel quedaba encerrado en la franja del header. Con el
  menú abierto el header no filtra nada.
- **Los carteles quemados en los renders mandan sobre el encuadre**: el hero trae
  el logotipo del proyecto (es el titular: el texto de la página va abajo y chico)
  y el render de cocheras traía «Cocheras | Disponibles» al medio (se recortó la
  franja de abajo en `cochera-bloque.jpg`).
- **Precios tapados** con `CFG.mostrarPrecios` (`window.TORRE_CONFIG` lo revierte).
- **Cookies**: barra al pie en celular, tarjeta abajo a la izquierda en
  escritorio. **Reescrito el 2/9** a la fórmula fija de DT System: una línea,
  consentimiento por navegación y un solo botón. La versión de dos botones tenía
  además un bug de layout —`flex:1 1 300px` en un contenedor que en escritorio
  pasa a columna, así que los 300px iban a la ALTURA— y el aviso ocupaba media
  pantalla.


| | |
|---|---|
| Presupuesto | **USD 300**, aprobado el 26/8. Dos pagos de 150. |
| Abono | pasa de USD 35 a **45**, con esta web adentro |
| Plazo | 2 semanas **desde que estén la marca y los materiales** |
| Hoy | **publicada en `edificiolatorre.com`** (2/9), a la espera de la marca |

## Qué hay acá

`index.html` es la **v1 que ya está andando**, con seis secciones: unidades,
tipologías, calculadora, avance de obra, ubicación y contacto. No es un
borrador: funciona y se puede visitar. Sirve como punto de partida del rediseño
y como prueba de que la estructura cierra.

`img/` tiene los 16 renders en JPG que el sitio usa.

**Los PNG originales (97 MB) están fuera del repo a propósito** — ver
`.gitignore`. El HTML no referencia ninguno, y meterlos multiplicaría por cinco
el peso del repo para siempre.

## El showroom 3D

Está relevado y no construido: `docs/showroom-3d.md`. Los tres titulares, para no volver a
investigarlo: **ningún showroom comercial del rubro es 3D de verdad** (Winbuild y Web3D son MP4
pre-renderizados más un polígono SVG por piso, y mandan 97 y 35 MB); **ninguno de los dos tiene
transición día/noche**, que es lo más barato de todo y por eso es el diferenciador; y lo único
que se puede empezar sin pedirle nada a nadie es el **explorador de pisos**, que sale por fórmula
sobre la elevación de fachada y pesa 36 KB.

Antes de dibujar un solo polígono hay que resolver el bloqueante: el sitio dice 12 unidades y 6
plantas por torre, y la elevación tiene 8 niveles.

## Lo que falta para arrancar el rediseño

Del presupuesto, textual. Nada de esto lo podemos hacer nosotros:

1. **La marca y el brochure**, que está armando Berni. Es el bloqueante real:
   sin identidad no hay rediseño que hacer.
2. **El plano con las unidades**, con tipología, metros y precio de cada una.
3. **Los renders y las fotos de obra**, para el avance.

## El dominio, resuelto

`edificiolatorre.com`, comprado por David el 2/9 en Cloudflare Registrar y a
nombre de Francisco. Es la opción A de `docs/dominio.md`, que es la que decía el
presupuesto. Sirve desde GitHub Pages, con certificado y HTTPS forzado.

`franciscomolins.com/torres/` quedó como **redirección** al dominio nuevo, y se
borró la copia del sitio que vivía adentro del portal (46 archivos, 110 MB de
imágenes viejas sin comprimir). Con eso se fue también
`scripts/publicar-en-portal.sh`: existía sólo para sincronizar esa copia y hoy
lo único que podría hacer es resucitarla. **Este repo es la única fuente.**

## Conexión con el CRM

El formulario y los botones de WhatsApp mandan a la API pública del CRM
(`/api/publico/consultas` y `/api/publico/clics`), con la clave del sitio y el
código de campaña. Es el mismo mecanismo del portal de Molins y de la web de
Aires: la consulta entra ya sabiendo de qué anuncio salió y qué unidad miraba.

**Cada sitio necesita su propia clave**, que se crea en el CRM desde
Carteras → Claves de sitio. La de Torre ya existe y está puesta en `src/app.js`.

**Trampa verificada el 2/9**: los esquemas de esas rutas son objetos de Zod, y
Zod tira en silencio lo que no declara. `clic()` mandaba `tipo:"visita"` —que no
está en el enum de `/api/publico/clics`— más `dato`, `campania`, `origen` y
`url`, ninguno de los cuales existe: **la ruta devolvía 400 en cada carga y no
se midió una sola visita**, sin un error visible porque el `.catch(() => {})` se
lo tragaba. La visita va a `/api/publico/visitas`, que es otra ruta y otro
cuerpo. Antes de tocar cualquiera de las tres, leé el `z.object()` de la ruta.
