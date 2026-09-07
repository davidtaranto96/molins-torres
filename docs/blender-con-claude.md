# Blender conectado a Claude Code (y a Codex)

> Receta reusable. El conector es `blender-mcp` (código abierto, de Siddharth Ahuja): un
> addon adentro de Blender que abre un socket local, y un servidor MCP que Claude o Codex
> usan para mandarle Python a Blender. Claude no "ve" el viewport: pide capturas y lee la
> escena por comandos.

## Una sola vez, en la Mac

1. **Blender**: bajar el DMG oficial de blender.org (versión 4.x) y arrastrarlo a
   Aplicaciones. Nada más: el conector no toca la instalación.
2. **`uv`** ya está instalado (`/opt/homebrew/bin/uv`). Es lo que corre el servidor.
3. **El addon**: bajar `addon.py` del repo `ahujasid/blender-mcp` en GitHub. En Blender:
   Edit → Preferences → Add-ons → Install… → elegir `addon.py` → tildar «Interface: Blender MCP».
4. **Claude Code**: en la terminal,
   ```bash
   claude mcp add blender -s user -- uvx blender-mcp
   ```
   `-s user` lo deja disponible en todos los proyectos. `claude mcp list` tiene que mostrarlo.
5. **Codex** (si se usa): en `~/.codex/config.toml`
   ```toml
   [mcp_servers.blender]
   command = "uvx"
   args = ["blender-mcp"]
   ```

## Cada sesión de trabajo

1. Abrir Blender, apretar `N` en el viewport, solapa **BlenderMCP**, botón **Connect to MCP
   server**. Sin esto el conector no encuentra a Blender y Claude dice que no hay escena.
2. Abrir Claude Code en la carpeta del proyecto. Las tools aparecen como `mcp__blender__*`
   (`get_scene_info`, `execute_blender_code`, `get_viewport_screenshot`, y las de assets de
   Poly Haven y Sketchfab si se activan en el panel).
3. Pedirle cosas concretas: «modelá la planta tipo a partir de `img/plantas/tipo.webp`, a
   escala, con muros de 15 cm y 2,6 m de alto». Claude escribe el script de Python, lo corre
   en Blender y pide una captura para verificar.

## Reglas que conviene darle siempre

- Las medidas salen de los planos, y cada una queda anotada en el script. Nada a ojo.
- Guardar el `.blend` en la carpeta del proyecto y versionar los **scripts** de Python que
  generan la escena, no sólo el `.blend`: así el modelo se regenera cuando cambia un plano.
- Materiales de Poly Haven (gratis, CC0) antes que texturas inventadas.
- Exportar a **GLB con Draco** y, si hay texturas, KTX2. El límite para un sitio en GitHub
  Pages que se abre en celulares es de unos 3 a 5 MB en total; Belgrade Arbor manda 35 y se
  nota.
- Cada exportación se prueba en el sitio a 390 px antes de darla por buena.

## Cómo entra en La Torre

Hoy el 3D es geometría generada en `3d/index.html`. Con Blender el camino es:

1. Modelar el edificio en Blender desde las plantas, los alzados y el corte (los mismos que
   usa la tabla `M` del archivo), con interiores y muebles.
2. Exportar `3d/torre.glb` (Draco).
3. En `3d/index.html`, cargarlo con `GLTFLoader` + `DRACOLoader` en lugar del bloque 6 de
   cajas, manteniendo la selección por unidad: cada unidad tiene que ser un objeto propio
   con nombre `1A`, `1B`… para que el raycast siga funcionando y el estado del CRM la tiña.
4. El modo Piso por piso pasa a mover las colecciones por nivel del GLB en vez de las losas.

Lo que no cambia: el cielo con hora, el reloj, las cámaras, el panel y el CRM.
