"""Exterior de La Torre. Referencias: hero-cover.jpg, detalle-balcones.jpg, planos y corte.
Geometría base conservada; perfiles, vegetación y terminaciones estimados.
"""
import bpy,math,json,pathlib,random
from mathutils import Vector
BASE=pathlib.Path('/Users/dt/Documents/DT-System/molins-torres/3d');scene=bpy.context.scene
# Sólo la escena de revisión que David está viendo.
assert scene.name.startswith('Showroom')
old=scene.objects.get('Detalle exterior')
if old:
 for o in list(old.children_recursive):bpy.data.objects.remove(o,do_unlink=True)
 bpy.data.objects.remove(old,do_unlink=True)
col=bpy.data.collections.new('Acabados exteriores');scene.collection.children.link(col)
root=bpy.data.objects.new('Detalle exterior',None);col.objects.link(root)
def material(name,color,r=.8,metal=0):
 m=bpy.data.materials.get(name) or bpy.data.materials.new(name);m.use_nodes=True
 p=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=r;p.inputs['Metallic'].default_value=metal;return m
hormigon=material('Exterior hormigón',(.53,.51,.48));ladrillo=material('Exterior ladrillo',(.5,.23,.13));metal=material('Exterior aluminio',(.025,.027,.026),.32,.55);wood=material('Exterior madera',(.12,.08,.045),.62);revoque=material('Exterior revoque',(.72,.69,.62),.88);hojas=material('Exterior hojas',(.10,.21,.07),.8);tierra=material('Exterior tierra',(.06,.04,.025));vidrio=material('Exterior vidrio',(.47,.60,.68),.09,.60)
manifest=json.loads((BASE/'texturas/exterior.json').read_text())
def pbr(m,key):
 nt=m.node_tree;p=next(n for n in nt.nodes if n.type=='BSDF_PRINCIPLED')
 for channel,file in manifest[key].items():
  tex=nt.nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(BASE/'texturas'/file),check_existing=True);tex.image.pack()
  if channel!='diff':tex.image.colorspace_settings.name='Non-Color'
  if channel=='nor_gl':
   normal=nt.nodes.new('ShaderNodeNormalMap');normal.inputs['Strength'].default_value=.55;nt.links.new(tex.outputs['Color'],normal.inputs['Color']);nt.links.new(normal.outputs['Normal'],p.inputs['Normal'])
  else:nt.links.new(tex.outputs['Color'],p.inputs['Base Color' if channel=='diff' else 'Roughness'])
 m['fuente']='https://polyhaven.com/a/'+key
pbr(ladrillo,'red_brick');pbr(hormigon,'wood_inlaid_concrete_wall')
# UV en metros sobre cada cara, para que el ladrillo no se estire con el pilar.
def uvmetros(o,escala=1):
 if o.type!='MESH':return
 uv=o.data.uv_layers.active or o.data.uv_layers.new(name='UVMap')
 for face in o.data.polygons:
  normal=(o.matrix_world.to_3x3()@face.normal).normalized();axis=max(range(3),key=lambda i:abs(normal[i]));axes=[i for i in range(3) if i!=axis]
  for li in face.loop_indices:
   p=o.matrix_world@o.data.vertices[o.data.loops[li].vertex_index].co
   uv.data[li].uv=(p[axes[0]]*escala,p[axes[1]]*escala)
def adoptar(o,name,mat):
 o.name=name
 for c in list(o.users_collection):c.objects.unlink(o)
 col.objects.link(o);o.parent=root;o.data.materials.append(mat);return o
def caja(name,w,d,h,x,y,z,mat):
 bpy.ops.mesh.primitive_cube_add(size=1);o=adoptar(bpy.context.object,name,mat);o.location=(x,y,z+h/2);o.scale=(w,d,h)
 bpy.context.view_layer.update();uvmetros(o,.6)
 bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 b=o.modifiers.new('Canto de terminación','BEVEL');b.width=.01;b.segments=2
 return o
def cilindro(name,r,h,loc,mat):
 bpy.ops.mesh.primitive_cylinder_add(vertices=12,radius=r,depth=h);o=adoptar(bpy.context.object,name,mat);o.location=loc
 for p in o.data.polygons:p.use_smooth=True
 return o
# Materiales y profundidad de los componentes existentes.
for o in list(scene.objects):
 if o.type!='MESH' or o.parent==root:continue
 name=o.name
 mat=None
 if name.startswith('Pilar '):
  mat=ladrillo
  if name.startswith('Pilar frente'):o.location.y=-11.36
  elif name.startswith('Pilar fondo'):o.location.y=10.86
 elif name.startswith(('Balcón','Parasol','Viga remate','Parapeto')):mat=hormigon
 elif name.startswith(('Listón',)):mat=wood
 elif name.startswith('Baranda') and not name.startswith('Baranda terraza'):
  o.hide_set(True);o.hide_render=True;o['reemplazado_exterior']=True;mat=metal
 elif name.startswith(('Parante','Marco')):mat=metal
 elif name.startswith(('Vidrio','Ventana')):mat=vidrio
 if mat:
  o.data.materials.clear();o.data.materials.append(mat);bpy.context.view_layer.update();uvmetros(o,.6)
# Retiro de las plantas 5 y 6: las medianeras no siguen hasta el balcón de abajo.
for o in [o for o in scene.objects if o.name.startswith('Medianera cuerpo')]:o.hide_set(True);o.hide_render=True;o['reemplazado_exterior']=True
for sx in [-1,1]:
 caja('Medianera escalonada inferior',.25,20.8,14.4,sx*3.375,0,0,revoque)
 caja('Medianera escalonada superior',.25,18.2,5.6,sx*3.375,1.3,14.4,revoque)
 caja('Pilar retirado',.8,1,6.5,sx*3.16,-7.36,14.4,ladrillo)
# Losas con hueco real del patio; reemplazar la losa ciega de cada planta.
for k in range(1,7):
 nivel=next(o for o in scene.objects if o.name.startswith(f'Nivel {k} raiz'));losa=next(o for o in nivel.children if o.name.startswith('Losa '));losa.hide_set(True);losa.hide_render=True;losa['reemplazado_exterior']=True
 aspect=.2957 if k<5 else .3261 if k==5 else .3502;largo=7/aspect;ytope=11.3;fondo=ytope-largo;ratio=aspect/.2957
 ya=ytope-(64 if k<5 else 67 if k==5 else 73)/100*largo;yb=ytope-42*ratio/100*largo
 z=3.2+(k-1)*2.8-.2;matSlab=losa.data.materials[0] if losa.data.materials else hormigon
 # La izquierda del plano queda en +X; el patio a la derecha queda en -X.
 pieces=[(4.5,largo,1.25,(fondo+ytope)/2),(2.5,ya-fondo,-2.25,(fondo+ya)/2),(2.5,ytope-yb,-2.25,(yb+ytope)/2)]
 for w,d,x,y in pieces:
  o=caja(f'Losa con patio {k}',w,d,.2,x,y,z,matSlab)
  world=o.matrix_world.copy();o.parent=nivel;o.matrix_world=world
# Azoteas de ambas torres, con el patio abierto.
caja('Azotea Norte',7,4.7,.2,0,-5.45,19.8,hormigon)
caja('Azotea Sur',7,7.8,.2,0,7.4,19.8,hormigon)
# Barandas más finas y completas, como detalle-balcones.jpg; once líneas horizontales.
for k in range(1,7):
 z=3.2+(k-1)*2.8
 for y in ([-11.74,11.24] if k<=4 else [11.24]):
  for a,b in [(-2.55,.05),(1.30,2.55)]:
   for j in range(11):caja(f'Baranda fina {k}',b-a,.028,.026,(a+b)/2,y,z+.12+j*.087,metal)
  # Jardineras y hojas en geometría real, grupos repetidos de bajo detalle.
  for x in [-2.05,1.90]:
   caja(f'Jardinera {k}',.47,.25,.24,x,y+(.26 if y<0 else -.26),z+.03,hormigon)
   rng=random.Random(k*17+int(x*10))
   for j in range(15):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1,radius=1);leaf=adoptar(bpy.context.object,f'Follaje balcón {k}',hojas)
    leaf.location=(x+rng.uniform(-.27,.27),y+rng.uniform(-.1,.25),z+.30+rng.uniform(-.1,.3));leaf.scale=(.08,.14,.17)
  # Luz cálida bajo losa, sin sumar lámparas individuales en cada paño.
  lm=material('Exterior aplique cálido',(1,.69,.35),.5);p=next(n for n in lm.node_tree.nodes if n.type=='BSDF_PRINCIPLED');p.inputs['Emission Color'].default_value=(1,.66,.32,1);p.inputs['Emission Strength'].default_value=.3
  caja(f'Aplique balcón {k}',.14,.14,.035,-1.1,y+(.45 if y<0 else -.45),z+2.52,lm)
# Acceso peatonal y vehicular, desde la planta PB y hall-noche.jpg.
caja('Puerta del hall',1,.08,2.3,1,-8.54,.18,wood)
caja('Paño fijo hall',.5,.03,2.3,.22,-8.53,.18,vidrio)
caja('Pilar de acceso',.36,.36,2.85,-.05,-11.50,.18,hormigon)
for j in range(11):caja('Listón portón',2.25,.055,.13,-1.50,-11.25,.43+j*.23,metal)
caja('Cantero de entrada',1.3,1.3,.35,2.45,-9.45,.18,hormigon)
# Árboles del entorno: estimados de los renders, no relevamiento urbano.
for ix,(x,y,h) in enumerate([(6.2,-14,4.5),(-6.5,-14,4),(-8,14,5),(6,23,4.5)]):
 cilindro('Tronco del entorno',.11,h*.65,(x,y,h*.325),wood)
 rng=random.Random(ix+72)
 for j in range(28):
  bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1,radius=1);leaf=adoptar(bpy.context.object,'Copa del entorno',hojas);a=rng.random()*math.tau;r=rng.random()*1.5
  leaf.location=(x+math.cos(a)*r,y+math.sin(a)*r,h*.65+rng.uniform(-.5,1));leaf.scale=(.6,.6,.55)
# Sol, relleno y cámaras de revisión del edificio completo.
for o in scene.objects:
 if o.type=='LIGHT' and o.data.type=='SUN':o.data.energy=2.3;o.data.angle=.035
for name,pos,target,lens in [('Frente La Torre',(-15,-32,13),(0,-6,11),40),('Aérea La Torre',(-24,-25,35),(0,3,10),40),('Contrafrente La Torre',(18,36,22),(0,4,10),45),('Cenital La Torre',(0,3,58),(0,3,0),42)]:
 cam=scene.objects.get(name)
 if not cam:
  data=bpy.data.cameras.new(name);cam=bpy.data.objects.new(name,data);col.objects.link(cam)
 cam.location=pos;cam.data.lens=lens;cam.rotation_euler=(Vector(target)-Vector(pos)).to_track_quat('-Z','Y').to_euler()
for o in scene.objects:
 hide=bool(o.get('referencia') or o.get('reemplazado_exterior'))
 o.hide_set(hide);o.hide_render=hide
 if o.name.startswith('Muros '):o.scale.z=3.0 if o.name.startswith('Muros 0') else 2.6
scene.camera=scene.objects['Frente La Torre']
for area in getattr(bpy.context.screen,'areas',[]):
 if area.type=='VIEW_3D':
  area.spaces.active.region_3d.view_perspective='CAMERA';area.spaces.active.shading.type='MATERIAL';area.spaces.active.shading.use_scene_lights=True;area.spaces.active.overlay.show_overlays=False
scene.render.filepath='/private/tmp/torre-frente-real.png'
t=bpy.data.texts.get('exterior-vivo.py') or bpy.data.texts.new('exterior-vivo.py');t.clear();t.write((BASE/'blender/exterior-vivo.py').read_text())
bpy.ops.wm.save_as_mainfile(filepath=str(BASE/'blender/showroom-en-vivo.blend'),copy=True)
print('Exterior completo, patio abierto, fachada mejorada y cuatro cámaras guardadas')

# Correcciones visuales revisadas el 7/9: ejecutar siempre al terminar.
exec(compile((BASE/'blender/corregir-exterior.py').read_text(), 'corregir-exterior.py', 'exec'))
