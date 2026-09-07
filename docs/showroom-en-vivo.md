# Showroom editable — 7 de septiembre de 2026

Trabajo solicitado por David: showroom estilo Sims, usando planos y renders reales, con edición de muebles y recorrido interior. Luego pidió que el trabajo ocurriera visiblemente en Blender y acercar el acabado a los videos de Winbuild y Urbania3D que compartió.

## Abrir y probar

Servir la raíz con `python3 -m http.server 8769 --bind 127.0.0.1` y abrir `/3d/?modo=showroom&piso=3`.
En Blender abrir `3d/blender/showroom-en-vivo.blend` y elegir la escena **Showroom en vivo**. La copia incluye la escena original conservada. Los scripts de controles y acabados también quedan en el editor de textos de Blender.
Para recuperar el panel después de volver a abrir Blender, ejecutar el texto `controles-vivos.py`. Pestaña lateral **La Torre**: elegir piso, paredes completas/bajas/ocultas, edificio entero. Cada mueble es seleccionable como un objeto: G mover, R Z girar, H ocultar, Shift D duplicar, Ctrl Z deshacer.

## Qué está conectado

- El addon local de Blender respondió a consultas y ejecutó los cambios en la ventana del usuario.
- La web y Blender leen `mobiliario.json`: huellas por planta y piezas de cada mueble.
- La lógica de disponibilidad del CRM de `3d/index.html` se conservó.
- El GLB de base se exportó con Draco; no reemplaza el modelo paramétrico de la web.
- La web conserva muebles por piso en localStorage, permite quitar, colocar, girar, deshacer y restaurar. No escribe disposiciones en el CRM.
- Recorrido con controles táctiles o W/A/S/D y límites contra muros, muebles y vacío del patio.

## Materiales y fuentes

Planos: `img/plantas/tipo.webp`, `p5.webp`, `p6.webp`. Referencias: `interior-estar.jpg`, `area-suite.jpg`, renders existentes de La Torre.

Texturas de Poly Haven: [Oak Veneer 01](https://polyhaven.com/a/oak_veneer_01), [Fabric Pattern 07](https://polyhaven.com/a/fabric_pattern_07), [Painted Plaster Wall](https://polyhaven.com/a/painted_plaster_wall). En las telas sólo se usan relieve y rugosidad; se conserva el color neutro del proyecto. `texturas/manifest.json` identifica los originales de 1K y `web.json` los WebP de 512 px (unos 205 KB combinados).

## Alcance real y estimaciones

Los planos no tienen todas las cotas horizontales. Las huellas de muebles se leyeron proporcionalmente y las alturas, perfiles y decoración son estimaciones, no especificaciones constructivas. La terraza del 5A se mantiene sin ambientar: el plano dice no accesible.

El acabado del 3B en Blender añade PBR, vegetación, alfombra, colgantes, cortinas, vidrio, cielorraso, TV y listones. El modelo web conserva la base paramétrica con PBR, muebles y carpinterías; todavía no replica toda esa ambientación. El GLB inicial tampoco incluye el último acabado de la unidad muestra. No se afirma equivalencia fotorealista con los videos ni se garantizan 60 fps en celulares físicos.

## Verificación

Pasaron pruebas de quitar/deshacer/restaurar, persistencia tras recargar, seis pisos, tres estados de paredes, movimiento interior, Escape y salir/reabrir, sin errores JavaScript en esa corrida. Se revisaron capturas de escritorio y celular y se corrigió una superposición del panel móvil. La revisión visual final y la validación del acabado con David continúan.

## Archivos y recuperación

- `3d/showroom.js`, `showroom.css`: editor/recorrido, separado del visor existente.
- `3d/blender/showroom.py`: generación de base desde `la-torre.py`, exportación inicial.
- `controles-vivos.py`, `acabados-vivos.py`, `realismo-vivo.py`, `interior-muestra.py`, `detalles-estar.py`: pasos reproducibles de la unidad muestra. Se ejecutan en ese orden después de generar la base; no regenerar en la ventana que David está editando.
- `showroom-en-vivo.blend`: copia de revisión; no pisa el original.

No se publicó ni se modificaron precios o disponibilidades del CRM.

## Exterior corregido

Se separó la cubierta del hormigón de fachada, se sustituyeron masas facetadas por hojas, y se corrigió el vidrio en Blender. Comparaciones: `docs/revisiones/2026-09-07-revision.md`. El visor añade cámara aérea y follaje instanciado; usa render directo y luz solar/hemisférica, sin PMREM del cielo, que generaba materiales negros al mediodía en la verificación. Esto desactiva el posprocesado de oclusión y bloom; es un límite visual conocido de esta versión estable.

Verificación del 7/9: exterior a las 13:30, 16:30 y 21:30; showroom en 1440, 375 y 390 px con 22 muebles en planta tipo, sin desbordes ni errores JavaScript. La versión web todavía tiene menos detalle que Blender.
