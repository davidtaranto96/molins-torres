# Edificio La Torre

## Root y stack
El sitio vive en esta carpeta. HTML, CSS y JavaScript estáticos, sin build ni framework.
El visor `3d/index.html` usa three.js 0.185.1. Blender 5.2 genera la geometría editable.

## Comandos
- Vista previa: `python3 -m http.server 8769 --bind 127.0.0.1`
- Generar modelo base: `TORRE_RAIZ="$PWD" /Applications/Blender.app/Contents/MacOS/Blender --background --python 3d/blender/showroom.py`
- `sellar.sh` actualiza versiones de estilos.css/app.js de la portada, no el visor.
- Push a main publica el sitio: no confundir guardar avances con desplegar.

## Convenciones
Voseo, sin emojis. Medidas desde planos; toda estimación debe identificarse.
Mobiliario: `3d/mobiliario.json` comparte huellas y piezas entre la web y Blender.
No sobreescribir `la-torre.blend`: trabajar sobre la escena Showroom en vivo.
Los scripts que regeneran desde cero se ejecutan en Blender de fondo, no en la escena que David edita.
David quiere ver el trabajo en su Blender abierto: usar el addon local en 127.0.0.1:9876.
No modificar su escena original ni reiniciar la escena de trabajo sin conservar sus cambios.

## Estado actual — 2026-09-07
- Rama `codex/showroom-editable`, sin publicar.
- Visor con seis pisos amueblados, paredes bajas/completas/ocultas, edición local y recorrido.
- Unidad muestra 3B con mayor detalle en `3d/blender/showroom-en-vivo.blend`.
- Materiales PBR de Poly Haven: originales 1K empaquetados en Blender y copias WebP 512 para web.
- El GLB inicial conserva niveles/unidades; la web sigue siendo paramétrica para editar muebles.
- Las mejoras de ambientación del 3B en Blender todavía requieren trasladar el detalle completo a la web.
- Ver `docs/showroom-en-vivo.md` para límites, archivos y comprobaciones.

## Revisión 2026-09-08
- El showroom base fue publicado en 464e0e5.
- Tipologías oficiales: `3d/referencias/tipologias.json` es la fuente de la correspondencia por piso y unidad. PDFs originales e imágenes sin cambios de contenido.
- David definió que por ahora mandan los planos: cubierta de monoambientes no accesible, sin muebles. Consultará al estudio la discrepancia con renders. No publicar la prueba `3d/terraza/` como terraza habitable.
- Se revisaron los cinco PDF. No contienen cotas horizontales generales; conservar la distinción entre proporciones medidas y cotas documentadas.
- Nueva escena independiente `Tipologías oficiales — revisión`, guardada en `3d/blender/referencias-tipologias.blend`; láminas empaquetadas, tamaño de presentación sin escala métrica.
- Pendiente principal: reconstruir y verificar geometría y mobiliario contra estas fuentes. El comparador documental no convierte al modelo actual en réplica exacta.


## Correcciones finales — 2026-09-09
- Showroom retirado: exterior y vistas por planta siguen disponibles.
- Galería móvil apilada con scroll, unidades con botones Norte/Sur, alzados automáticos y pagos secuenciales 01–03. Movimiento reducido conserva alternativas estáticas.
- Retirado contador/lámina de tipologías. Obra resumida a Próximamente. Pie sin LPZ ni WhatsApp duplicado; escudo oficial de Molins verificado contra franciscomolins.com.
- Exterior con renders interiores en ventanas, mobiliario bajo de balcón y plantas colgantes. Control Día/Noche. Ambientación ilustrativa, sin reactivar recorrido interior.

### Correcciones publicadas · 2026-09-10
- Tipologías fijadas con ScrollTrigger: Horizonte → Evolución → Esencia → Cúspide; selección manual sincroniza el scroll. Móvil con lista 2×2 y foto en el mismo viewport.
- Plan de pago compacto: transición entre tres tarjetas, línea de avance y círculo/check en posesión. Movimiento reducido conserva las tres fichas.
- Exterior sin fotos pegadas a ventanas: vidrio con iluminación nocturna, conserva vegetación y muebles de balcón.
- Importante: ScrollTrigger.sort() antes de refresh para medir todos los pins en orden visual.
- QA 375 y 1280 px, Lenis/manual, reduced motion, ficha de unidades, exterior día/noche. Commit dda1ae7.

## Cierre — 2026-09-10
- Correcciones y repaso general publicados en main. Informe: docs/revisiones/2026-09-10-repaso-general.md.
- Footer compacto con ubicación; sin enlace a avance de obra.
- QA móvil/tablet/escritorio, controles del exterior y formularios con respuestas simuladas. Pendiente confirmar recepción de una consulta real con Francisco.
- Fuentes Blender y prueba de terraza conservadas en git, excluidas de Pages. No reactivar showroom ni terraza habitable.
- Cachés Python y respaldos automáticos Blender ignorados.
