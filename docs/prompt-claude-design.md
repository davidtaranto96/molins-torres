# Prompt para el sitio de La Torre en Claude Design

> Se corre con el repo `molins-torres` cargado. La v1 que está adentro es el
> punto de partida: no es un borrador, está publicada y funciona.
>
> **Antes de correrlo, leer «La marca» abajo.** Si el material de Berni todavía
> no llegó, el prompt igual sirve, pero hay que decidir a conciencia qué se
> hace con la identidad.

---

Rediseñá el sitio del **Edificio La Torre**, un emprendimiento de 12 unidades en
pozo en Salta Capital, sobre Balcarce y Aniceto Latorre. Hay una v1 publicada y
andando en el repo; esto es rehacerla mejor, no retocarla.

## Qué es y qué tiene que lograr

Un edificio de **12 unidades** repartidas en **Torre Norte** y **Torre Sur**,
monoambientes y un dormitorio, con balcón y terraza. Se vende **en pozo**: el
comprador pone plata sobre algo que todavía no existe.

Eso define todo el diseño. **La página tiene un solo trabajo: que alguien confíe
lo suficiente como para dejar sus datos por una unidad concreta.** No es un
folleto lindo, es la pieza que convierte un anuncio en una consulta con nombre y
número de unidad.

Comercializa **Molins Negocios Inmobiliarios** (Francisco Molins, corredor
matriculado CUCIS MP 251, LPZ Grupo y Molins). El edificio es el protagonista;
la inmobiliaria firma abajo.

## La marca

**La identidad la está armando Berni** —marca, brochure y material desde cero— y
el sitio se monta sobre eso. Es la razón por la que el edificio tiene sitio
propio y no vive adentro del portal de Molins.

- **Si el material de Berni está adjunto**: usalo tal cual. Es la fuente.
- **Si no llegó**: diseñá con una dirección propia, pero **dejá la identidad
  aislada en tokens** (color, tipografía, logotipo) para que se reemplace sin
  rehacer el diseño. Nada de meter el color de marca a mano en cada bloque.

En cualquier caso: **el nombre del edificio manda en el encabezado**, no el de
la inmobiliaria. Molins va como quién comercializa, en el pie y en la sección de
contacto, con la matrícula.

## Lo que ya está probado y no se toca

La v1 tiene seis secciones y funcionan. El rediseño las conserva, mejor
resueltas:

**1 · Las unidades.** Es el corazón. Cuatro tipologías con precio real:

| Tipología | Qué es | Precio |
|---|---|---|
| **Horizonte** | Monoambiente 37 m² · 6.º A | USD 58.000 |
| **Evolución** | Monoambiente + terraza 42 m² · 5.º A | USD 66.000 |
| **Esencia** | 1 dormitorio 55 m² · 1.º a 4.º A | USD 79.000 |
| **Cúspide** | 1 dormitorio 55 m² · 1.º a 6.º B | USD 82.000 |

Más **cochera en planta baja, +USD 12.000**.

Tiene que verse **qué unidad es cuál y cuál queda libre**. Un plano o esquema
donde se elija la unidad —no una lista— es lo que hace que alguien diga «quiero
el 4.º B» en vez de «me interesa el edificio». Cada unidad con su estado: libre,
reservada o vendida.

**2 · El simulador de financiación.** Ya existe y es la pieza más valiosa: se
elige unidad, porcentaje de anticipo (35 % por defecto), plazo en cuotas de obra
(24 meses) y cochera, y devuelve valor total, anticipo al boleto, saldo
financiado y cuota mensual estimada. Con **ajuste CAC**, que es como se financia
la obra en Argentina.

Mantenelo y hacelo más claro. **Es lo que separa a quien mira de quien puede
comprar**, y el resultado tiene que terminar en un botón que mande esa
simulación como consulta.

**3 · Tipologías** con sus plantas. **4 · Avance de obra** con etapas y fotos
fechadas —sostiene la confianza en una venta en pozo—. **5 · Ubicación** con el
mapa. **6 · Contacto**.

## Qué agregar

- **Que el estado de cada unidad y los precios los pueda cambiar Francisco**,
  sin depender del desarrollador. Está prometido en el presupuesto.
- **Una sola versión vigente del cuadro de precios.** Nadie tiene que poder
  cotizar con un precio viejo.
- **El anuncio y la unidad, pegados**: si alguien llega desde un aviso de una
  tipología, que la consulta lo diga.

## La conexión con el CRM, que es requisito

El formulario y los botones de WhatsApp mandan cada consulta a la API pública
del sistema de Molins (`/api/publico/consultas` y `/api/publico/clics`), con la
clave del sitio y el código de campaña. Es el mismo mecanismo del portal de
Molins y de la web de Aires.

La consulta tiene que entrar **sabiendo de qué anuncio salió y qué unidad
miraba**. Eso no es un extra: es lo que hace que el sistema pueda decir cuánto
costó cada consulta.

Sumá la medición de visitas con consentimiento de cookies, igual que los otros
dos sitios.

## Movimiento

Sobrio. Entradas al scroll escalonadas, hover que levanta apenas, transiciones
de 150 a 250 ms, y respetar `prefers-reduced-motion`. En un emprendimiento en
pozo el movimiento tiene que transmitir solidez, no entusiasmo: nada de
contadores animados ni brillos.

## Lo que no quiero

- Que parezca una propiedad más de una inmobiliaria. Es un edificio con nombre.
- Estadísticas infladas o plazos de obra que nadie pueda sostener.
- Prometer reservar o señar online. La consulta llega al CRM y sigue una persona.
- Fondo crema, Inter ni Poppins por defecto. Etiquetitas en mayúsculas por sección.
- Precios sin decir la moneda y la fecha de vigencia. En pozo eso se reclama.

## Copy

Voseo argentino. Sin emojis, sin signos de exclamación. Llamados a la acción en
infinitivo («Ver la unidad», «Simular la financiación», «Consultar por el 4.º B»).
Los números —metros, precios, cuotas, plazos— son los de arriba y no se inventan.
