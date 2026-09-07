"""La Torre en Blender, generada por código.

Misma tabla de medidas que 3d/index.html (bloque 1): cada número sale del corte
longitudinal, los alzados y las plantas de CB Arquitectura. Los muros interiores
salen de 3d/muros.json (rectángulos en porcentaje de cada planta) y las plantas
van como textura sobre la losa de cada nivel.

Ejes: X es el frente (entre medianeras), Y el fondo del lote (la calle en -Y),
Z la altura. La izquierda del plano dibujado cae en +X.

Se corre adentro de Blender (Text Editor, o vía blender-mcp con execute_code).
Regenera la escena entera: borra lo que había.
"""
import bpy, bmesh, json, os, math

RAIZ = os.environ.get("TORRE_RAIZ", "/Users/dt/Documents/DT-System/molins-torres")

M = dict(frente=7.0, cuerpoNorte=7.3, nucleo=6.6, cuerpoSur=6.9, balconFrente=1.4, balconFondo=0.9,
         patioAncho=2.5, altoPB=3.2, altoPiso=2.8, niveles=6, parapeto=0.9, cajaEscalera=3.2,
         plataforma=1.0, tanque=1.8, retiro=4.0, losa=0.2, pilar=0.8, fondoCocheras=21.0, medianera=2.8)
LARGO_CUERPO = M["cuerpoNorte"] + M["nucleo"] + M["cuerpoSur"]
ALTO_TOTAL = M["altoPB"] + M["niveles"] * M["altoPiso"]
yF = -LARGO_CUERPO / 2; yLM = yF - M["balconFrente"]; yN0 = yF + M["cuerpoNorte"]; yN1 = yN0 + M["nucleo"]
yB = LARGO_CUERPO / 2; yLF = yB + M["balconFondo"]; yR = yLM + M["retiro"]
def zNivel(k): return M["altoPB"] + (k - 1) * M["altoPiso"]
X_FIN = M["frente"] / 2 - M["pilar"] - 0.05

PLANTAS = {"pb": 0.2083, "tipo": 0.2957, "p5": 0.3261, "p6": 0.3502}
NIVELES = [("pb", 0), ("tipo", 1), ("tipo", 2), ("tipo", 3), ("tipo", 4), ("p5", 5), ("p6", 6)]

# ── limpiar ──
for o in list(bpy.data.objects): bpy.data.objects.remove(o, do_unlink=True)
for c in list(bpy.data.collections): bpy.data.collections.remove(c)
for m in list(bpy.data.materials): bpy.data.materials.remove(m)
for i in list(bpy.data.images):
    if i.users == 0: bpy.data.images.remove(i)

def coleccion(nombre, padre=None):
    c = bpy.data.collections.new(nombre); (padre or bpy.context.scene.collection).children.link(c); return c

def principled(m):
    """el nodo Principled del material, creado y conectado si el árbol viene vacío (Blender 5)."""
    nt = m.node_tree
    p = next((n for n in nt.nodes if n.type == "BSDF_PRINCIPLED"), None)
    if p is None:
        p = nt.nodes.new("ShaderNodeBsdfPrincipled")
        out = next((n for n in nt.nodes if n.type == "OUTPUT_MATERIAL"), None) or nt.nodes.new("ShaderNodeOutputMaterial")
        nt.links.new(p.outputs["BSDF"], out.inputs["Surface"])
    return p

def material(nombre, color, rug=0.8, metal=0.0, vidrio=False, emision=0.0):
    m = bpy.data.materials.new(nombre); m.use_nodes = True
    p = principled(m)
    p.inputs["Base Color"].default_value = (*color, 1); p.inputs["Roughness"].default_value = rug
    p.inputs["Metallic"].default_value = metal
    if vidrio:
        p.inputs["Transmission Weight"].default_value = 0.85; p.inputs["Roughness"].default_value = 0.05
        p.inputs["IOR"].default_value = 1.5
    if emision:
        p.inputs["Emission Color"].default_value = (1, 0.72, 0.42, 1); p.inputs["Emission Strength"].default_value = emision
    return m

MAT = dict(
    ladrillo=material("Ladrillo", (0.52, 0.26, 0.18), 0.95),
    revoque=material("Revoque", (0.86, 0.83, 0.77), 0.9),
    hormigon=material("Hormigon", (0.62, 0.60, 0.57), 0.88),
    encofrado=material("Encofrado", (0.72, 0.70, 0.66), 0.85),
    madera=material("Madera listones", (0.40, 0.29, 0.20), 0.65),
    metal=material("Aluminio negro", (0.05, 0.05, 0.05), 0.45, 0.4),
    vidrio=material("Vidrio", (0.75, 0.85, 0.9), vidrio=True),
    muro=material("Muro interior", (0.93, 0.91, 0.87), 0.9),
    piso=material("Porcelanato", (0.55, 0.53, 0.5), 0.35),
    losa=material("Losa", (0.82, 0.80, 0.76), 0.9),
    suelo=material("Asfalto", (0.22, 0.22, 0.22), 0.98),
    vereda=material("Vereda", (0.6, 0.58, 0.55), 0.95),
    medianera=material("Medianera", (0.8, 0.78, 0.74), 0.95),
    verde=material("Muro verde", (0.25, 0.42, 0.2), 1.0),
    tanque=material("Tanque", (0.85, 0.83, 0.78), 0.6),
)

def caja(nombre, w, h, p, x, y, z, mat, col):
    """caja de w (X) × p (Y) × h (Z), apoyada en z."""
    me = bpy.data.meshes.new(nombre); bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(nombre, me); o.scale = (w, p, h); o.location = (x, y, z + h / 2)
    me.materials.append(mat); col.objects.link(o); return o

# ── colecciones ──
cEdif = coleccion("La Torre"); cEnt = coleccion("Entorno")
cNiv = {k: coleccion(f"Nivel {k}" if k else "Planta baja", cEdif) for _, k in NIVELES}
cFach = coleccion("Fachada", cEdif); cAzotea = coleccion("Azotea", cEdif)

# ── muros y plantas por nivel ──
muros = json.load(open(os.path.join(RAIZ, "3d", "muros.json")))
def plano_textura(clave):
    ruta = os.path.join(RAIZ, "img", "plantas", clave + ".webp")
    nom = "Planta " + clave
    if nom in bpy.data.materials: return bpy.data.materials[nom]
    m = bpy.data.materials.new(nom); m.use_nodes = True
    nt = m.node_tree; p = principled(m)
    tex = nt.nodes.new("ShaderNodeTexImage"); tex.image = bpy.data.images.load(ruta)
    nt.links.new(tex.outputs["Color"], p.inputs["Base Color"]); p.inputs["Roughness"].default_value = 0.6
    return m

for clave, k in NIVELES:
    col = cNiv[k]; z0 = 0.0 if k == 0 else zNivel(k)
    largo = M["frente"] / PLANTAS[clave]
    yTope = yLM + largo if k == 0 else yLF
    yc = yTope - largo / 2
    alto = (M["altoPB"] if k == 0 else M["altoPiso"]) - M["losa"]
    # la losa con el plano encima
    losa = caja(f"Losa {k}", M["frente"] + 0.1, M["losa"], largo + 0.1, 0, yc, z0 - M["losa"], MAT["losa"], col)
    me = bpy.data.meshes.new(f"Plano {k}"); bm = bmesh.new()
    vs = [bm.verts.new(v) for v in [(-M["frente"]/2, yc - largo/2, 0), (M["frente"]/2, yc - largo/2, 0), (M["frente"]/2, yc + largo/2, 0), (-M["frente"]/2, yc + largo/2, 0)]]
    f = bm.faces.new(vs); uv = bm.loops.layers.uv.new()
    for l in f.loops:
        x, y, _ = l.vert.co
        l[uv].uv = (0.5 - x / M["frente"], 0.5 + (y - yc) / largo)   # izquierda del dibujo en +X, arriba en +Y
    bm.to_mesh(me); bm.free()
    op = bpy.data.objects.new(f"Plano {k}", me); op.location = (0, 0, z0 + 0.005); me.materials.append(plano_textura(clave)); col.objects.link(op)
    # los muros extruidos
    for i, (x0, y0, x1, y1) in enumerate(muros[clave]):
        X1 = M["frente"] / 2 - x0 / 100 * M["frente"]; X0 = M["frente"] / 2 - x1 / 100 * M["frente"]
        Y1 = yTope - y0 / 100 * largo; Y0 = yTope - y1 / 100 * largo
        caja(f"Muro {k}.{i}", X1 - X0, alto, Y1 - Y0, (X0 + X1) / 2, (Y0 + Y1) / 2, z0, MAT["muro"], col)
    # las unidades, como cajas vacías con nombre, para que el estado del CRM las encuentre
    if k:
        for letra, ya, yb in (("A", (yR if k >= 5 else yF), yN0), ("B", yN1, yB)):
            u = bpy.data.objects.new(f"{k}{letra}", None); u.empty_display_type = "CUBE"
            u.location = (0, (ya + yb) / 2, z0 + alto / 2); u.scale = (M["frente"] / 2, (yb - ya) / 2, alto / 2); col.objects.link(u)

# ── fachada ──
XP = M["frente"] / 2 - M["pilar"] / 2 + 0.06
for sx in (-1, 1):
    caja("Pilar frente", M["pilar"], zNivel(5), M["pilar"], sx * XP, yF + M["pilar"] / 2 - 0.1, 0, MAT["ladrillo"], cFach)
    caja("Pilar fondo", M["pilar"], ALTO_TOTAL, M["pilar"], sx * XP, yB - M["pilar"] / 2 + 0.1, 0, MAT["ladrillo"], cFach)
    # medianeras del cuerpo, revocadas
    caja("Medianera cuerpo", 0.25, ALTO_TOTAL, LARGO_CUERPO, sx * (M["frente"] / 2 - 0.125), 0, 0, MAT["revoque"], cFach)
# la fachada retirada de los pisos 5 y 6 y el paño ciego sobre ella
caja("Paño retirado", M["frente"] - 2 * M["pilar"], ALTO_TOTAL - zNivel(5), 0.25, 0, yR + 0.125, zNivel(5), MAT["revoque"], cFach)
for k in range(1, 7):
    z = zNivel(k)
    frentes = [(yLM, yF, -1, M["balconFrente"])] if k <= 4 else []
    frentes.append((yB, yLF, 1, M["balconFondo"]))
    for ya, yb, d, prof in frentes:
        yc = (ya + yb) / 2
        caja(f"Balcón {k}", 2 * X_FIN + 0.1, M["losa"], prof + 0.1, 0, yc, z - M["losa"], MAT["encofrado"], cFach)
        # baranda: pasamanos y cinco barras
        yBar = (ya if d < 0 else yb) - d * 0.06
        for j in range(5): caja("Baranda", 2 * X_FIN, 0.03, 0.03, 0, yBar, z + 0.24 + j * 0.2, MAT["metal"], cFach)
        for sx in (-1, 1): caja("Parante", 0.04, 1.08, 0.04, sx * X_FIN, yBar, z, MAT["metal"], cFach)
        # listones de madera delante del balcón
        for j in range(7): caja("Listón", 0.05, M["altoPiso"] - 0.35, 0.14, 0.65 - 0.54 + j * 0.18, yBar + d * 0.12, z, MAT["madera"], cFach)
        # puertas ventana de piso a techo detrás del balcón
        yV = (yb if d < 0 else ya) + d * 0.03
        for x0, x1 in ((1.35, 2.5), (-2.5, 0.0)):
            caja("Vidrio", x1 - x0, M["altoPiso"] - M["losa"] - 0.12, 0.06, (x0 + x1) / 2, yV, z + 0.02, MAT["vidrio"], cFach)
            caja("Marco", x1 - x0, 0.07, 0.12, (x0 + x1) / 2, yV, z + M["altoPiso"] - M["losa"] - 0.17, MAT["metal"], cFach)
            for xx in (x0, x1, (x0 + x1) / 2): caja("Parante marco", 0.07, M["altoPiso"] - M["losa"] - 0.12, 0.12, xx, yV, z + 0.02, MAT["metal"], cFach)
    if k >= 5:   # ventanas del paño retirado
        for x0, x1, z0v, z1v in ((0.95, 2.35, 0.9, 2.3), (-2.25, 0.15, 0.8, 2.4)):
            caja("Ventana", x1 - x0, z1v - z0v, 0.06, (x0 + x1) / 2, yR - 0.03, z + z0v, MAT["vidrio"], cFach)
# parasoles verticales de hormigón en los bordes de los balcones, y la viga de remate
for ya, yb, zt in ((yLM, yF, zNivel(5) - M["losa"]), (yB, yLF, ALTO_TOTAL - M["losa"])):
    for sx in (-1, 1): caja("Parasol", 0.1, zt - 3.0, yb - ya + 0.1, sx * X_FIN, (ya + yb) / 2, 3.0, MAT["encofrado"], cFach)
    caja("Viga remate", 2 * X_FIN + 0.1, 0.4, yb - ya + 0.1, 0, (ya + yb) / 2, zt - 0.4, MAT["encofrado"], cFach)
# la terraza del 5.º A sobre el techo del 4.º
z5 = zNivel(5)
for j in range(5): caja("Baranda terraza", 2 * X_FIN, 0.03, 0.03, 0, yLM + 0.06, z5 + 0.24 + j * 0.2, MAT["metal"], cFach)
# ── azotea ──
caja("Parapeto frente", M["frente"] - 2 * M["pilar"], M["parapeto"], 0.3, 0, yR + 0.15, ALTO_TOTAL, MAT["encofrado"], cAzotea)
caja("Parapeto fondo", 2 * X_FIN + 0.1, M["parapeto"], M["balconFondo"] + 0.1, 0, (yB + yLF) / 2, ALTO_TOTAL, MAT["encofrado"], cAzotea)
anchoN = M["frente"] - M["patioAncho"]
caja("Caja de escalera", anchoN, M["cajaEscalera"], M["nucleo"], M["patioAncho"] / 2, (yN0 + yN1) / 2, ALTO_TOTAL, MAT["revoque"], cAzotea)
caja("Plataforma tanques", anchoN, M["plataforma"], M["nucleo"], M["patioAncho"] / 2, (yN0 + yN1) / 2, ALTO_TOTAL + M["cajaEscalera"], MAT["hormigon"], cAzotea)
for dy in (-1.6, 1.6):
    bpy.ops.mesh.primitive_cylinder_add(radius=0.75, depth=M["tanque"], location=(M["patioAncho"] / 2, (yN0 + yN1) / 2 + dy, ALTO_TOTAL + M["cajaEscalera"] + M["plataforma"] + M["tanque"] / 2))
    t = bpy.context.active_object; t.name = "Tanque"; t.data.materials.append(MAT["tanque"])
    for c in t.users_collection: c.objects.unlink(t)
    cAzotea.objects.link(t)
# ── cocheras y entorno ──
caja("Piso cocheras", M["frente"], 0.1, M["fondoCocheras"], 0, yLF + M["fondoCocheras"] / 2, 0, MAT["piso"], cEnt)
for sx in (-1, 1): caja("Medianera cocheras", 0.2, M["medianera"], M["fondoCocheras"] + M["balconFondo"], sx * (M["frente"] / 2 - 0.1), yB + (M["fondoCocheras"] + M["balconFondo"]) / 2, 0, MAT["medianera"], cEnt)
caja("Muro verde", M["frente"] + 0.4, M["medianera"], 0.25, 0, yLF + M["fondoCocheras"] + 0.125, 0, MAT["verde"], cEnt)
caja("Vereda", 40, 0.15, 3.0, 0, yLM - 1.5, -0.15, MAT["vereda"], cEnt)
caja("Calle", 120, 0.02, 120, 0, 0, -0.17, MAT["suelo"], cEnt)
caja("Vecino izq", 9, 6.2, 12, 8.2, yLM + 6.6, 0, MAT["medianera"], cEnt)
caja("Vecino der", 9, 3.1, 14, -8.2, yLM + 9.2, 0, MAT["medianera"], cEnt)

# ── luz y cámara ──
bpy.ops.object.light_add(type="SUN", location=(10, -10, 30)); sol = bpy.context.active_object
sol.data.energy = 4.0; sol.data.angle = math.radians(1.5); sol.rotation_euler = (math.radians(50), 0, math.radians(-35))
w = bpy.context.scene.world or bpy.data.worlds.new("World"); bpy.context.scene.world = w; w.use_nodes = True
bg = next((n for n in w.node_tree.nodes if n.type == "BACKGROUND"), None)
if bg is None:
    bg = w.node_tree.nodes.new("ShaderNodeBackground"); wo = next((n for n in w.node_tree.nodes if n.type == "OUTPUT_WORLD"), None) or w.node_tree.nodes.new("ShaderNodeOutputWorld")
    w.node_tree.links.new(bg.outputs["Background"], wo.inputs["Surface"])
bg.inputs["Color"].default_value = (0.62, 0.72, 0.85, 1); bg.inputs["Strength"].default_value = 1.0
bpy.ops.object.camera_add(location=(-24, -38, 15)); cam = bpy.context.active_object; cam.name = "Como el render"
cam.data.lens = 38
mira = bpy.data.objects.new("Mira", None); mira.location = (0, -2, 9.5); bpy.context.scene.collection.objects.link(mira)
tr = cam.constraints.new("TRACK_TO"); tr.target = mira; tr.track_axis = "TRACK_NEGATIVE_Z"; tr.up_axis = "UP_Y"
bpy.context.scene.camera = cam
sc = bpy.context.scene
motores = [e.identifier for e in bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items]
sc.render.engine = "BLENDER_EEVEE_NEXT" if "BLENDER_EEVEE_NEXT" in motores else ("BLENDER_EEVEE" if "BLENDER_EEVEE" in motores else motores[0])
sc.render.resolution_x = 1400; sc.render.resolution_y = 1000
print("La Torre armada:", len(bpy.data.objects), "objetos")
