"""Panel local para explorar y editar la escena de showroom en Blender.
Ejecutar en la escena Showroom en vivo. No afecta la escena original.
"""
import bpy, math
from mathutils import Vector

# Cada mueble debe seleccionarse y moverse entero, no una pieza suelta.
scene=bpy.context.scene
for root in [o for o in scene.objects if o.type=='EMPTY' and o.get('mueble_id')]:
 parts=[o for o in root.children if o.type=='MESH']
 if not parts:continue
 bpy.ops.object.select_all(action='DESELECT')
 for o in parts:o.hide_set(False);o.select_set(True)
 bpy.context.view_layer.objects.active=parts[0];bpy.ops.object.join()
 mesh=parts[0];name=root.name;parent=root.parent
 world=mesh.matrix_world.copy();mesh.parent=parent;mesh.matrix_world=world
 for key in ['mueble_id','tipo','estimado']:mesh[key]=root[key]
 bpy.data.objects.remove(root,do_unlink=True);mesh.name=name
 bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 bevel=mesh.modifiers.new('Bordes suaves','BEVEL');bevel.width=.025;bevel.segments=3
 mesh.modifiers.new('Normales de mueble','WEIGHTED_NORMAL')

class TORRE_OT_vista(bpy.types.Operator):
 bl_idname='torre.vista';bl_label='Ver piso';bl_options={'REGISTER','UNDO'}
 piso:bpy.props.IntProperty(default=3)
 def execute(self,context):
  scene=context.scene;scene['showroom_piso']=self.piso
  root=next((o for o in scene.objects if o.name.startswith(f'Nivel {self.piso} raiz')),None)
  allowed=set(root.children_recursive)|{root} if root else set()
  for o in scene.objects:
   o.hide_set(o.type not in {'LIGHT','CAMERA'} and o not in allowed)
   if o.get('referencia') or o.get('reemplazado_exterior'):o.hide_set(True)
  for area in getattr(context.screen, 'areas', []):
   if area.type=='VIEW_3D':
    area.spaces.active.region_3d.view_location=Vector((0,5.8,3.2+(self.piso-1)*2.8+.5))
    area.spaces.active.region_3d.view_distance=13
    area.spaces.active.region_3d.view_perspective='PERSP'
  return {'FINISHED'}
class TORRE_OT_paredes(bpy.types.Operator):
 bl_idname='torre.paredes';bl_label='Cambiar paredes';bl_options={'REGISTER','UNDO'}
 modo:bpy.props.StringProperty(default='bajas')
 def execute(self,context):
  n=context.scene.get('showroom_piso',3)
  for o in context.scene.objects:
   if o.name.startswith('Cielorraso') and str(n) in o.name:o.hide_set(self.modo!='enteras')
   if o.name.startswith(f'Muros {n}'):
    if 'altura_original' not in o:o['altura_original']=2.6
    o.hide_set(self.modo=='ocultas');o.scale.z=.13 if self.modo=='bajas' else o['altura_original']
  return {'FINISHED'}
class TORRE_OT_entero(bpy.types.Operator):
 bl_idname='torre.entero';bl_label='Ver edificio entero'
 def execute(self,context):
  for o in context.scene.objects:
   o.hide_set(bool(o.get('referencia') or o.get('reemplazado_exterior')))
   o.hide_render=o.hide_get()
   if o.name.startswith('Muros '):o.scale.z=o.get('altura_original',o.scale.z)
  for area in getattr(context.screen, 'areas', []):
   if area.type=='VIEW_3D':
    area.spaces.active.region_3d.view_location=Vector((0,0,10));area.spaces.active.region_3d.view_distance=45
  return {'FINISHED'}
class TORRE_OT_camara(bpy.types.Operator):
 bl_idname='torre.camara';bl_label='Elegir cámara'
 nombre:bpy.props.StringProperty()
 def execute(self,context):
  if self.nombre=='Interior terminado 3B':
   bpy.ops.torre.vista(piso=3);bpy.ops.torre.paredes(modo='enteras')
  else:bpy.ops.torre.entero()
  cam=context.scene.objects.get(self.nombre)
  if not cam:return {'CANCELLED'}
  context.scene.camera=cam
  for area in getattr(context.screen,'areas',[]):
   if area.type=='VIEW_3D':area.spaces.active.region_3d.view_perspective='CAMERA'
  return {'FINISHED'}
class TORRE_PT_showroom(bpy.types.Panel):
 bl_label='La Torre · showroom';bl_idname='TORRE_PT_showroom';bl_space_type='VIEW_3D';bl_region_type='UI';bl_category='La Torre'
 @classmethod
 def poll(cls,context):return context.scene.name.startswith('Showroom')
 def draw(self,context):
  layout=self.layout;layout.label(text='Explorar el edificio')
  row=layout.row(align=True)
  for i in range(1,7):row.operator('torre.vista',text=str(i)).piso=i
  row=layout.row(align=True)
  for key,label in [('enteras','Completas'),('bajas','Bajas'),('ocultas','Ocultas')]:row.operator('torre.paredes',text=label).modo=key
  layout.operator('torre.entero',text='Ver edificio entero')
  for nombre,label in [('Frente La Torre','Frente'),('Aérea La Torre','Vista aérea'),('Cenital La Torre','Desde arriba'),('Contrafrente La Torre','Contrafrente'),('Interior terminado 3B','Interior 3B')]:
   layout.operator('torre.camara',text=label).nombre=nombre
  layout.separator();layout.label(text='Seleccionar un mueble completo')
  layout.label(text='G: mover · R Z: girar · H: ocultar')
  layout.label(text='Alt H: mostrar · Shift D: duplicar')
  layout.label(text='Ctrl Z: deshacer')
for c in [TORRE_OT_vista,TORRE_OT_paredes,TORRE_OT_entero,TORRE_OT_camara,TORRE_PT_showroom]:
 old=getattr(bpy.types,c.__name__,None)
 if old:bpy.utils.unregister_class(old)
 bpy.utils.register_class(c)
for area in getattr(bpy.context.screen, 'areas', []):
 if area.type=='VIEW_3D':area.spaces.active.show_region_ui=True
print('Muebles unidos, bordes suavizados y panel La Torre registrado')
