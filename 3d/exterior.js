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
  // Follaje de balcones en una malla: antes era una caja verde.
  const geos=[],shape=new THREE.Shape();shape.moveTo(0,-1);shape.quadraticCurveTo(.7,0,0,1);shape.quadraticCurveTo(-.7,0,0,-1);const leaf=new THREE.ShapeGeometry(shape,5);
  const hojas=new THREE.MeshStandardMaterial({color:0x527642,roughness:.7,side:THREE.DoubleSide});
  for(let k=1;k<=6;k++)for(const z of k<=4?[zLM,zLF]:[zLF])for(const x of [-2.05,1.9])for(let j=0;j<100;j++){
    const a=j*2.399+k,radio=.11+(j%3)*.045;const geo=leaf.clone();geo.scale(.055,.11,1);geo.rotateX(j*.71);geo.rotateY(a);geo.rotateZ(a);
    geo.translate(x+Math.cos(a)*radio,yNivel(k)+.30+Math.sin(j*1.7)*.17,z+Math.sin(a)*radio+(z===zLM?.28:-.28));geos.push(geo);
  }
  const foliage=new THREE.Mesh(mergeGeometries(geos),hojas);foliage.name='Follaje de balcones';foliage.castShadow=true;edificio.add(foliage);geos.forEach(g=>g.dispose());leaf.dispose();
  mat.metal.roughness=.32;mat.metal.metalness=.55;
  return {fuentes:['https://polyhaven.com/a/red_brick']};
}
