# Handoff para Codex — showroom virtual de La Torre en Blender

> Copiar desde «Sos un…» hasta el final y pegarlo en Codex abierto en la carpeta
> `molins-torres`. Antes: Blender abierto con el addon conectado (`N` → «MCP for Blender»
> → Connect) y Codex con el conector registrado en `~/.codex/config.toml`:
>
> ```toml
> [mcp_servers.blender]
> command = "uvx"
> args = ["blender-mcp"]
> ```
>
> Trabajar en una rama (`git checkout -b showroom-codex`) y mezclar cuando David lo vea.

---

Sos un artista técnico 3D trabajando en Blender 5.2 a través del conector `blender-mcp`
(tools `get_scene_info`, `execute_blender_code`, `get_viewport_screenshot`, y las de assets
de Poly Haven). El proyecto es el **Edificio La Torre**: 12 departamentos en Aniceto Latorre
571, Salta, Argentina, del estudio CB Arquitectura, que comercializa Molins Negocios
Inmobiliarios. El objetivo final es un **showroom virtual estilo Sims** para la web del
edificio: el comprador ve el edificio, lo abre piso por piso, saca paredes, mira cada
departamento amueblado desde arriba y desde adentro, y elige su unidad.

## Qué hay hecho (leelo antes de tocar nada)

- **`3d/blender/la-torre.py`**: script que genera el edificio entero en Blender desde una
  tabla de medidas (`M`) tomada del corte longitudinal, los alzados y las plantas del
  arquitecto. Corre adentro de Blender y regenera la escena completa. **Es la fuente de
  verdad**: todo cambio de geometría se hace en el script, no a mano en el `.blend`, para que
  el edificio se regenere cuando el arquitecto corrija una medida.
- **`3d/blender/la-torre.blend`**: la escena generada por ese script. Colecciones: `La Torre`
  → `Planta baja`, `Nivel 1` … `Nivel 6`, `Fachada`, `Azotea`; y `Entorno`. En cada nivel hay
  la losa, el plano del arquitecto como textura sobre la losa (`Plano k`), los muros
  interiores extruidos (`Muro k.i`) y un **empty con el nombre de cada unidad** (`1A`, `1B` …
  `6A`, `6B`): esos nombres no se cambian, la web los usa para pintar el estado (libre,
  reservada, vendida) que llega del CRM.
- **`3d/muros.json`**: los muros de cada planta como rectángulos en porcentaje del plano,
  sacados del dibujo (las líneas gruesas son muros). Claves `pb`, `tipo` (plantas 1 a 4),
  `p5`, `p6`.
- **`img/plantas/*.webp`**: las cuatro plantas. **`img/*.jpg`**: renders del proyecto, que son
  la referencia de materiales y de cómo se ven los interiores: `interior-estar`,
  `interior-comedor`, `interior-balcon`, `area-suite`, `area-estar`, `area-terraza`,
  `detalle-balcones`, `hall-noche`, `pasillo-verde`, `cochera-dia`.
- **Los planos originales**: `Broshure completo Latorre/02. TIPOLOGÍAS/` (`La Torre
  Plantas.pdf`, `La Torre Vistas.pdf` con los alzados y el corte cotado) y las fichas técnicas
  en `06. Fichas tecnicas/`.
- **La web**: `3d/index.html` es el visor actual en three.js, con geometría generada por
  código, cielo con hora del día, selección de unidad y un modo «Piso por piso». El GLB que
  salga de Blender va a reemplazar la geometría de ese archivo; el resto (cielo, reloj,
  cámaras, panel, CRM) queda.

## Ejes y convenciones de la escena

- X es el frente entre medianeras (7 m), Y el fondo del lote (**la calle en -Y**), Z la
  altura. La izquierda del plano dibujado cae en +X.
- Niveles cotados del corte: piso de PB +0,20, plantas en +3,20 / +6,00 / +8,80 / +11,60 /
  +14,40 / +17,20, azotea +20,00, caja de escalera +23,20, tanques hasta +26,00.
- Dos torres: **Norte** (sobre la calle, unidades A) y **Sur** (al fondo, unidades B), con el
  núcleo de escalera, ascensor, palier y el patio de aire y luz de 16,40 m² al medio. En los
  pisos 5 y 6 la Torre Norte retira el frente 4 m; el 5.º A queda con terraza sobre el techo
  del 4.º.
- Tipologías: Horizonte (6A, monoambiente 37 m²), Evolución (5A, 42 m²), Esencia (1A a 4A,
  1 dormitorio en suite, 55 m²), Cúspide (todas las B, 55 m²).

## Qué quiero, en este orden

1. **Materiales reales.** Ladrillo visto en los pilares de esquina, hormigón de encofrado en
   losas y parasoles, listones de madera, aluminio negro, vidrio 6+6, revoque claro,
   porcelanato adentro, muro verde en las cocheras. Texturas PBR de Poly Haven (CC0) a 1K,
   nunca más de 2K. Guardarlas empaquetadas en el `.blend`.
2. **Muebles en cada planta**, donde el plano los dibuja y del tamaño que dibuja: camas,
   mesas con sillas, sillones, mesada de cocina con bacha y anafe, sanitarios, placares,
   lavarropas en el balcón de servicio. Estilo de los renders: sobrio, maderas claras, negro,
   plantas. Modelado paramétrico en el script (una función por mueble) o assets livianos de
   Poly Haven; nada bajado de otros lados. Cada mueble en la colección de su nivel y con
   nombre `Mueble k <ambiente>`.
3. **Carpinterías y aberturas**: puertas como hojas en los vanos de los muros, puertas
   ventana y ventanas con marco negro en los huecos que dan a fachada, barandas con sus
   barras, cortinas. Cielorrasos y zócalos.
4. **Modos del showroom** (para que la web los pueda disparar sobre el GLB):
   - *Entero*: el edificio como se ve desde la calle.
   - *Piso por piso*: los niveles separados en vertical (una propiedad de desfasaje por
     colección, o un empty padre por nivel que la web mueva).
   - *Sin paredes*: los muros interiores ocultos o a 30 cm de alto, estilo Sims, para ver el
     amueblamiento desde arriba. Que los muros de un nivel sean **un solo objeto** por nivel
     (`Muros k`) para poder ocultarlos con un toggle.
   - *Adentro*: cámaras guardadas por ambiente en cada unidad (`Cam 3A estar`, etc.).
5. **Luz y cielo**: sol con la posición de Salta (24,8° S) para tres momentos (mediodía,
   atardecer, noche con las ventanas encendidas), world con cielo, y una vuelta de
   iluminación interior cálida.
6. **Exportar** a `3d/torre.glb` con Draco, texturas en KTX2 si hace falta, **menos de 5 MB en
   total**, con los nombres de unidades y niveles intactos, y un `3d/torre.json` que liste
   qué colección es cada nivel, qué objeto son los muros de cada nivel y qué cámaras hay.
   Probar que carga en `3d/index.html` con `GLTFLoader` + `DRACOLoader`.

## Reglas

- **Ninguna medida inventada.** Lo que no esté en los planos se estima a partir de los
  renders y queda marcado como estimado en un comentario del script.
- **El script manda.** Toda geometría nueva se agrega a `la-torre.py` (o a módulos al lado,
  `muebles.py`, `materiales.py`) y la escena se regenera desde cero cada vez. El `.blend` es
  un producto, no la fuente.
- **Nombres en español**, sin emojis, como está el script. Los nombres `1A`…`6B` y las
  colecciones `Nivel k` no se cambian.
- **Peso**: la web se abre en celulares de gama media. Menos de 200 mil triángulos en total,
  texturas a 1K, instancias para lo repetido (los seis pisos comparten muebles).
- **Verificar con capturas** (`get_viewport_screenshot` o render EEVEE) después de cada
  paso: la fachada desde la calle, un nivel desde arriba sin paredes, un ambiente desde
  adentro. Adjuntarlas al reporte y decir qué quedó estimado.
- Commits chicos, en español, uno por tema, con el porqué.

## Dos cosas pendientes de confirmar con el cliente (no resolverlas solo)

- El plano de la planta 5 rotula el frente como «terraza no accesible» y el sitio vende esa
  unidad como «monoambiente con terraza propia». Modelar la terraza como está en el plano y
  dejar una nota.
- La planta baja del plano mide unos 34 m de fondo y el modelo actual tiene 44 m de
  cocheras (tomados del corte, que no las acota). Usar los 34 m del plano y anotarlo.
