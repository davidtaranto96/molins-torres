"""Carpinterías y cielorrasos de referencia para el showroom activo.
Posiciones proporcionales a plantas; perfiles y alturas estimados.
"""
import bpy, math
scene=bpy.context.scene
# Guardar en el archivo los scripts para volver a cargar los controles tras abrirlo.
from pathlib import Path
for filename in ['controles-vivos.py','acabados-vivos.py']:
 path=Path('/Users/dt/Documents/DT-System/molins-torres/3d/blender')/filename
 text=bpy.data.texts.get(filename) or bpy.data.texts.new(filename);text.clear();text.write(path.read_text())
matmetal=next(m for m in bpy.data.materials if m.name.startswith('Showroom metal'))
matlino=next(m for m in bpy.data.materials if m.name.startswith('Showroom lino'))
for n,aspecto in [(1,.2957),(2,.2957),(3,.2957),(4,.2957),(5,.3261),(6,.3502)]:
 root=next(o for o in scene.objects if o.name.startswith(f'Nivel {n} raiz'))
 col=root.users_collection[0];largo=7/aspecto;ratio=aspecto/.2957
 def box(nombre,x,y,z,w,d,h,material):
  bpy.ops.mesh.primitive_cube_add(size=1)
  o=bpy.context.object;o.name=f'{nombre} {n}';o.dimensions=(w,d,h)
  for c in list(o.users_collection):c.objects.unlink(o)
  col.objects.link(o);o.parent=root;o.location=(7*(.5-x/100),11.3-y/100*largo,z);o.data.materials.append(material)
  o.hide_set(n!=scene.get('showroom_piso',3));return o
 for yy in [11*ratio,84 if n==5 else 94]:
  for xa,xb in [(15,48),(51,91)]:
   for x in [xa,(xa+xb)/2,xb]:box('Marco negro',x,yy,1.17,.045,.08,2.35,matmetal)
   for z in [.03,2.35]:box('Marco horizontal',(xa+xb)/2,yy,z,(xb-xa)/100*7,.08,.045,matmetal)
   box('Cortina',xa+(xb-xa)*.1,yy+.35,1.18,(xb-xa)/100*7*.17,.035,2.25,matlino)
 # Luz cálida de ambiente, estimada; sólo se ve en render, no cambia otras escenas.
 ld=bpy.data.lights.new(f'Luz estar {n}','AREA');ld.energy=80;ld.color=(1,.82,.62);ld.shape='DISK';ld.size=2
 lo=bpy.data.objects.new(ld.name,ld);col.objects.link(lo);lo.parent=root;lo.location=(-1.5,6.3,2.5)
# UV de cajas y muebles para las texturas empaquetadas.
for o in scene.objects:
 if o.type!='MESH' or o.data.uv_layers:continue
 uv=o.data.uv_layers.new(name='UVMap')
 for face in o.data.polygons:
  axis=max(range(3),key=lambda k:abs(face.normal[k]));axes=[i for i in range(3) if i!=axis]
  for li in face.loop_indices:
   co=o.data.vertices[o.data.loops[li].vertex_index].co
   uv.data[li].uv=(co[axes[0]],co[axes[1]])
# Guardar una COPIA del archivo abierto con ambas escenas, sin reemplazar el original.
bpy.ops.wm.save_as_mainfile(filepath='/Users/dt/Documents/DT-System/molins-torres/3d/blender/showroom-en-vivo.blend',copy=True)
print('Carpinterías visibles, UV generadas y copia de ambas escenas guardada')
