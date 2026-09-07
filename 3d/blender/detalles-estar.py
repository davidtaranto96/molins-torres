import bpy, pathlib
scene=bpy.context.scene
root=next(o for o in scene.objects if o.name.startswith('Nivel 3 raiz'));col=root.users_collection[0]
wood=next(m for m in bpy.data.materials if m.name.startswith('Showroom madera'));black=bpy.data.materials.get('Metal negro satinado')
def box(name,loc,size,material):
 o=scene.objects.get(name)
 if o:return o
 bpy.ops.mesh.primitive_cube_add(size=1);o=bpy.context.object;o.name=name
 for c in list(o.users_collection):c.objects.unlink(o)
 col.objects.link(o);o.parent=root;o.location=loc;o.scale=size;o.data.materials.append(material)
 bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 be=o.modifiers.new('Bordes de carpintería','BEVEL');be.width=.012;be.segments=3
 return o
box('Mueble TV 3B',(-.22,7.6,.58),(.35,1.65,.25),wood)
box('TV 3B',(-.065,7.6,1.35),(.055,1.24,.72),black)
for i in range(13):box('Listón TV 3B '+str(i),(-.02,6.75+i*.05,1.25),(.06,.025,2.25),wood)
# Porcelanato claro, juntas de 60 cm estimadas del render; no madera en el piso.
mat=bpy.data.materials.get('Porcelanato con junta 60cm') or bpy.data.materials.new('Porcelanato con junta 60cm');mat.use_nodes=True
nt=mat.node_tree;nt.nodes.clear();out=nt.nodes.new('ShaderNodeOutputMaterial');p=nt.nodes.new('ShaderNodeBsdfPrincipled');nt.links.new(p.outputs['BSDF'],out.inputs['Surface']);p.inputs['Roughness'].default_value=.43
coord=nt.nodes.new('ShaderNodeTexCoord');mapping=nt.nodes.new('ShaderNodeVectorMath');mapping.operation='MULTIPLY';mapping.inputs[1].default_value=(7/.6,(7/.2957)/.6,1);nt.links.new(coord.outputs['Generated'],mapping.inputs[0])
brick=nt.nodes.new('ShaderNodeTexBrick');brick.offset=0;brick.inputs['Color1'].default_value=(.65,.62,.56,1);brick.inputs['Color2'].default_value=(.69,.66,.60,1);brick.inputs['Mortar'].default_value=(.40,.38,.33,1);brick.inputs['Scale'].default_value=1;brick.inputs['Mortar Size'].default_value=.0025;brick.inputs['Mortar Smooth'].default_value=.005;brick.inputs['Brick Width'].default_value=1;brick.inputs['Row Height'].default_value=1;nt.links.new(mapping.outputs['Vector'],brick.inputs['Vector']);nt.links.new(brick.outputs['Color'],p.inputs['Base Color'])
bump=nt.nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.18;bump.inputs['Distance'].default_value=.003;nt.links.new(brick.outputs['Fac'],bump.inputs['Height']);nt.links.new(bump.outputs['Normal'],p.inputs['Normal'])
for o in root.children:
 if o.name.startswith('Losa 3'):o.data.materials.clear();o.data.materials.append(mat)
for name in ['Luz ventana 3B','Rebote interior 3B']:
 o=scene.objects.get(name)
 if o:o.data.specular_factor=0 # no reflejar el disco de la luz de apoyo en el vidrio
text=bpy.data.texts.get('detalles-estar.py') or bpy.data.texts.new('detalles-estar.py');text.clear();text.write(pathlib.Path('/Users/dt/Documents/DT-System/molins-torres/3d/blender/detalles-estar.py').read_text())
bpy.ops.wm.save_as_mainfile(filepath='/Users/dt/Documents/DT-System/molins-torres/3d/blender/showroom-en-vivo.blend',copy=True)
print('Porcelanato con juntas, mueble TV y listones agregados al estar')
