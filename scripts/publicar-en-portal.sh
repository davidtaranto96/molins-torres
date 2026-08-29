#!/usr/bin/env bash
# Copia el sitio de La Torre adentro del repo del portal, que es lo que sirve
# GitHub Pages en franciscomolins.com/torres/.
#
# POR QUÉ ASÍ Y NO CON UN REPO PROPIO EN PAGES: el dominio de La Torre todavía
# no está decidido (ver docs/dominio.md). Hasta que se decida, la dirección es
# una subcarpeta del portal, y por eso el sitio vive en dos lugares.
#
# LA FUENTE ES ESTE REPO. `crm-molins/portal/torres/` es una COPIA: no se edita
# a mano nunca. Si hay que cambiar algo, se cambia acá y se vuelve a correr
# esto. La trampa de los clones desincronizados ya nos costó caro con BAZA.
set -euo pipefail

ORIGEN="$(cd "$(dirname "$0")/.." && pwd)"
DESTINO="${1:-/Users/dt/Documents/DT-System/crm-molins/portal/torres}"

[ -d "$DESTINO" ] || { echo "No existe $DESTINO"; exit 1; }
[ -f "$ORIGEN/index.html" ] || { echo "No hay index.html en $ORIGEN — corré antes: node scripts/transpilar.mjs torre"; exit 1; }

cp "$ORIGEN/index.html" "$DESTINO/index.html"
mkdir -p "$DESTINO/src"
cp "$ORIGEN/src/"*.js "$ORIGEN/src/"*.css "$DESTINO/src/"
mkdir -p "$DESTINO/img"
cp "$ORIGEN/img/"*.jpg "$DESTINO/img/" 2>/dev/null || true

echo "Copiado a $DESTINO:"
echo "  index.html + src/ ($(ls "$DESTINO/src" | tr '\n' ' '))"
echo "  img/: $(ls "$DESTINO/img"/*.jpg 2>/dev/null | wc -l | tr -d ' ') jpg"
echo
echo "Falta commitear y pushear el repo del portal."
