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
