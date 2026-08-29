# Dónde vive el sitio de La Torre

Decisión abierta. Hay que tomarla antes de configurar nada, porque cambia el
diseño: no se arma igual un sitio que se presenta solo que uno que vive colgado
de otro.

## La tensión

El presupuesto aprobado dice, textual:

> *"Metida como una sección adentro de tu portal se pierde —queda con la cara de
> Molins, no con la del edificio— y se desaprovecha el diseño que ya se está
> pagando. Por eso: **sitio propio, con su nombre, su dirección y la marca
> nueva**."*

Y también: *"Dominio propio, a tu nombre. La elegimos, la configuro y la dejo
andando con su certificado. El registro anual lo pagás vos y es tuyo."*

Pero hoy vive en `franciscomolins.com/torres/`, que es exactamente lo que el
presupuesto dice que no conviene.

## Las opciones

### A · Dominio propio — es lo cotizado

`edificiolatorre.com`, `latorresalta.com` o similar.

- Es lo que Francisco aprobó y pagó.
- El edificio se presenta con su nombre: en un cartel, en un anuncio o dicho por
  teléfono, «edificiolatorre.com» es una dirección; «franciscomolins.com barra
  torres» no se dicta.
- La marca que está haciendo Berni tiene dónde vivir sin competir con la de Molins.
- Cuando el edificio se venda entero, el sitio se archiva sin tocar el portal.
- **Cuesta**: un registro anual más (unos USD 10 a 15) y una configuración de DNS.

### B · Subcarpeta del portal — lo que hay hoy

`franciscomolins.com/torres/`

- Ya funciona, cero costo, cero trámite.
- Hereda el certificado y la medición del portal.
- **Pero contradice lo que se vendió**, y el argumento del presupuesto sigue en
  pie: se lee como un producto de la inmobiliaria, no como un emprendimiento.

### C · Subdominio — el punto medio

`torre.franciscomolins.com`

- Se lee como algo propio y se dicta bien.
- No cuesta registro nuevo: es un registro DNS más en el dominio que ya existe.
- **Pero sigue diciendo «franciscomolins» en la dirección**, así que la
  independencia de marca es a medias.

## Recomendación

**La A**, por dos razones que no son de gusto:

1. **Es lo que se cotizó y se aprobó.** Cambiarlo por lo barato después de
   cobrarlo es empeorar lo vendido sin avisar.
2. **Un emprendimiento se publicita aparte.** La dirección va a ir en carteles
   de obra, en anuncios de Meta y en el brochure de Berni. Ahí, un dominio
   propio es la diferencia entre un edificio con identidad y una sección de la
   web de una inmobiliaria.

Si Francisco prefiere no pagar otro registro, **la C** es una salida digna y
reversible: se arranca en `torre.franciscomolins.com` y el día que quiera el
dominio propio se muda con una redirección, sin rehacer nada.

**La B es la única que descartaría**, justamente porque es la que hay hoy y es
la que el presupuesto argumentó en contra.

## Lo que no cambia en ninguna de las tres

La conexión con el CRM. En las tres, el formulario y el WhatsApp mandan a la API
pública con la clave del sitio, y la consulta cae con su campaña y se reparte
igual. La dirección donde vive el sitio no toca eso.
