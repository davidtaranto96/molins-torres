"""Terraza reconstruida desde 18- Edificio exterior.jpg. Dimensiones y caras ocultas estimadas."""
import bpy, math, random, pathlib
from mathutils import Vector
BASE=pathlib.Path('/Users/dt/Documents/DT-System/molins-torres/3d'); OUT=BASE/'terraza';OUT.mkdir(exist_ok=True)
name='Terraza referencia'
if bpy.data.scenes.get(name):
 if len(bpy.data.scenes[name].objects): raise RuntimeError('La muestra ya tiene objetos: conservarla.')
 bpy.data.scenes.remove(bpy.data.scenes[name])
s=bpy.data.scenes.new(name);bpy.context.window.scene=s;s.unit_settings.system='METRIC'
col=s.collection
mats={}
def mat(name,color,rough=.6,metal=0):
 m=bpy.data.materials.new('Terraza '+name);m.use_nodes=True;p=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal;mats[name]=m;return m
wall=mat('Revoque',(.61,.59,.52),.86);conc=mat('Hormigón',(.56,.55,.51),.85);black=mat('Metal grafito',(.019,.017,.016),.35,.55);rope=mat('Tejido oscuro',(.028,.022,.019),.76);wood=mat('Teca',(.18,.085,.035),.65);white=mat('Cerámica',(.82,.80,.72),.36);soil=mat('Tierra',(.038,.025,.014),1);chrome=mat('Acero',(.48,.49,.47),.25,.9);stone=mat('Piedra mesa',(.77,.77,.72),.29)
glass=mat('Vidrio',(.92,.96,.96),.12);p=next(n for n in glass.node_tree.nodes if n.type=='BSDF_PRINCIPLED');p.inputs['Transmission Weight'].default_value=1;p.inputs['IOR'].default_value=1.45
leafm=[mat('Hoja '+str(i),c,.48) for i,c in enumerate([(.12,.25,.025),(.23,.34,.035),(.055,.17,.02)])]
def texture(m,prefix,scale):
 nt=m.node_tree;p=next(n for n in nt.nodes if n.type=='BSDF_PRINCIPLED');tex=nt.nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(BASE/'texturas'/f'{prefix}_diff.jpg'),check_existing=True);tex.image.pack();nt.links.new(tex.outputs['Color'],p.inputs['Base Color'])
 for channel in ['rough','nor_gl']:
  t=nt.nodes.new('ShaderNodeTexImage');t.image=bpy.data.images.load(str(BASE/'texturas'/f'{prefix}_{channel}.jpg'),check_existing=True);t.image.colorspace_settings.name='Non-Color';t.image.pack()
  if channel=='rough':nt.links.new(t.outputs['Color'],p.inputs['Roughness'])
  else:n=nt.nodes.new('ShaderNodeNormalMap');n.inputs['Strength'].default_value=.32;nt.links.new(t.outputs['Color'],n.inputs['Color']);nt.links.new(n.outputs['Normal'],p.inputs['Normal'])
texture(wall,'painted_plaster_wall',1)
def parent(name,x,y,z=0,rot=0):
 o=bpy.data.objects.new(name,None);col.objects.link(o);o.location=(x,y,z);o.rotation_euler.z=rot;o['editable']=True;return o
fixed=parent('Arquitectura',0,0);fixed['editable']=False
objects=[]
def finish(o,name,material,pa):
 o.name=name;o.data.materials.append(material)
 for c in list(o.users_collection):c.objects.unlink(o)
 col.objects.link(o);o.parent=pa;objects.append(o);return o
def box(name,dim,pos,material,pa=fixed,bevel=.008):
 bpy.ops.mesh.primitive_cube_add(size=1);o=finish(bpy.context.object,name,material,pa);o.location=pos;o.scale=dim;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 if bevel:b=o.modifiers.new('Cantos','BEVEL');b.width=bevel;b.segments=3
 return o
def sphere(name,dim,pos,material,pa):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=24,ring_count=12,radius=1);o=finish(bpy.context.object,name,material,pa);o.location=pos;o.scale=dim
 for f in o.data.polygons:f.use_smooth=True
 return o
def tube(name,points,r,material,pa=fixed):
 cu=bpy.data.curves.new(name,'CURVE');cu.dimensions='3D';cu.bevel_depth=r;cu.bevel_resolution=2;sp=cu.splines.new('POLY');sp.points.add(len(points)-1)
 for p,co in zip(sp.points,points):p.co=(*co,1)
 o=bpy.data.objects.new(name,cu);col.objects.link(o);o.parent=pa;o.data.materials.append(material);objects.append(o);return o
def ring(name,r,z,material,pa,thick=.012):return tube(name,[(r*math.cos(i*math.tau/64),r*math.sin(i*math.tau/64),z) for i in range(65)],thick,material,pa)
def cylinder(name,r,d,pos,material,pa=fixed):
 bpy.ops.mesh.primitive_cylinder_add(vertices=48,radius=r,depth=d);o=finish(bpy.context.object,name,material,pa);o.location=pos
 for f in o.data.polygons:f.use_smooth=True
 b=o.modifiers.new('Borde','BEVEL');b.width=.006;b.segments=2
 return o
# Terraza de 6,4 x 3,4 m: escala estimada con puertas y baldosas de la referencia.
box('Losa',(6.6,3.7,.20),(0,0,-.11),conc)
rng=random.Random(12)
for i in range(11):
 for j in range(6):
  c=.60+rng.uniform(-.04,.04);tile=mat(f'Porcelanato {i}-{j}',(c,c*.97,c*.89),.29)
  box('Baldosa',(.596,.596,.025),(-3+i*.6,-1.5+j*.6,.01),tile,bevel=.002)
# Fachada con dos huecos verdaderos, carpinterías y habitaciones detrás.
for x,w in [(-3.05,.5),(-.50,1.2),(2.8,1.0)]:box('Machón fachada',(w,.20,2.8),(x,1.8,1.4),wall)
box('Dintel continuo',(6.6,.28,.43),(0,1.8,2.60),conc)
for cx,w in [(-1.90,1.8),(1.30,1.9)]:
 for x in [cx-w/2,cx,cx+w/2]:box('Perfil ventana',(.046,.11,2.30),(x,1.74,1.16),black)
 for z in [.025,2.3]:box('Travesaño',(w,.11,.046),(cx,1.74,z),black)
 for x in [cx-w/4,cx+w/4]:box('Vidrio',(.5*w-.05,.012,2.23),(x,1.755,1.16),glass,bevel=0)
 box('Cortina',(w*.80,.028,2.20),(cx,2.20,1.15),white,bevel=0)
box('Pared fondo interior',(6.6,.15,2.8),(0,3.05,1.4),wall)
box('Piso interior',(6.6,1.3,.12),(0,2.4,-.06),white)
for sx in [-1,1]:box('Murete lateral',(.18,3.4,1.0),(sx*3.22,0,.50),wall)
box('Viga frontal',(6.6,.24,.28),(0,-1.65,2.65),conc)
for x in [-3.2,.10]:box('Columna',(.18,.24,2.8),(x,-1.65,1.4),wall)
for i in range(9):box('Parasol',(.042,.13,2.52),(.30+i*.085,-1.65,1.26),black)
for a,b in [(-3.12,.05),(1.1,3.12)]:
 for j in range(11):box('Baranda horizontal',(b-a,.035,.023),((a+b)/2,-1.72,.28+j*.078),black,bevel=.003)
 for x in [a,b]:box('Parante',(.028,.05,.94),(x,-1.70,.70),black)
# Deck sobre porcelanato, como el render.
for i in range(25):box('Tabla deck',(.095,1.65,.025),(-2.70+i*.10,.28,.044),wood,bevel=.003)
# Sillas tejidas: aro elíptico inclinado, radios curvos y base cruzada.
def chair(name,x,y,rot):
 pa=parent(name,x,y,rot=rot)
 pts=[]
 for i in range(65):
  a=i*math.tau/64;pts.append((.43*math.cos(a),.30*math.sin(a),.69+.22*math.sin(a)))
 tube('Aro continuo',pts,.017,black,pa)
 for i in range(44):
  a=i*math.tau/44;end=Vector((.43*math.cos(a),.30*math.sin(a),.69+.22*math.sin(a)));start=Vector((.025*math.cos(a),-.13,.43));points=[]
  for j in range(9):
   t=j/8;p=start.lerp(end,t);p.z-=.065*math.sin(math.pi*t);points.append(tuple(p))
  tube('Cordón tejido',points,.006,rope,pa)
 for ax in [-1,1]:
  for ay in [-1,1]:tube('Base cruzada',[(ax*.34,ay*.30,.055),(0,0,.32),(ax*.19,ay*.17,.45)],.02,black,pa)
 return pa
chair('Sillón tejido izquierdo',-2.45,-.10,-.45);chair('Sillón tejido derecho',-.65,-.03,.45)
pa=parent('Mesa circular',-1.54,.42)
for z in [.07,.46]:ring('Aro mesa',.38,z,black,pa)
for i in range(64):a=i*math.tau/64;tube('Alambre mesa',[(.38*math.cos(a),.38*math.sin(a),.07),(.38*math.cos(a),.38*math.sin(a),.46)],.003,black,pa)
cylinder('Tapa piedra',.375,.026,(0,0,.48),stone,pa)
# Parrilla esférica, tapa, asas y patas.
pa=parent('Parrilla',-2.65,1.25)
sphere('Cuerpo parrilla',(.26,.26,.25),(0,0,.77),black,pa);ring('Junta tapa',.257,.79,chrome,pa,.006)
box('Asa tapa',(.13,.035,.033),(0,0,1.045),black,pa)
for a in [0,2.1,4.2]:tube('Pata parrilla',[(.16*math.cos(a),.16*math.sin(a),.59),(.25*math.cos(a),.25*math.sin(a),.035)],.012,chrome,pa)
cylinder('Bandeja cenizas',.11,.06,(0,0,.42),chrome,pa)
# Plantas de hojas anchas con nervadura y curvatura.
def plant(pa,cx,cy,base,height,seed):
 rng=random.Random(seed)
 for i in range(22):
  a=i*2.399;length=height*rng.uniform(.55,1);origin=Vector((cx+rng.uniform(-.10,.10),cy+rng.uniform(-.1,.1),base));verts=[]
  for j in range(9):
   t=j/8;center=origin+Vector((math.cos(a)*length*.48*t*t,math.sin(a)*length*.48*t*t,length*t));width=math.sin(math.pi*t)**.8*length*.115
   for side in [-1,0,1]:verts.append(tuple(center+Vector((-math.sin(a)*width*side,math.cos(a)*width*side,-abs(side)*.035*math.sin(math.pi*t)))))
  faces=[]
  for j in range(8):
   for k in range(2):n=j*3+k;faces.append((n,n+1,n+4,n+3))
  me=bpy.data.meshes.new('Hoja');me.from_pydata(verts,[],faces);me.update();o=bpy.data.objects.new('Hoja curvada',me);col.objects.link(o);o.parent=pa;o.data.materials.append(leafm[i%3]);objects.append(o)
  for f in me.polygons:f.use_smooth=True
  tube('Tallo',[tuple(origin),tuple(origin+Vector((math.cos(a)*length*.20,math.sin(a)*length*.20,length*.68)))],.0025,leafm[2],pa)
for name,x,y,w in [('Jardinera izquierda',-2.98,.10,1.6),('Jardinera derecha',2.95,-.05,1.8)]:
 pa=parent(name,x,y);box('Maceta rectangular',(.35,w,.55),(0,0,.28),white,pa,.025);box('Sustrato',(.30,w-.06,.025),(0,0,.56),soil,pa)
 for j in range(4):plant(pa,0,-w*.35+j*w*.23,.57,.70,j+int(x*12))
pa=parent('Maceta pequeña',.48,1.25);cylinder('Maceta acanalada',.135,.24,(0,0,.12),white,pa)
for i in range(38):a=i*math.tau/38;tube('Estría',[(.135*math.cos(a),.135*math.sin(a),.025),(.135*math.cos(a),.135*math.sin(a),.225)],.002,white,pa)
plant(pa,0,0,.24,.38,61)
# Luz de exterior y cámara de comparación.
w=bpy.data.worlds.new('Cielo terraza');w.use_nodes=True;next(n for n in w.node_tree.nodes if n.type=='BACKGROUND').inputs[0].default_value=(.66,.77,.90,1);next(n for n in w.node_tree.nodes if n.type=='BACKGROUND').inputs[1].default_value=.65;s.world=w
ld=bpy.data.lights.new('Sol terraza','SUN');lo=bpy.data.objects.new('Sol terraza',ld);col.objects.link(lo);ld.energy=2.2;ld.angle=.12;lo.rotation_euler=(.55,-.45,-.6)
ld=bpy.data.lights.new('Rebote terraza','AREA');lo=bpy.data.objects.new('Rebote terraza',ld);col.objects.link(lo);lo.location=(0,-1,4);ld.energy=140;ld.shape='DISK';ld.size=5
cam=bpy.data.objects.new('Terraza comparación',bpy.data.cameras.new('Terraza comparación'));col.objects.link(cam);cam.location=(4.3,-5.5,3.35);target=Vector((-.5,.3,1));cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.lens=34;s.camera=cam
s.render.engine='CYCLES';s.cycles.samples=48;s.cycles.use_denoising=True;s.render.resolution_x=1280;s.render.resolution_y=900;s.render.resolution_percentage=100;s.view_settings.view_transform='AgX'
# Exportar exactamente la geometría de esta escena, con objetos editables agrupados.
bpy.ops.object.select_all(action='DESELECT')
for o in objects:
 if o.type=='CURVE':o.select_set(True)
if bpy.context.selected_objects:bpy.context.view_layer.objects.active=bpy.context.selected_objects[0];bpy.ops.object.convert(target='MESH')
bpy.ops.object.select_all(action='DESELECT')
for o in s.objects:
 if o.type in ['MESH','EMPTY']:o.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(OUT/'terraza.glb'),export_format='GLB',use_selection=True,export_apply=True,export_extras=True,export_image_format='JPEG',export_jpeg_quality=85)
bpy.ops.wm.save_as_mainfile(filepath=str(BASE/'blender/terraza-referencia.blend'),copy=True)
for area in bpy.context.screen.areas:
 if area.type=='VIEW_3D':area.spaces.active.region_3d.view_perspective='CAMERA';area.spaces.active.shading.type='MATERIAL'
print('Terraza creada en vivo y exportada a GLB: '+str((OUT/'terraza.glb').stat().st_size))
