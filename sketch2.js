let length, proportion, maxlevel;

function setup() {
  createCanvas(500, 500);
  
  // Crear sliders y asignar valores iniciales
  iterationsSlider = createSlider(1, 6, 3, 1);
  iterationsSlider.position(20, 40);
  let p = createP('iteraciones');
  p.position(20, 5);
  
  let q = createP('proporción');
  q.position(20, 45);
  proportionSlider = createSlider(0.3, 0.7, 0.5, 0.1);
  proportionSlider.position(20, 80);
  
  let pq = createP('longitud');
  pq.position(20, 85);
  lengthSlider = createSlider(width/4, width, width/4, width/4);
  lengthSlider.position(20, 120);
  translate(width/2,height/2);
  drawFractal();
  iterationsSlider.changed(drawFractal);
  proportionSlider.changed(drawFractal);
  lengthSlider.changed(drawFractal);
}

function drawFractal(){
  maxlevel = iterationsSlider.value();
  proportion = proportionSlider.value();
  length = lengthSlider.value();
  h = length/2;
  background(220);
  f_1 = funciones(createVector(h,-h));
  g_1 = funciones(createVector(h,h));
  f_2 = funciones(createVector(-h,h));
  g_2 = funciones(createVector(-h,-h));
  transformaciones = [f_1,g_1,f_2,g_2];
  drawOrbit(transformaciones,createVector(-h,-h));
}

function funciones(direccion){
  return function(p){
    return p5.Vector.add(p5.Vector.mult(p5.Vector.add(p,direccion),proportion),direccion);
  }
}

function createindexesnotinverse(){
  let inotinverse = [];
  let kinv;
  for (let k=1; k<=4;k++){
    kinv = ((k + 1) % 4);
    let a = [];
    let b = [];
    for(let j = kinv+1;j<4;j++){
      append(a,j);
    }
    for(let j = 0;j<=kinv-1;j++){
      append(b,j);
    }
    c = a.concat(b);
    inotinverse.push(c);
  }
  return inotinverse;
}

function drawOrbit(transformaciones, p){
  indexnotinverse = createindexesnotinverse();
  
  function traverseforward(p, index, level){
    square(p.x,p.y,length*(proportion**(level)));
    if (level >= maxlevel){
      return;
    }
    let indices = indexnotinverse[index];
    for (let i=0; i<3;i++){
      traverseforward(transformaciones[indices[i]](p), indices[i], level+1);
    }
  }
  square(p.x,p.y,length);
  for(let i = 0;i<4;i++){
    traverseforward(transformaciones[i](p),i,1);
  }
}
