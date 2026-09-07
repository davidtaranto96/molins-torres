"""Unidad 3B: encuadre y luz para revisar el acabado frente a interior-estar.jpg.
Cielorraso y perfiles estimados, distribución del plano tipo.
"""
import bpy,math,pathlib
from mathutils import Vector
scene=bpy.context.scene
root=next(o for o in scene.objects if o.name.startswith('Nivel 3 raiz'));col=root.users_collection[0]
# Altura completa de los muros originales: el join conservó escala Z 2.6.
for o in root.children:
 if o.name.startswith('Muros 3'):o.scale.z=2.6;o['altura_original']=2.6;o.hide_set(False)
mat=bpy.data.materials.get('Cielorraso blanco') or bpy.data.materials.new('Cielorraso blanco');mat.use_nodes=True
p=next(n for n in mat.node_tree.nodes if n.type=='BSDF_PRINCIPLED');p.inputs['Base Color'].default_value=(.80,.78,.73,1);p.inputs['Roughness'].default_value=.83
# Sólo la unidad B: sin cubrir patio de aire y luz.
old=scene.objects.get('Cielorraso 3B')
if not old:
 bpy.ops.mesh.primitive_cube_add(size=1);o=bpy.context.object;o.name='Cielorraso 3B'
 for c in list(o.users_collection):c.objects.unlink(o)
 col.objects.link(o);o.parent=root;o.location=(0,5.5,2.65);o.scale=(5.74,6.4,.08);o.data.materials.append(mat)
# Vidrio del balcón del estar: hoja continua con transmisión física.
glass=bpy.data.materials.get('Vidrio showroom real') or bpy.data.materials.new('Vidrio showroom real');glass.use_nodes=True
p=next(n for n in glass.node_tree.nodes if n.type=='BSDF_PRINCIPLED');p.inputs['Base Color'].default_value=(.90,.95,.96,1);p.inputs['Transmission Weight'].default_value=1;p.inputs['IOR'].default_value=1.5;p.inputs['Roughness'].default_value=.06
if not scene.objects.get('Vidrio balcón 3B'):
 bpy.ops.mesh.primitive_cube_add(size=1);o=bpy.context.object;o.name='Vidrio balcón 3B'
 for c in list(o.users_collection):c.objects.unlink(o)
 col.objects.link(o);o.parent=root;o.location=(-1.47,8.70,1.18);o.scale=(2.80,.012,2.32);o.data.materials.append(glass)
# Luz de cielo que entra por el balcón y rebote cálido del interior.
for name,location,target,power,size,color in [('Luz ventana 3B',(-1.5,9.0,2.0),(-1.5,5,1),320,2.5,(.86,.92,1)),('Rebote interior 3B',(-1.1,4.8,2.3),(-1.3,7.8,.5),65,2,(1,.82,.65))]:
 o=scene.objects.get(name)
 if not o:
  ld=bpy.data.lights.new(name,'AREA');o=bpy.data.objects.new(name,ld);col.objects.link(o);o.parent=root
 o.location=location;o.rotation_euler=(Vector(target)-Vector(location)).to_track_quat('-Z','Y').to_euler();o.data.energy=power;o.data.shape='DISK';o.data.size=size;o.data.color=color
# Cámara sin cambiar las cámaras existentes de unidad.
name='Interior terminado 3B';cam=scene.objects.get(name)
if not cam:
 data=bpy.data.cameras.new(name);cam=bpy.data.objects.new(name,data);col.objects.link(cam);cam.parent=root
cam.location=(-.72,4.30,1.60);cam.data.lens=22
cam.rotation_euler=(Vector((-1.7,8.15,1.05))-cam.location).to_track_quat('-Z','Y').to_euler();scene.camera=cam
# El render de revisión coincide con lo visible; se conserva el estado editable.
for o in scene.objects:o.hide_render=o.hide_get()
for o in root.children_recursive:
 if o.type=='LIGHT':o.hide_render=False
for area in getattr(bpy.context.screen, 'areas', []):
 if area.type=='VIEW_3D':
  area.spaces.active.region_3d.view_perspective='CAMERA'
  area.spaces.active.shading.type='MATERIAL';area.spaces.active.shading.use_scene_lights=True
scene.render.engine='CYCLES';scene.cycles.samples=48;scene.cycles.use_denoising=True
scene.render.resolution_x=1280;scene.render.resolution_y=900;scene.render.resolution_percentage=100
scene.render.filepath='/private/tmp/torre-interior-real.png'
text=bpy.data.texts.get('interior-muestra.py') or bpy.data.texts.new('interior-muestra.py');text.clear();text.write(pathlib.Path('/Users/dt/Documents/DT-System/molins-torres/3d/blender/interior-muestra.py').read_text())
bpy.ops.wm.save_as_mainfile(filepath='/Users/dt/Documents/DT-System/molins-torres/3d/blender/showroom-en-vivo.blend',copy=True)
print('Interior 3B con paredes completas, cielorraso, vidrio, iluminación y cámara activos')
