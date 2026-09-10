import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Acabados del exterior: PBR CC0; escala visual calibrada con el detalle de balcón.
export async function mejorarExterior({edificio,mat,M,zLM,zLF,yNivel}) {
  const r=await fetch('texturas/exterior-web.json');if(!r.ok)throw new Error('No se pudieron cargar las texturas de fachada');
  const manifest=await r.json(),loader=new THREE.TextureLoader();
  async function acabado(material,asset){
    const mapas={};for(const [key,file] of Object.entries(manifest[asset])){const tex=await loader.loadAsync('texturas/'+file);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.anisotropy=4;if(key==='diff')tex.colorSpace=THREE.SRGBColorSpace;mapas[key]=tex;}
    material.map=mapas.diff;material.normalMap=mapas.nor_gl;material.normalScale=new THREE.Vector2(.40,.40);material.roughnessMap=mapas.rough;material.bumpMap=null;material.color.set(0xffffff);material.needsUpdate=true;
  }
  await acabado(mat.ladrillo,'red_brick');
  // UV en metros: las cajas tenían UV normalizados y estiraban el ladrillo al cambiar de alto.
  edificio.traverse(o=>{if(!o.isMesh||![mat.ladrillo].includes(o.material))return;
    o.geometry=o.geometry.clone();const pos=o.geometry.attributes.position,normal=o.geometry.attributes.normal,uv=o.geometry.attributes.uv;
    for(let i=0;i<pos.count;i++){const x=pos.getX(i)*o.scale.x,y=pos.getY(i)*o.scale.y,z=pos.getZ(i)*o.scale.z;
      if(Math.abs(normal.getY(i))>.5)uv.setXY(i,x*.75,z*.75);else if(Math.abs(normal.getX(i))>.5)uv.setXY(i,z*.75,y*.75);else uv.setXY(i,x*.75,y*.75);}
    uv.needsUpdate=true;
  });
  // Reemplazar cada volumen de vegetación en su ubicación original.
  // Se mantiene unido a su planta para la vista por niveles.
  const plantas=[];
  edificio.traverse(o=>{if(o.isMesh && (o.userData.follaje || o.material===mat.planta))plantas.push(o);});
  const shape=new THREE.Shape();shape.moveTo(0,-1);shape.quadraticCurveTo(.7,0,0,1);shape.quadraticCurveTo(-.7,0,0,-1);
  const leaf=new THREE.ShapeGeometry(shape,5);
  const hojas=new THREE.MeshStandardMaterial({color:0x527642,roughness:.85,side:THREE.DoubleSide});
  for(const planta of plantas){
    planta.geometry.computeBoundingBox();const box=planta.geometry.boundingBox;
    const size=box.getSize(new THREE.Vector3()).multiply(planta.scale);
    const center=box.getCenter(new THREE.Vector3()).multiply(planta.scale).add(planta.position);
    const geos=[];
    for(let j=0;j<100;j++){
      const a=j*2.399963, t=(j+.5)/100, radius=Math.sqrt(t)*.5;
      const geo=leaf.clone();geo.scale(.045,.095,1);geo.rotateX(j*.71);geo.rotateY(a);geo.rotateZ(a);
      geo.translate(center.x+Math.cos(a)*radius*size.x,center.y+Math.sin(j*1.7)*size.y*.5,center.z+Math.sin(a)*radius*size.z);geos.push(geo);
    }
    const foliage=new THREE.Mesh(mergeGeometries(geos),hojas);foliage.name='Follaje de balcón';foliage.castShadow=true;
    planta.parent.add(foliage);planta.removeFromParent();geos.forEach(g=>g.dispose());
  }
  // Enredaderas: hojas por tallo, cayendo desde la baranda de balcones habitables.
  const colgantes=[];
  for(let k=1;k<=6;k++)for(const z of k<=4?[zLM,zLF]:[zLF]){
    const dir=z===zLM?1:-1,y=yNivel(k),group=new THREE.Group();
    group.name='Balcón amueblado';edificio.add(group);
    const box=(w,h,d,x,yy,zz,m)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,yy,zz);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);};
    // Banco y mesa bajos, dentro del balcón y sin ocupar la cubierta retirada.
    box(.7,.12,.4,-1.25,y+.48,z+dir*.55,mat.liston);
    box(.7,.38,.07,-1.25,y+.67,z+dir*.73,mat.liston);
    for(const x of [-1.52,-.98])box(.055,.4,.055,x,y+.22,z+dir*.55,mat.metal);
    box(.42,.055,.42,-.42,y+.42,z+dir*.55,mat.liston);
    box(.06,.4,.06,-.42,y+.2,z+dir*.55,mat.metal);
    box(.7,.2,.22,-2.05,y+.85,z+dir*.05,mat.hormigon);
    for(let stem=0;stem<12;stem++)for(let j=0;j<18;j++){
      const geo=leaf.clone(),t=j/18;
      geo.scale(.045,.09,1);geo.rotateY(stem*.9);geo.rotateZ(Math.sin(j+stem)*.6);
      geo.translate(-2.36+stem*.056+Math.sin(t*5+stem)*.065,y+.9-t*(.65+(stem%4)*.12),z-dir*.04+Math.sin(j)*.035);colgantes.push(geo);
    }
  }
  const vines=new THREE.Mesh(mergeGeometries(colgantes),hojas);vines.name='Plantas colgantes';vines.castShadow=true;edificio.add(vines);colgantes.forEach(g=>g.dispose());
  // Vidrio sin imágenes pegadas: reflejos suaves y luz cálida al anochecer.
  const vistos=new Set();
  edificio.traverse(o=>{
    const m=o.material;
    if(!o.isMesh||!m||m.metalness!==.6||!m.emissive||vistos.has(m))return;
    vistos.add(m);m.roughness=.16;m.envMapIntensity=1.2;m.needsUpdate=true;
  });
  leaf.dispose();
  for(const material of [mat.hormigon,mat.encofrado,mat.losa,mat.revoque]){
    material.bumpMap=material.map;material.bumpScale=.025;material.needsUpdate=true;
  }
  mat.metal.roughness=.32;mat.metal.metalness=.55;
  return {fuentes:['https://polyhaven.com/a/red_brick']};
}
