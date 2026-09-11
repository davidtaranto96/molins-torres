# La Torre — repaso general · 10/09/2026

## Alcance
Web estática, navegación, visor exterior y conexión pública con CRM. Chromium automatizado a 375×812, 768×812 y 1280×812; revisión de capturas, movimiento normal y reducido. No es un pentest del CRM ni prueba en un iPhone físico.

| Hallazgo | Antes | Corrección / comprobación |
|---|---|---|
| Documentos de trabajo publicados | `/AGENTS.html` y `/docs/handoff-codex-showroom.html` respondían 200 | `_config.yml` excluye documentación, laboratorio, scripts y fuentes Blender del sitio. El historial del repositorio no se elimina. |
| Datos externos como HTML | Listado y opciones interpolaban valores del CRM | Nodos con textContent / Option; sólo se aceptan unidades del proyecto y tipologías/superficies documentadas. |
| Enlace WhatsApp con scroll suave | Handler registrado cuando href era `#` intentaba usar la URL final como selector CSS | Sólo procesa fragmentos internos válidos; WhatsApp no pasa por el selector. |
| Consulta sin vínculo explícito a propiedad | Sólo mencionaba unidad en el texto | Envía propiedadCodigo `TORRE-6A`, etc., como usa el CRM. |
| Formulario sin límite de espera | Podía quedar enviando indefinidamente | Timeout de 15 s, límites de campos y respuesta anunciada con aria-live. |
| Foco de diálogos | Tab podía salir detrás de ficha/galería | Fondo inerte y foco contenido/restaurado; menú cerrado inerte. |
| Móvil | Campos de 15 px, propensos a zoom en iOS | 16 px y controles táctiles de al menos 44 px en formulario/footer. |
| Movimiento reducido | Subsistían desplazamientos/fijación y animaciones de entrada | Esos efectos se desactivan conservando contenido y navegación manual. |
| Vista previa al compartir | Metadatos todavía nombraban LPZ | Comercialización actualizada a Francisco Molins. |
| Protección del documento | Sin CSP | Política limita scripts, conexiones, imágenes y marcos a orígenes usados; objetos y base deshabilitados. Referrer limitado entre dominios. |

## Pruebas
- 375 y 1280: sin imágenes rotas, sin anclas sin destino, sin overflow horizontal.
- 375, 768 y 1280 con animaciones: menú, WhatsApp, tipologías, tarjetas de pago, ficha y foco de teclado, puntos del mapa y carrusel interior; cero errores de JavaScript.
- Galería: abrir, avanzar (flechas/teclado), cerrar. Ficha: render/lámina, seleccionar unidad y pasar a consulta.
- Formulario: éxito 201 y error 503 simulados mediante interceptación en navegador; se verifica mensaje de resultado, recuperación y enlace WhatsApp. No se crean consultas reales en estas pruebas.
- API pública real: 12 unidades recibidas. Comprobación de clave y endpoint con campo trampa: 201 y ok, sin guardar consulta.
- Revisión de código del endpoint: validación de datos, clave de sitio asociada a cartera, campo trampa y límite por IP. La clave del frontend es de recepción pública, no acceso administrativo.

## Límites
- No se envió una consulta comercial real ni un WhatsApp a Francisco. No se verificó su recepción personal/notificación final.
- GitHub Pages no permite configurar desde estos archivos cabeceras como frame-ancestors o HSTS. CSP por meta no sustituye esas cabeceras.
- Excluir archivos del despliegue no los borra de un repositorio público ni de su historial.
- El visor sigue siendo una representación ilustrativa del proyecto, no un modelo original del estudio.
- Evidencias de trabajo: `/private/tmp/audit-results.json`, `/private/tmp/general-results.json`, capturas `/private/tmp/general-*` y `/private/tmp/audit-*`.

## Visor exterior
- Verificados todos los botones de cámara en el visor independiente, entrar a pisos, siguiente/anterior y volver al edificio.
- Verificados Día/Noche y modo por pisos dentro del iframe de la portada. Los controles respondieron tras cerrar el aviso de cookies y esperar el desplazamiento del marco; no hubo error funcional reproducible del visor.
