"""Genera una escena independiente y exportable con el catálogo compartido de la web.
Blender --background --python 3d/blender/showroom.py
TORRE_RAIZ apunta a la raíz del sitio. No sobrescribe la-torre.blend.
"""
import os, pathlib, json, math, random
RAIZ = pathlib.Path(os.environ.get('TORRE_RAIZ', pathlib.Path(__file__).resolve().parents[2]))
os.environ['TORRE_RAIZ'] = str(RAIZ)
exec(compile((RAIZ/'3d/blender/la-torre.py').read_text(),str(RAIZ/'3d/blender/la-torre.py'),'exec'))
RAIZ = pathlib.Path(RAIZ)
datos=json.loads((RAIZ/'3d/mobiliario.json').read_text())
# El fondo se toma de la proporción de PB, anclada a la línea municipal.
# La fuente anterior prolongaba la cochera hasta ~44 m sin cota horizontal.
largo_pb=M['frente']/PLANTAS['pb']; final_pb=yLM+largo_pb
for name in ['Piso cocheras','Medianera cocheras','Medianera cocheras.001','Muro verde']:
 o=bpy.data.objects.get(name)
 if not o: continue
 if name=='Muro verde':o.location.y=final_pb
 else:o.scale.y=final_pb-yLF;o.location.y=(final_pb+yLF)/2

def texture_material(nombre,color):
 mat=material(nombre,color,.7);p=principled(mat)
 # Imagen de 128 px empaquetada: también viaja al glTF, a diferencia de nodos Noise.
 image=bpy.data.images.new(nombre+' textura',width=128,height=128)
 rng=random.Random(nombre);pixels=[]
 for y in range(128):
  for x in range(128):
   v=1+rng.uniform(-.055,.055)
   if 'madera' in nombre:v+=.045*math.sin(y*.8+x*.03)
   pixels.extend([min(1,max(0,c*v)) for c in color]+[1])
 image.pixels.foreach_set(pixels);image.pack()
 node=mat.node_tree.nodes.new('ShaderNodeTexImage');node.image=image
 mat.node_tree.links.new(node.outputs['Color'],p.inputs['Base Color'])
 return mat
mats={}
for k,v in datos['materiales'].items():
 color=tuple((int(v[i:i+2],16)/255)**2.2 for i in (1,3,5))
 mats[k]=texture_material('Showroom '+k,color)
# Acabados de referencia: texturas procedurales empaquetadas, sin afirmar PBR de Poly Haven.
for k in ['ladrillo','hormigon','encofrado','madera']:
 old=MAT[k];color=tuple(principled(old).inputs['Base Color'].default_value[:3]);new=texture_material(k,color)
 for o in bpy.data.objects:
  if o.type=='MESH':
   for slot in o.material_slots:
    if slot.material==old:slot.material=new

manifest={'version':1,'fuente':datos['fuente'],'niveles':[],'advertencias':['Alturas y detalles de muebles estimados; huellas proporcionales de los planos.','Terraza del 5A no accesible según plano: sin muebles ni cámara.','Fondo PB derivado del aspecto del plano: %.2f m.'%largo_pb]}
for clave,k in NIVELES:
 col=cNiv[k];z0=0 if not k else zNivel(k)
 padre=bpy.data.objects.new('Nivel %s raiz'%k,None);col.objects.link(padre);padre['nivel']=k
 # Un solo objeto por nivel para bajar u ocultar paredes en un visor.
 walls=[o for o in col.objects if o.name.startswith('Muro ')]
 if walls:
  bpy.ops.object.select_all(action='DESELECT')
  for o in walls:o.select_set(True)
  bpy.context.view_layer.objects.active=walls[0];bpy.ops.object.join();wall=walls[0];wall.name=f'Muros {k}'
  # Origen en el piso para que escalar Z no desplace la base.
  bpy.context.scene.cursor.location=(0,0,z0);bpy.ops.object.origin_set(type='ORIGIN_CURSOR')
 plano=bpy.data.objects.get(f'Plano {k}');plano.hide_render=True;plano.hide_viewport=True
 plano['referencia']=True
 if k:
  largo=M['frente']/PLANTAS[clave];ytope=yLF
  for item in datos['plantas'][clave]:
   root=bpy.data.objects.new(f"Mueble {k} {item['nombre']}",None);col.objects.link(root)
   root['mueble_id']=item['id'];root['tipo']=item['tipo'];root['estimado']=True
   w=item['ancho']/100*M['frente'];d=item['fondo']/100*largo
   if item['tipo']=='sofa':w,d=d,w
   for i,p in enumerate(datos['modelos'][item['tipo']]):
    x,h,y=p['pos'];ww,hh,dd=p['tam']
    o=caja(root.name+' pieza',ww*w,hh,dd*d,x*w,y*d,h-hh/2,mats[p['material']],col);o.parent=root
   root.location=(M['frente']*(.5-item['x']/100),ytope-item['y']/100*largo,z0)
   root.rotation_euler.z=-math.radians(item['giro'])
  # Plano oculto; superficie física de porcelanato como el render interior.
  losa=bpy.data.objects.get(f'Losa {k}');losa.data.materials.clear();losa.data.materials.append(mats['piedra'])
  cameras=[]
  for letter,pct in [('B',22),('A',80 if clave=='tipo' else 74 if clave=='p5' else 81)]:
   data=bpy.data.cameras.new(f'Cam {k}{letter} estar');data.lens=24
   cam=bpy.data.objects.new(data.name,data);col.objects.link(cam)
   cam.location=(M['frente']*(.5-.62),ytope-pct/100*largo,z0+1.6)
   target=cam.location.copy();target.y+=(2 if letter=='B' else -2)
   cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();cameras.append(cam.name)
 for o in list(col.objects):
  if o!=padre and o.parent is None:o.parent=padre
 manifest['niveles'].append({'nivel':k,'objeto':padre.name,'muros':f'Muros {k}','unidades':[f'{k}A',f'{k}B'] if k else [],'camaras':cameras if k else []})
# Orígenes de nivel: conservan la posición mundial para separar niveles en la web.
for entry in manifest['niveles']:
 root=bpy.data.objects[entry['objeto']];z0=0 if not entry['nivel'] else zNivel(entry['nivel'])
 for o in root.children:o.location.z-=z0
 root.location.z=z0
bpy.context.scene.camera=bpy.data.objects.get('Como el render')
bpy.ops.wm.save_as_mainfile(filepath=str(RAIZ/'3d/blender/showroom.blend'))
# Excluir planos de referencia y entorno urbano del asset; el visor conserva su cielo/entorno.
bpy.ops.object.select_all(action='DESELECT')
for o in bpy.data.objects:
 if any(c==cEdif or c in list(cEdif.children) for c in o.users_collection) and not o.get('referencia'):o.select_set(True)
kwargs=dict(filepath=str(RAIZ/'3d/showroom.glb'),export_format='GLB',use_selection=True,export_cameras=True,export_extras=True)
props=bpy.ops.export_scene.gltf.get_rna_type().properties
if 'export_draco_mesh_compression_enable' in props:kwargs.update(export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6)
bpy.ops.export_scene.gltf(**kwargs)
manifest['bytes_glb']=(RAIZ/'3d/showroom.glb').stat().st_size
(RAIZ/'3d/showroom.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print('SHOWROOM_EXPORT',manifest['bytes_glb'],'bytes')
