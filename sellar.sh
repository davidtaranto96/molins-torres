#!/bin/sh
# Versiona el CSS y el JS para que el navegador no sirva uno viejo con un HTML
# nuevo (pasó el 3/9: la sección oscura salía crema y sin recortes).
# Correrlo antes de cada commit que toque estilos.css o app.js.
cd "$(dirname "$0")" || exit 1
# El iframe también necesita versión cuando cambia su HTML o sus controles.
visor=$(shasum -a 256 3d/index.html | cut -c1-12)
sed -i '' -E "s@tresd: \"3d/([^\"]*)\",@tresd: \"3d/?v=$visor\",@" app.js
v=$(date +%Y%m%d%H%M) && sed -i '' -E "s/(estilos\.css|app\.js)\?v=[0-9]+/\1?v=$v/g" index.html && echo "sellado $v"
