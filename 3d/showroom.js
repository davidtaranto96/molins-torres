import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// El mismo catálogo de piezas y huellas alimenta Blender y el navegador.
export async function iniciarShowroom(api) {
  const [rd, rw, rt] = await Promise.all([fetch('mobiliario.json'), fetch('muros.json'), fetch('referencias/tipologias.json')]);
  if (!rd.ok || !rw.ok || !rt.ok) throw new Error('No se pudo cargar el mobiliario o los muros');
  const datos = await rd.json(), muros = await rw.json(), referencias = await rt.json();
  const {pisos, camara, controles, render, grupo, M} = api;
  const raiz = document.createElement('section'); raiz.id = 'showroom'; raiz.setAttribute('aria-label','Diseñar y recorrer el piso');
  raiz.innerHTML = `<div class="s-fila s-cabecera"><strong>Explorar La Torre</strong><button data-a="salir">Edificio</button></div>
  <div class="s-fila s-elegir"><label>Piso <select id="s-piso">${[1,2,3,4,5,6].map(n=>`<option value="${n}">${n}</option>`).join('')}</select></label><label>Unidad <select id="s-unidad"><option value="A">A · Norte</option><option value="B" selected>B · Sur</option></select></label></div>
  <div class="s-fila s-segmentos" aria-label="Vista"><button data-a="general" aria-pressed="true">General</button><button data-a="tour" aria-pressed="false">Recorrer</button><button data-a="detalle" aria-pressed="false">Detalle</button></div>
  <div class="s-fila s-luz" aria-label="Iluminación"><button data-a="dia" aria-pressed="true">Día</button><button data-a="noche" aria-pressed="false">Noche</button><button data-a="centrar">Centrar vista</button></div>
  <div id="s-caminar" class="s-fila" hidden><button data-paso="izquierda" aria-label="Girar a la izquierda">←</button><button data-paso="adelante">Avanzar</button><button data-paso="atras">Retroceder</button><button data-paso="derecha" aria-label="Girar a la derecha">→</button></div>
  <p id="s-estado" role="status" aria-live="polite"></p>
  <details id="s-opciones"><summary>Más opciones</summary>
  <div class="s-fila"><label>Paredes <select id="s-muros"><option value="bajos">Bajas</option><option value="enteros">Completas</option><option value="ocultos">Ocultas</option></select></label><button data-a="plano" aria-pressed="false">Ver plano</button><button data-a="tipologia">Tipología oficial</button></div>
  <details id="s-editor"><summary>Amueblar el piso</summary><div class="s-fila"><label>Mueble <select id="s-objeto"></select></label><button data-a="mover">Mover</button><button data-a="girar">Girar 90°</button><button data-a="quitar">Quitar</button></div><div class="s-fila"><label>Agregar <select id="s-catalogo"><option value="sofa">Sillón</option><option value="cama">Cama</option><option value="mesa">Mesa con sillas</option><option value="mesa-baja">Mesa ratona</option><option value="planta">Planta</option><option value="placard">Placard</option></select></label><button data-a="agregar">Colocar</button><button data-a="deshacer">Deshacer</button><button data-a="restaurar">Restaurar plano</button></div></details>
  <small>Modelo en revisión. Muebles y terminaciones estimados. Tus cambios quedan en este navegador.</small></details>`;
  document.body.appendChild(raiz);
  const ficha=document.createElement('dialog');ficha.id='s-tipologia';ficha.setAttribute('aria-labelledby','s-tipologia-titulo');
  ficha.innerHTML=`<form method="dialog"><button aria-label="Cerrar tipología">Cerrar</button></form><h2 id="s-tipologia-titulo"></h2><p id="s-tipologia-unidad"></p><img alt="" width="2200" height="1556"><p>Documento original del estudio. La reconstrucción 3D sigue en revisión.</p><a target="_blank" rel="noopener">Abrir PDF original</a>`;
  document.body.appendChild(ficha);
  function mostrarTipologia(){
    const id=referencias.plantas[nivel<=4?'1-4':'5-6'][vistaUnidad];
    const t=referencias.tipologias.find(t=>t.id===id);
    ficha.querySelector('h2').textContent=`${t.titulo} · ${t.superficie_publicada_m2} m²`;
    ficha.querySelector('#s-tipologia-unidad').textContent=`Referencia para la unidad ${nivel}${vistaUnidad}`;
    const img=ficha.querySelector('img');img.src=`referencias/${t.imagen}`;img.alt=`Planta oficial: ${t.titulo}`;
    ficha.querySelector('a').href=`referencias/${t.pdf}`;ficha.showModal();
  }

  const $ = s => raiz.querySelector(s), estado = t => $('#s-estado').textContent = t;
  let activo=false, nivel=3, modo='arriba', pared='bajos', plano=false, elegido=null, colocar=null, noche=false;
  let vistaDetalle=false, movimiento=null, ultimoPaso=0;
  let vistaUnidad='B', angulo=0, inclinacion=0, arrastre=null;
  let historial=[], objetos=[], items=[], originales=[], luces=[];
  const cubo = new THREE.BoxGeometry(1,1,1), materiales={};
  function textura(color,tipo) {
    const c=document.createElement('canvas'); c.width=c.height=128; const ctx=c.getContext('2d'); ctx.fillStyle=color;ctx.fillRect(0,0,128,128);
    for(let i=0;i<260;i++){const n=(Math.sin(i*78.233)*43758.5453)%1;ctx.fillStyle=`rgba(30,22,15,${.015+Math.abs(n)*.07})`;ctx.fillRect((i*37)%128,(i*19)%128,tipo==='madera'?100:2,1);}
    const tex=new THREE.CanvasTexture(c);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.colorSpace=THREE.SRGBColorSpace;return tex;
  }
  Object.entries(datos.materiales).forEach(([k,c])=>{const map=textura(c,k);materiales[k]=new THREE.MeshStandardMaterial({map,roughness:k==='ceramica'?.27:.78,metalness:k==='metal'?.35:0,bumpMap:map,bumpScale:.015});});
  const matPiso=new THREE.MeshStandardMaterial({map:textura('#d4cbbc','piso'),roughness:.58});
  const matHumedo=new THREE.MeshStandardMaterial({map:textura('#a6a49c','piso'),roughness:.38});
  const cargador=new THREE.TextureLoader();
  const pbrReady=fetch('texturas/web.json').then(r=>{if(!r.ok)throw new Error('Texturas no disponibles');return r.json();}).then(async manifest=>{
    async function aplicarPbr(mat,nombre,repetir=1){
      for(const [canal,archivo] of Object.entries(manifest[nombre])){
        const tex=await cargador.loadAsync('texturas/'+archivo);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(repetir,repetir);tex.anisotropy=4;
        if(canal==='diff'){tex.colorSpace=THREE.SRGBColorSpace;mat.map=tex;}else if(canal==='rough')mat.roughnessMap=tex;else{mat.normalMap=tex;mat.normalScale=new THREE.Vector2(.22,.22);}
      }
      mat.bumpMap=null;mat.needsUpdate=true;
    }
    await Promise.all([aplicarPbr(materiales.madera,'oak_veneer_01'),aplicarPbr(materiales.tela,'fabric_pattern_07',3),aplicarPbr(materiales.lino,'fabric_pattern_07',3)]);
    const paredMat=pisos.find(p=>p.userData.muros)?.userData.muros.material;
    if(paredMat)await aplicarPbr(paredMat,'painted_plaster_wall',2);
  }).catch(e=>{console.warn(e);estado('Los materiales detallados no cargaron. Se muestra el acabado básico.');});

  const mobiliario=new THREE.Group();mobiliario.name='Muebles showroom';
  const capas=new THREE.Group();capas.name='Terminaciones showroom';
  const contorno=new THREE.BoxHelper(undefined,0xd98b6f);contorno.visible=false;api.escena.add(contorno);
  const luz=new THREE.HemisphereLight(0xffeed7,0x6b645a,1.25);luz.visible=false;api.escena.add(luz);
  const g=()=>pisos[nivel];
  const clave=()=>g().userData.nivel.plano;
  const pos=(x,y,h=.18)=>new THREE.Vector3(M.frente*(.5-x/100),h,g().userData.zc+g().userData.largo*(.5-y/100));
  function mueble(item) {
    const root=new THREE.Group();root.name=`Mueble ${nivel} ${item.nombre}`;root.userData.item=item;
    let w=item.ancho/100*M.frente,d=item.fondo/100*g().userData.largo;
    // Las huellas JSON son las del plano antes de orientar el modelo.
    const giroBase=item.tipo==='sofa'?90:0;
    if(giroBase) [w,d]=[d,w];
    const lotes={};
    datos.modelos[item.tipo].forEach(p=>{const geo=new RoundedBoxGeometry(p.tam[0]*w,p.tam[1],p.tam[2]*d,2,Math.min(.035,p.tam[1]/4));geo.translate(p.pos[0]*w,p.pos[1],p.pos[2]*d);(lotes[p.material]??=[]).push(geo);});
    Object.entries(lotes).forEach(([mat,geos])=>{const mesh=new THREE.Mesh(mergeGeometries(geos),materiales[mat]);geos.forEach(x=>x.dispose());mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);});
    root.position.copy(pos(item.x,item.y));root.rotation.y=item.giro*Math.PI/180;return root;
  }
  function limpiar(gr){gr.traverse(o=>{if(o.isMesh)o.geometry.dispose();});gr.clear();}
  function guardar(){try{localStorage.setItem(`torre-showroom-v1-${nivel}`,JSON.stringify(items));return true;}catch{estado('No se pudieron guardar los cambios en este navegador.');return false;}}
  function valido(a){return Array.isArray(a)&&a.length<=100&&a.every(i=>i&&datos.modelos[i.tipo]&&typeof i.id==='string'&&typeof i.nombre==='string'&&['x','y','ancho','fondo','giro'].every(k=>Number.isFinite(i[k]))&&i.x>=0&&i.x<=100&&i.y>=0&&i.y<=100&&i.ancho>0&&i.ancho<80&&i.fondo>0&&i.fondo<40);}
  function dibujar(){
    limpiar(mobiliario);objetos=items.map(mueble);objetos.forEach(o=>mobiliario.add(o));
    $('#s-objeto').replaceChildren(...items.map(i=>{const op=document.createElement('option');op.value=i.id;op.textContent=i.nombre;return op;}));
    if(!items.some(i=>i.id===elegido))elegido=items[0]?.id??null;
    $('#s-objeto').value=elegido??'';resaltar();
    ['mover','girar','quitar'].forEach(a=>$(`[data-a="${a}"]`).disabled=!elegido);
    $('[data-a="deshacer"]').disabled=!historial.length;
  }
  function resaltar(){const o=objetos.find(o=>o.userData.item.id===elegido);contorno.visible=activo&&modo==='arriba'&&$('#s-opciones').open&&$('#s-editor').open&&!!o;if(o){grupo.updateMatrixWorld(true);contorno.setFromObject(o);}}
  function recordar(){historial.push(JSON.stringify(items));if(historial.length>30)historial.shift();}
  function huella(i){
    let dx=i.ancho/2,dy=i.fondo/2;
    if(Math.abs((i.giro-(i.tipo==='sofa'?90:0))%180)===90){const a=dy*g().userData.largo/M.frente;dy=dx*M.frente/g().userData.largo;dx=a;}
    return {dx,dy};
  }
  function disponible(i){
    const {x,y}=i,{dx,dy}=huella(i),ratio=clave()==='tipo'?1:clave()==='p5'?1.103:1.184;
    const chocaPatio=x+dx>55&&y+dy>42*ratio&&y-dy<(clave()==='tipo'?64:clave()==='p5'?67:73);
    return !(x-dx<8||x+dx>92||y-dy<9||y+dy>(clave()==='p5'?84:94)||chocaPatio||muros[clave()].some(([a,b,c,d])=>x+dx>a&&x-dx<c&&y+dy>b&&y-dy<d)||items.some(o=>{const h=huella(o);return o.id!==i.id&&Math.abs(x-o.x)<dx+h.dx&&Math.abs(y-o.y)<dy+h.dy;}));
  }
  function cambiar(fn){recordar();fn();dibujar();guardar();}
  function cajaSuelo(x,y,w,d,mat){const o=new THREE.Mesh(new THREE.BoxGeometry(w/100*M.frente,.015,d/100*g().userData.largo),mat);o.position.copy(pos(x,y,.185));o.receiveShadow=true;capas.add(o);}
  function terminaciones(){
    limpiar(capas);
    // Rectángulos de baños y cocinas leídos sobre las mismas plantas; no se agrega terraza habitable.
    const ratio=clave()==='tipo'?1:clave()==='p5'?.3261/.2957:.3502/.2957;
    cajaSuelo(29,35.4*ratio,40,5*ratio,matHumedo);cajaSuelo(71,32.5*ratio,41,9*ratio,matHumedo);
    if(clave()==='tipo'){cajaSuelo(29,67.5,40,5,matHumedo);cajaSuelo(71,70,41,9,matHumedo);}else cajaSuelo(31,clave()==='p5'?70.5:77,40,5,matHumedo);
    // Cielorrasos sólo sobre las unidades, nunca sobre el patio ni sobre terraza.
    for(const [ya,yb] of [[11*ratio,38*ratio],[clave()==='tipo'?65:clave()==='p5'?68:74,clave()==='p5'?84:94]]){
      const techo=new THREE.Mesh(new THREE.BoxGeometry(M.frente*.82,.08,(yb-ya)/100*g().userData.largo),materiales.lino);
      techo.position.copy(pos(50,(ya+yb)/2,2.73));techo.userData.techo=true;capas.add(techo);
    }
    // Carpintería de balcón: posición leída de la planta; espesores y alturas estimados.
    for(const yy of [11*ratio,clave()==='p5'?84:94]){
      for(const [xa,xb] of [[15,48],[51,91]]){
        const ancho=(xb-xa)/100*M.frente;
        for(const x of [xa,(xa+xb)/2,xb]){const marco=new THREE.Mesh(new THREE.BoxGeometry(.045,2.35,.08),materiales.metal);marco.position.copy(pos(x,yy,1.35));capas.add(marco);}
        for(const h of [.2,2.52]){const marco=new THREE.Mesh(new THREE.BoxGeometry(ancho,.045,.08),materiales.metal);marco.position.copy(pos((xa+xb)/2,yy,h));capas.add(marco);}
        const vidrio=new THREE.Mesh(new THREE.BoxGeometry(ancho,2.3,.018),new THREE.MeshStandardMaterial({color:0xb8ced0,transparent:true,opacity:.17,roughness:.15,metalness:.25}));vidrio.position.copy(pos((xa+xb)/2,yy,1.35));capas.add(vidrio);
        const cortina=new THREE.Mesh(new THREE.BoxGeometry(ancho*.17,2.25,.035),materiales.lino);cortina.position.copy(pos(xa+(xb-xa)*.10,yy+.35,1.37));capas.add(cortina);
      }
    }
    // Juntas a 60 cm (estimación de porcelanato de los renders); una malla por piso.
    const geos=[];const largo=g().userData.largo,zc=g().userData.zc;
    for(let x=-3.5;x<=3.5;x+=.6){const ge=cubo.clone();ge.scale(.008,.003,largo);ge.translate(x,.196,zc);geos.push(ge);}
    for(let z=zc-largo/2;z<=zc+largo/2;z+=.6){const ge=cubo.clone();ge.scale(7,.003,.008);ge.translate(0,.196,z);geos.push(ge);}
    capas.add(new THREE.Mesh(mergeGeometries(geos),materiales.piedra));geos.forEach(x=>x.dispose());
  }
  function encuadrar(){
    const w=innerWidth,h=innerHeight,alto=raiz.getBoundingClientRect().height;
    camara.setViewOffset(w,h,w>=900?180:0,w>=900?0:alto/2,w,h);
  }
  const observador=new ResizeObserver(()=>{if(activo)encuadrar();});observador.observe(raiz);
  function aplicar(){
    pisos.forEach((p,i)=>{p.visible=!activo||i===nivel;if(activo){p.position.y=p.userData.y0;p.userData.fantasmas.forEach(f=>f.visible=false);p.userData.plano.visible=plano;p.userData.losa.material.opacity=1;}
      if(p.userData.muros){p.userData.muros.visible=!activo||pared!=='ocultos';p.userData.muros.scale.y=activo&&pared==='bajos'?.13:1;}});
    if(activo){g().userData.losa.material=plano?g().userData.materialOriginal:matPiso;capas.visible=!plano;capas.children.forEach(o=>{if(o.userData.techo)o.visible=modo==='adentro';});}
    luz.visible=activo;resaltar();
  }
  function cargar(n){
    salirRecorrido();if(activo){g().userData.losa.material=g().userData.materialOriginal;}
    nivel=n;$('#s-piso').value=String(n);originales=structuredClone(datos.plantas[clave()]);items=structuredClone(originales);
    try{const saved=JSON.parse(localStorage.getItem(`torre-showroom-v1-${n}`));if(valido(saved))items=saved;}catch{}
    historial=[];elegido=null;colocar=null;g().add(mobiliario,capas);dibujar();terminaciones();aplicar();verUnidad(vistaUnidad);
    estado('Elegí una unidad o entrá a recorrerla. Arrastrá para girar la vista.');
  }
  function verUnidad(letra){
    vistaUnidad=letra;$('#s-unidad').value=letra;sincronizar();const yy=letra==='B'?21:clave()==='tipo'?82:clave()==='p5'?77:85;
    if(modo==='adentro'){teleportar(letra);return;}
    const center=g().localToWorld(pos(50,yy,.3));
    const offset=new THREE.Vector3(...(vistaDetalle?[2.2,4,3.5]:[4,10,7])).applyAxisAngle(new THREE.Vector3(0,1,0),grupo.rotation.y);
    api.detenerCamara();controles.target.copy(center);camara.position.copy(center).add(offset);camara.near=.08;camara.updateProjectionMatrix();controles.update();encuadrar();
  }
  function teleportar(letra){
    const y=letra==='B'?27:clave()==='tipo'?77:clave()==='p5'?74:81;
    camara.position.copy(g().localToWorld(pos(62,y,1.78)));const destino=g().localToWorld(pos(letra==='B'?79:70,letra==='B'?14:clave()==='tipo'?88:clave()==='p5'?80:87,1.35));camara.lookAt(destino);const orientacion=new THREE.Euler().setFromQuaternion(camara.quaternion,'YXZ');angulo=orientacion.y;inclinacion=orientacion.x;mirar();encuadrar();
  }
  function mirar(){camara.rotation.order='YXZ';camara.rotation.set(inclinacion,angulo,0);}
  function salirRecorrido(){modo='arriba';movimiento=null;sincronizar();$('#s-caminar').hidden=true;controles.enabled=true;arrastre=null;}
  function recorrido(){vistaDetalle=false;modo='adentro';sincronizar();colocar=null;$('#s-editor').open=false;$('#s-opciones').open=false;$('#s-caminar').hidden=false;controles.enabled=false;api.detenerCamara();pared='enteros';$('#s-muros').value=pared;teleportar(vistaUnidad);aplicar();estado('Arrastrá para mirar. Mantené Avanzar o Retroceder para caminar. Flechas o W A S D también funcionan.');}
  function bloqueado(p,r=.18){
    const v=g().worldToLocal(p.clone()), xp=(.5-v.x/M.frente)*100,yp=(.5-(v.z-g().userData.zc)/g().userData.largo)*100;
    if(xp<9||xp>91||yp<9||yp>94)return true;
    if(clave()==='p5'&&yp>84)return true;
    if(xp>55&&yp>43*(clave()==='tipo'?1:1.08)&&yp<(clave()==='tipo'?64:clave()==='p5'?67:73))return true; // vacío del patio
    const dx=r/M.frente*100,dy=r/g().userData.largo*100;
    return muros[clave()].some(([x0,y0,x1,y1])=>xp>x0-dx&&xp<x1+dx&&yp>y0-dy&&yp<y1+dy)||items.some(i=>{const h=huella(i);return Math.abs(xp-i.x)<h.dx+dx&&Math.abs(yp-i.y)<h.dy+dy;});
  }
  function paso(dir){if(!activo||modo!=='adentro')return;if(dir==='izquierda'||dir==='derecha'){angulo+=(dir==='izquierda'?1:-1)*.16;mirar();return;}const v=new THREE.Vector3(0,0,dir==='adelante'?-.16:.16).applyAxisAngle(new THREE.Vector3(0,1,0),angulo);const p=camara.position.clone().add(v);if(!bloqueado(p))camara.position.copy(p);else estado('Hay una pared, un mueble o un límite del piso. Probá girar.');}
  function abrir(n=3){if(activo){cargar(n);return;}pisos.forEach(p=>p.userData.materialOriginal=p.userData.losa.material);api.entrar(n);activo=true;document.body.classList.add('showroom-activo');controles.minDistance=2;controles.maxDistance=45;cargar(n);}
  function cerrar(){if(!activo)return;salirRecorrido();activo=false;colocar=null;document.body.classList.remove('showroom-activo');pisos.forEach(p=>{p.visible=true;p.userData.plano.visible=true;p.userData.losa.material=p.userData.materialOriginal;p.userData.fantasmas.forEach(f=>f.visible=true);if(p.userData.muros)p.userData.muros.scale.y=1;});mobiliario.removeFromParent();capas.removeFromParent();contorno.visible=luz.visible=false;controles.minDistance=12;controles.maxDistance=130;camara.near=.5;camara.clearViewOffset();camara.updateProjectionMatrix();api.salir();}
  $('#s-piso').onchange=e=>cargar(Number(e.target.value));
  $('#s-unidad').onchange=e=>verUnidad(e.target.value);
  function sincronizar(){
    for(const [a,on] of [['general',modo==='arriba'&&!vistaDetalle],['tour',modo==='adentro'],['detalle',modo==='arriba'&&vistaDetalle],['dia',!noche],['noche',noche]])$(`[data-a="${a}"]`).setAttribute('aria-pressed',String(on));
  }
  function general(detalle=false){vistaDetalle=detalle;salirRecorrido();pared='bajos';$('#s-muros').value=pared;verUnidad(vistaUnidad);aplicar();estado(detalle?'Arrastrá para girar. Usá la rueda o dos dedos para acercarte.':'Elegí una unidad o entrá a recorrerla.');}
  $('#s-muros').onchange=e=>{pared=e.target.value;aplicar();};
  $('#s-objeto').onchange=e=>{elegido=e.target.value;colocar=null;resaltar();};
  raiz.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;if(b.dataset.paso){if(e.detail===0)paso(b.dataset.paso);return;}
    const item=items.find(i=>i.id===elegido);
    switch(b.dataset.a){
      case 'salir':cerrar();break;
      case 'unidadA':verUnidad('A');break;case 'unidadB':verUnidad('B');break;
      case 'general':general();break;
      case 'tour':recorrido();break;
      case 'detalle':general(true);break;
      case 'centrar':verUnidad(vistaUnidad);break;
      case 'dia':case 'noche':noche=b.dataset.a==='noche';api.hora(noche?1290:750);sincronizar();break;
      case 'plano':plano=!plano;b.setAttribute('aria-pressed',String(plano));aplicar();break;
      case 'mover':if(item){colocar={...item};estado('Tocá el piso donde querés colocar el mueble. Escape cancela.');}break;
      case 'girar':if(item){const next={...item,giro:(item.giro+90)%360};if(disponible(next))cambiar(()=>Object.assign(item,next));else estado('No hay espacio para girar el mueble. Movelo primero.');}break;
      case 'quitar':if(item)cambiar(()=>{items=items.filter(i=>i!==item);});break;
      case 'tipologia':mostrarTipologia();break;
      case 'agregar':{if(items.length>=100){estado('Llegaste al máximo de 100 muebles por piso.');break;}const tipo=$('#s-catalogo').value;const dim={sofa:[28,4],cama:[25,8],mesa:[16,3],'mesa-baja':[10,3],planta:[7,2],placard:[22,3]}[tipo];colocar={id:crypto.randomUUID(),tipo,nombre:$('#s-catalogo').selectedOptions[0].textContent,x:50,y:20,ancho:dim[0],fondo:dim[1],giro:0};estado('Tocá un lugar libre del piso para colocar el mueble.');break;}
      case 'deshacer':if(historial.length){items=JSON.parse(historial.pop());colocar=null;dibujar();guardar();}break;
      case 'restaurar':cambiar(()=>{items=structuredClone(originales);colocar=null;});estado('Distribución original restaurada. Podés deshacer.');break;
    }
  });
  const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();
  function apuntar(e){const r=render.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camara);}
  function click(e){
    if(!activo||modo!=='arriba')return false;apuntar(e);
    if(colocar){
      const p=new THREE.Vector3(),h=g().getWorldPosition(new THREE.Vector3()).y+.18;
      if(!ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),-h),p))return true;
      const local=g().worldToLocal(p);const x=(.5-local.x/M.frente)*100,y=(.5-(local.z-g().userData.zc)/g().userData.largo)*100;
      const candidato={...colocar,x:Math.round(x*10)/10,y:Math.round(y*10)/10};
      if(!disponible(candidato)) {estado('Ese lugar está ocupado o fuera del espacio disponible. Elegí otro.');return true;}
      cambiar(()=>{items=items.filter(i=>i.id!==candidato.id);items.push(candidato);elegido=candidato.id;colocar=null;});estado('Mueble colocado.');return true;
    }
    const hit=ray.intersectObjects(objetos,true)[0];if(hit){let o=hit.object;while(o&&!o.userData.item)o=o.parent;elegido=o.userData.item.id;$('#s-objeto').value=elegido;$('#s-opciones').open=true;$('#s-editor').open=true;resaltar();}return true;
  }
  render.domElement.addEventListener('pointerdown',e=>{if(activo&&modo==='adentro'){arrastre={x:e.clientX,y:e.clientY};render.domElement.setPointerCapture(e.pointerId);}});
  render.domElement.addEventListener('pointermove',e=>{if(!arrastre)return;angulo-=(e.clientX-arrastre.x)*.004;inclinacion=THREE.MathUtils.clamp(inclinacion-(e.clientY-arrastre.y)*.003,-1,1);arrastre={x:e.clientX,y:e.clientY};mirar();});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])render.domElement.addEventListener(event,()=>arrastre=null);
  addEventListener('blur',()=>{arrastre=null;movimiento=null;});
  raiz.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-paso]');if(!b)return;e.preventDefault();movimiento=b.dataset.paso;ultimoPaso=performance.now();paso(movimiento);b.setPointerCapture(e.pointerId);});
  for(const type of ['pointerup','pointercancel','lostpointercapture'])raiz.addEventListener(type,()=>movimiento=null);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)movimiento=null;});
  addEventListener('keydown',e=>{if(ficha.open){movimiento=null;e.stopImmediatePropagation();return;}if(!activo||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;if(e.key==='Escape'){e.stopImmediatePropagation();if(colocar){colocar=null;estado('Colocación cancelada.');}else if(modo==='adentro'){general();}else cerrar();return;}const dir={w:'adelante',s:'atras',a:'izquierda',d:'derecha',ArrowUp:'adelante',ArrowDown:'atras',ArrowLeft:'izquierda',ArrowRight:'derecha'}[e.key];if(dir&&modo==='adentro'){e.preventDefault();paso(dir);}},true);
  return {abrir,cerrar,click,pbrReady,get activo(){return activo;},get recorriendo(){return activo&&modo==='adentro';},actualizar(){if(activo){if(movimiento&&!ficha.open&&performance.now()-ultimoPaso>80){ultimoPaso=performance.now();paso(movimiento);}aplicar();if(modo==='adentro')mirar();}},diagnostico(){return {nivel,modo,vistaUnidad,vistaDetalle,noche,movimiento,muebles:items.length,pared,seleccion:elegido,guardado:items.map(i=>({...i}))};}};
}
