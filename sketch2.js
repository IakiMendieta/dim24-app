let length, proportion, maxlevel, numgens;

function setup() {
  createCanvas(800, 800);
  
  // Crear sliders y asignar valores iniciales
  iterationsSlider = createSlider(1, 10, 3, 1);
  iterationsSlider.position(20, 40);
  let p = createP('iteraciones');
  p.position(20, 5);
  
  let q = createP('proporción');
  q.position(20, 45);
  proportionSlider = createSlider(0.2, 0.8, 0.4, 0.01);
  proportionSlider.position(20, 80);
  
  let pq = createP('longitud');
  pq.position(20, 85);
  lengthSlider = createSlider(width/18, width/3, 3*width/18, 0);
  lengthSlider.position(20, 120);
  
  let qp = createP('generadores');
  qp.position(20, 125);
  generatorSlider = createSlider(4, 8, 4, 2);
  generatorSlider.position(20, 160);
  
  translate(width/2,height/2);
  drawFractal();
  iterationsSlider.changed(drawFractal);
  proportionSlider.changed(drawFractal);
  lengthSlider.changed(drawFractal);
  generatorSlider.changed(drawFractal);
}
//Genera los vertices del poligono
function generateVertex(){
  let vertices = [];
  let theta = PI/numgens
  for(let i=0; i<numgens;i++){
    p = createVector(length*cos(2*PI*i/numgens+theta),length*sin(2*PI*i/numgens+theta));
    append(vertices, p);
  }
  return vertices;
}
//Dibuja el poligono
function drawPolygon(p){
  beginShape();
  for(let i=0;i<p.length;i++){
    vertex(p[i].x,p[i].y);
  }
  endShape(CLOSE);
}

function drawFractal(){
  //Tomar datos
  maxlevel = iterationsSlider.value();
  proportion = proportionSlider.value();
  length = lengthSlider.value();
  numgens = generatorSlider.value();
  h = length/2;
  //Poner fondo
  background(220);
  
  //crear las funciones que generaran el fractal
  let transformaciones =[];
  for(let i = 0; i<numgens;i++){
    //Se desplazan hacia donde apunta cada vertice
    append(transformaciones, funciones(createVector
    (length*cos(2*PI*(i)/numgens+PI/numgens),
    length*sin(2*PI*(i)/numgens+PI/numgens))));
  }

  /*
  f_1 = funciones(createVector(length*cos(PI/numgens),length*sin(PI/numgens)));
  g_1 = funciones(createVector(h,h));
  f_2 = funciones(createVector(-h,h));
  g_2 = funciones(createVector(-h,-h));
  transformaciones = [f_1,g_1,f_2,g_2];
  */
  //Generamos vertices y dibujamos el fractal
  vertices = generateVertex();
  drawOrbit(transformaciones,vertices);
}


//Crea una funcion que se desplaza hacia direccion y escala por la proporcion
function funciones(direccion){
  return function(p){
    return p5.Vector.add(p5.Vector.mult(p5.Vector.add(p,direccion),proportion),direccion);
  }
}

//Crea las no repeticiones para los índices
function createindexesnotinverse(){
  let inotinverse = [];
  let kinv;
  for (let k=1; k<=numgens;k++){
    kinv = ((k + 1) % numgens);
    let a = [];
    let b = [];
    for(let j = kinv+1;j<numgens;j++){
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

//Dibuja la orbita del poligono
function drawOrbit(transformaciones, p){
  //Creamos las listas que quitan al inverso
  indexnotinverse = createindexesnotinverse();
  
  function traverseforward(p, index, level){
    //Dibujamos el poligono
    drawPolygon(p);
    //si ya alnzamos el nivel maximo paramos
    if (level >= maxlevel){
      return;
    }
    //direcciones disponibles
    let indices = indexnotinverse[index];
    //Por cada direccion
    for (let i=0; i<numgens-1;i++){
      //Se la aplicamos al poligono
      let f_p =[];
      for(let j=0;j< p.length;j++){
        append( f_p,transformaciones[indices[i]](p[j]) );
      }
      //Mandamos al poligono a continuar
      traverseforward(f_p, indices[i], level+1);
    }
  }
  //Dibujamos al poligono inicial
  drawPolygon(p);
  //Vamos a cada direccion
  for(let i = 0;i<numgens;i++){
    //Con el poligono tarnsformado
    let f_p =[];
        for(let j=0;j< p.length;j++){
          append( f_p,transformaciones[i](p[j]) );
        }
    traverseforward(f_p,i,1);
  }
}