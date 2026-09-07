"""Acabado de la unidad muestra. Decoración estimada según renders del proyecto.
Ejecutar en Showroom en vivo. Conserva posiciones de muebles ya editadas.
"""
import bpy, math, random, pathlib, json
from mathutils import Vector
BASE=pathlib.Path('/Users/dt/Documents/DT-System/molins-torres/3d');scene=bpy.context.scene
manifest=json.loads((BASE/'texturas/manifest.json').read_text())
def pbr(material,asset,escala=1):
 nt=material.node_tree;p=next(n for n in nt.nodes if n.type=='BSDF_PRINCIPLED')
 for l in list(nt.links):
  if l.to_node==p and l.to_socket.name in ['Base Color','Roughness','Normal']:nt.links.remove(l)
 texcoord=nt.nodes.new('ShaderNodeTexCoord');mapping=nt.nodes.new('ShaderNodeVectorMath');mapping.operation='SCALE';mapping.inputs[3].default_value=escala
 nt.links.new(texcoord.outputs['UV'],mapping.inputs[0])
 for channel,name in manifest[asset].items():
  if asset=='fabric_pattern_07' and channel=='diff':continue
  tex=nt.nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(BASE/'texturas'/name),check_existing=True);tex.image.pack()
  if channel!='diff':tex.image.colorspace_settings.name='Non-Color'
  nt.links.new(mapping.outputs['Vector'],tex.inputs['Vector'])
  if channel=='nor_gl':
   normal=nt.nodes.new('ShaderNodeNormalMap');normal.inputs['Strength'].default_value=.35;nt.links.new(tex.outputs['Color'],normal.inputs['Color']);nt.links.new(normal.outputs['Normal'],p.inputs['Normal'])
  else:nt.links.new(tex.outputs['Color'],p.inputs['Base Color' if channel=='diff' else 'Roughness'])
 if asset=='fabric_pattern_07':p.inputs['Base Color'].default_value=(.62,.58,.49,1)
 material['fuente']='https://polyhaven.com/a/'+asset
for m in bpy.data.materials:
 if m.name.startswith('Showroom madera'):pbr(m,'oak_veneer_01',.8)
 elif m.name.startswith(('Showroom tela','Showroom lino')):pbr(m,'fabric_pattern_07',5)
 elif m.name.startswith('Muro interior') and any(m==slot.material for o in scene.objects if o.type=='MESH' for slot in o.material_slots):pbr(m,'painted_plaster_wall',1)
root=next(o for o in scene.objects if o.name.startswith('Nivel 3 raiz'));col=root.users_collection[0]
# Agrupar el detalle nuevo para poder ocultarlo o moverlo junto.
prev=next((o for o in scene.objects if o.name=='Ambientación 3B'),None)
if prev:
 for o in list(prev.children_recursive):bpy.data.objects.remove(o,do_unlink=True)
 bpy.data.objects.remove(prev,do_unlink=True)
decor=bpy.data.objects.new('Ambientación 3B',None);col.objects.link(decor);decor.parent=root;decor['estimado']=True

def mat(nombre,color,r=.7,metal=0):
 m=bpy.data.materials.get(nombre) or bpy.data.materials.new(nombre);m.use_nodes=True;p=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=r;p.inputs['Metallic'].default_value=metal;return m
hoja=mat('Hoja verde natural',(.08,.19,.065),.48);terracota=mat('Cerámica de maceta',(.45,.31,.2),.8);tierra=mat('Tierra de maceta',(.06,.035,.02),1);negro=mat('Metal negro satinado',(.025,.026,.022),.36,.5);blanco=mat('Cerámica esmaltada',(.8,.77,.7),.25)
def adoptar(o,nombre,material):
 o.name=nombre
 for c in list(o.users_collection):c.objects.unlink(o)
 col.objects.link(o);o.parent=decor;o.data.materials.append(material);return o

def cilindro(nombre,loc,radius,depth,material,r2=None):
 bpy.ops.mesh.primitive_cone_add(vertices=32,radius1=radius,radius2=radius if r2 is None else r2,depth=depth,location=(0,0,0));o=adoptar(bpy.context.object,nombre,material);o.location=loc
 for p in o.data.polygons:p.use_smooth=True
 bevel=o.modifiers.new('Borde de cerámica','BEVEL');bevel.width=.009;bevel.segments=2;return o
# Planta alta junto al balcón, por fuera de la circulación del estar.
px,py=-2.6,8.1
cilindro('Maceta del estar',(px,py,.24),.20,.48,terracota,.25);cilindro('Tierra',(px,py,.475),.235,.02,tierra)
rng=random.Random(31)
for i in range(19):
 a=i*2.399;h=.65+i*.045;r=.18+.17*rng.random();cx=px+math.cos(a)*r;cy=py+math.sin(a)*r
 start=Vector((px,py,.43));end=Vector((cx,cy,h));delta=end-start
 stem=cilindro('Tallo',(start+end)/2,.009,delta.length,hoja);stem.rotation_euler=delta.to_track_quat('Z','Y').to_euler()
 bpy.ops.mesh.primitive_uv_sphere_add(segments=12,ring_count=6,radius=1);leaf=adoptar(bpy.context.object,'Hoja',hoja);leaf.location=(cx,cy,h);leaf.scale=(.09,.23,.012);leaf.rotation_euler=(.35,math.sin(a)*.6,a)
 for p in leaf.data.polygons:p.use_smooth=True
# Alfombra: tejido, bordes suaves y una escala reconocible.
fabric=next(m for m in bpy.data.materials if m.name.startswith('Showroom tela'))
bpy.ops.mesh.primitive_cube_add(size=1);rug=adoptar(bpy.context.object,'Alfombra del estar',fabric);rug.location=(-1.6,7.5,.016);rug.scale=(1.65,1.8,.025)
bpy.context.view_layer.objects.active=rug;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);bevel=rug.modifiers.new('Borde textil','BEVEL');bevel.width=.025;bevel.segments=3
# Tres lámparas colgantes sobre la mesa, referenciadas en interior-estar.jpg.
for i in range(3):
 x=-1.65+(i-1)*.22;y=6.25;h=2.0+i*.10
 cilindro('Cable colgante',(x,y,(h+2.6)/2),.007,2.6-h,negro)
 cilindro('Pantalla de lámpara',(x,y,h),.10,.18,terracota,.07)
 ld=bpy.data.lights.new('Luz cálida comedor','POINT');ld.energy=12;ld.color=(1,.76,.48);ld.shadow_soft_size=.12
 lo=bpy.data.objects.new(ld.name,ld);col.objects.link(lo);lo.parent=decor;lo.location=(x,y,h-.13)
# Cortinas plegadas: malla ondulada, deja ver la carpintería negra.
for old in [o for o in root.children if o.name.startswith('Cortina')]:
 w,d,h=old.dimensions;verts=[];faces=[]
 for j in range(2):
  for i in range(33):verts.append((-w/2+w*i/32,.035*math.sin(i/32*math.pi*12),(-h/2 if j==0 else h/2)))
 for i in range(32):faces.append((i,i+1,34+i,33+i))
 mesh=bpy.data.meshes.new('Pliegues de cortina');mesh.from_pydata(verts,[],faces);mesh.materials.append(next(m for m in bpy.data.materials if m.name.startswith('Showroom lino')))
 old.data=mesh;old.scale=(1,1,1)
 solid=old.modifiers.new('Espesor de tela','SOLIDIFY');solid.thickness=.003
# Mantener la original intacta: los muros que compartían material reciben una copia al aplicar.
scene.view_settings.view_transform='AgX'
for area in getattr(bpy.context.screen, 'areas', []):
 if area.type=='VIEW_3D':
  area.spaces.active.shading.type='MATERIAL';area.spaces.active.shading.use_scene_lights=True;area.spaces.active.shading.use_scene_world=False
  area.tag_redraw()
text=bpy.data.texts.get('realismo-vivo.py') or bpy.data.texts.new('realismo-vivo.py');text.clear();text.write((BASE/'blender/realismo-vivo.py').read_text())
bpy.ops.wm.save_as_mainfile(filepath=str(BASE/'blender/showroom-en-vivo.blend'),copy=True)
print('Materiales PBR, cortinas con pliegues, vegetación, alfombra y lámparas aplicados en vivo')
