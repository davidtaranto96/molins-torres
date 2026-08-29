# Edificio La Torre — sitio del emprendimiento

Sitio propio del **Edificio La Torre**, el emprendimiento de 12 unidades sobre
Balcarce y Aniceto Latorre, Salta Capital, que comercializa **Molins Negocios
Inmobiliarios** (Francisco Molins · CUCIS MP 251 · LPZ Grupo y Molins).

Se separa del portal de Molins por decisión comercial, escrita en el
presupuesto aprobado el 26/8:

> *"Metida como una sección adentro de tu portal se pierde —queda con la cara de
> Molins, no con la del edificio— y se desaprovecha el diseño que ya se está
> pagando. Por eso: sitio propio, con su nombre, su dirección y la marca nueva."*

**Independiente en lo que se ve, conectado en lo que importa**: cada consulta
cae en el CRM de Molins con la campaña de la que salió y se reparte entre
Francisco y Luis igual que las demás.

## Estado

| | |
|---|---|
| Presupuesto | **USD 300**, aprobado el 26/8. Dos pagos de 150. |
| Abono | pasa de USD 35 a **45**, con esta web adentro |
| Plazo | 2 semanas **desde que estén la marca y los materiales** |
| Hoy | v1 publicada como `franciscomolins.com/torres/`, a la espera de la marca |

## Qué hay acá

`index.html` es la **v1 que ya está andando**, con seis secciones: unidades,
tipologías, calculadora, avance de obra, ubicación y contacto. No es un
borrador: funciona y se puede visitar. Sirve como punto de partida del rediseño
y como prueba de que la estructura cierra.

`img/` tiene los 16 renders en JPG que el sitio usa.

**Los PNG originales (97 MB) están fuera del repo a propósito** — ver
`.gitignore`. El HTML no referencia ninguno, y meterlos multiplicaría por cinco
el peso del repo para siempre.

## Lo que falta para arrancar el rediseño

Del presupuesto, textual. Nada de esto lo podemos hacer nosotros:

1. **La marca y el brochure**, que está armando Berni. Es el bloqueante real:
   sin identidad no hay rediseño que hacer.
2. **El plano con las unidades**, con tipología, metros y precio de cada una.
3. **Los renders y las fotos de obra**, para el avance.
4. **El dominio** y los datos de Francisco para registrarlo a su nombre.

## La decisión de dominio, abierta

El presupuesto dice «sitio propio, con su nombre y su dirección». Hoy vive en
`franciscomolins.com/torres/`, que contradice eso. Las opciones están en
`docs/dominio.md`.

## Conexión con el CRM

El formulario y los botones de WhatsApp mandan a la API pública del CRM
(`/api/publico/consultas` y `/api/publico/clics`), con la clave del sitio y el
código de campaña. Es el mismo mecanismo del portal de Molins y de la web de
Aires: la consulta entra ya sabiendo de qué anuncio salió y qué unidad miraba.

**Cada sitio necesita su propia clave**, que se crea en el CRM desde
Carteras → Claves de sitio. La de Torre todavía no existe.
