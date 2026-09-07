"""Corrección de materiales y follaje señalados por David el 7/9. Ejecutar en Showroom en vivo."""
import bpy, math, random, pathlib
from mathutils import Vector
s=bpy.context.scene
assert s.name.startswith('Showroom')
BASE=pathlib.Path('/Users/dt/Documents/DT-System/molins-torres/3d')
root=s.objects['Detalle exterior'];col=root.users_collection[0]
def acabado(name,color,rough=.75):
 m=bpy.data.materials.get(name) or bpy.data.materials.new(name);m.use_nodes=True;nt=m.node_tree;nt.nodes.clear()
 p=nt.nodes.new('ShaderNodeBsdfPrincipled');out=nt.nodes.new('ShaderNodeOutputMaterial');nt.links.new(p.outputs['BSDF'],out.inputs['Surface']);p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=rough
 noise=nt.nodes.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=85;noise.inputs['Detail'].default_value=2
 bump=nt.nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.16;bump.inputs['Distance'].default_value=.012;nt.links.new(noise.outputs['Fac'],bump.inputs['Height']);nt.links.new(bump.outputs['Normal'],p.inputs['Normal'])
 return m,p
concrete,_=acabado('Exterior hormigón',(.53,.51,.47),.78)
roof,_=acabado('Azotea impermeabilizada',(.61,.62,.60),.88)
glass,p=acabado('Exterior vidrio',(.91,.96,.97),.14);p.inputs['Metallic'].default_value=0;p.inputs['Transmission Weight'].default_value=1;p.inputs['IOR'].default_value=1.45
for o in s.objects:
 if o.type!='MESH':continue
 if o.name.startswith(('Azotea','Plataforma')):o.data.materials.clear();o.data.materials.append(roof)
 if o.name.startswith('Tanque'):
  o.data.materials.clear();o.data.materials.append(roof)
  for f in o.data.polygons:f.use_smooth=True
  if not o.modifiers.get('Bordes suaves'):b=o.modifiers.new('Bordes suaves','BEVEL');b.width=.06;b.segments=3
# Retirar únicamente las masas de follaje de esta escena y de esta receta.
for o in list(s.objects):
 if o.name.startswith(('Follaje balcón','Copa del entorno','Hojas naturales')):bpy.data.objects.remove(o,do_unlink=True)
leafm=[]
for i,c in enumerate([(.085,.17,.038),(.14,.24,.063),(.20,.29,.08),(.095,.20,.07)]):
 m,p=acabado('Hoja natural '+str(i),c,.57);p.inputs['Subsurface Weight'].default_value=.08;leafm.append(m)
def foliage(name,center,radius,count,seed):
 rng=random.Random(seed);verts=[];faces=[];mi=[]
 for j in range(count):
  a=rng.random()*math.tau;u=rng.uniform(-1,1);rr=radius*rng.random()**.5
  loc=Vector(center)+Vector((math.cos(a)*rr,math.sin(a)*rr,u*radius*.72))
  length=rng.uniform(.10,.22) if radius<1 else rng.uniform(.12,.26);width=length*.40
  direction=Vector((math.cos(a),math.sin(a),rng.uniform(-.5,.8))).normalized();side=direction.cross(Vector((0,0,1))).normalized()
  start=len(verts)
  # Hoja lanceolada, plegada sobre nervadura; sin volúmenes poliédricos.
  for along,across,lift in [(0,0,0),(.40,-1,.025),(.45,0,.045),(.40,1,.025),(1,0,0)]:verts.append(tuple(loc+direction*(along*length)+side*(across*width)+Vector((0,0,lift))))
  faces.extend([(start,start+1,start+2),(start,start+2,start+3),(start+1,start+4,start+2),(start+2,start+4,start+3)]);mi.extend([rng.randrange(4)]*4)
 mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update();o=bpy.data.objects.new(name,mesh);col.objects.link(o);o.parent=root
 for m in leafm:mesh.materials.append(m)
 for f,i in zip(mesh.polygons,mi):f.material_index=i;f.use_smooth=True
for o in list(s.objects):
 if o.name.startswith('Jardinera'):
  c=o.matrix_world.translation;foliage('Hojas naturales balcón',(c.x,c.y,c.z+.26),.30,150,int(c.z*37+c.x*13))
for i,(x,y,h) in enumerate([(6.2,-14,4.5),(-6.5,-14,4),(-8,14,5),(6,23,4.5)]):foliage('Hojas naturales árbol',(x,y,h*.70),1.65,2600,70+i)
# Las losas quedan dentro del borde arquitectónico.
for o in s.objects:
 if not o.name.startswith('Losa con patio'):continue
 k=int(o.name.split()[3].split('.')[0]);front=-7.8 if k==6 else -11.8
 inv=o.matrix_world.inverted()
 for v in o.data.vertices:
  p=o.matrix_world@v.co
  if p.y<front:p.y=front;v.co=inv@p
# Cámara de detalle para comparar con la captura.
name='Detalle balcón corregido';cam=s.objects.get(name)
if not cam:cam=bpy.data.objects.new(name,bpy.data.cameras.new(name));col.objects.link(cam)
cam.location=(-7,-18,11);cam.rotation_euler=(Vector((0,-11.2,10))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.lens=55
for name,pos,target in [('Frente La Torre',(-20,-41,16),(0,-3,12)),('Aérea La Torre',(-28,-31,40),(0,4,9)),('Cenital La Torre',(0,4,62),(0,4,0))]:
 cam=s.objects.get(name)
 if cam:cam.location=pos;cam.rotation_euler=(Vector(target)-cam.location).to_track_quat('-Z','Y').to_euler()
for o in s.objects:
 if o.type=='MESH' and o.name.startswith(('Losa con patio','Azotea')):
  inv=o.matrix_world.inverted()
  for v in o.data.vertices:
   p=o.matrix_world@v.co
   if abs(p.x)>=3.48:p.x=3.46 if p.x>0 else -3.46;v.co=inv@p

text=bpy.data.texts.get('corregir-exterior.py') or bpy.data.texts.new('corregir-exterior.py');text.clear();text.write((BASE/'blender/corregir-exterior.py').read_text())
bpy.ops.wm.save_as_mainfile(filepath=str(BASE/'blender/showroom-en-vivo.blend'),copy=True)
print('Corregidos hormigón, cubierta, vidrio, tanques y follaje. Vista actual conservada.')
