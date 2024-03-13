
let fractalDiv;
let divWidth, divHeight
let length, proportion, maxlevel, colorPicker, uploadedImage, logo_im, logo_unam,numgens;

function setup() {
  //  Contenedor
  fractalDiv = createDiv();
  fractalDiv.parent("fractal");
  fractalDiv.class("fractalSkin")

  divWidth = fractalDiv.size().width;
  divHeight = fractalDiv.size().height;

  //let canvas = createCanvas(250,250);
  let canvas = createCanvas(divWidth, windowHeight/2);
  canvas.parent(fractalDiv); // colocar canvas en contenedor
  //canvas.elt.classList.add("fractalSkin"); // Agregar canvas a clase de css

  // Crear sliders y asignar valores iniciales
  let text1 = createP('iteraciones');
  text1.parent("slider");
  //p.position(20, 5);
  iterationsSlider = createSlider(1, 6, 3, 1);
  iterationsSlider.parent("slider");
  iterationsSlider.class("sliderSkin");

  //  iterationsSlider.position(20, 40);

  let text2 = createP('proporción');
  text2.parent("slider");
  //  q.position(20, 45);
  proportionSlider = createSlider(0.2, 0.8, 0.4, 0.01);
  proportionSlider.parent("slider");
  proportionSlider.class("sliderSkin");
  //  proportionSlider.position(20, 80);

  let text3 = createP('zoom');
  text3.parent("slider");
  //  pq.position(20, 85);
  lengthSlider = createSlider(divWidth / 20, divWidth / 5, divWidth/10 , 0);
  //lengthSlider = createSlider(width / 18, width / 2, width / 10, width / 18);
  lengthSlider.parent("slider");
  lengthSlider.class("sliderSkin");

  let text4 = createP('Caras');
  text4.parent("slider");
  generatorSlider = createSlider(4 , 10 , 4 , 2);
  generatorSlider.parent("slider");
  generatorSlider.class("sliderSkin");

  let texto_color = createP("Color del fondo");
  texto_color.parent("slider");
  colorPicker = createColorPicker(color(173, 216, 230));
  colorPicker.parent("slider");
  colorPicker.class("sliderSkin");
  let cuadro_color = createP("Color del fractal");
  cuadro_color.parent("slider");
  colorPickerCuadro = createColorPicker(color(random(0,255),random(0,255),random(0,255)));
  colorPickerCuadro.parent("slider");
  colorPickerCuadro.class("sliderSkin");


  iterationsSlider.changed(drawFractal);
  proportionSlider.changed(drawFractal);
  lengthSlider.changed(drawFractal);
  generatorSlider.changed(drawFractal);
  colorPicker.changed(drawFractal);
  colorPickerCuadro.changed(drawFractal)
  // Evento para cambiar el colorPicker
  colorPicker.input(changeBackgroundColor);
  drawFractal();
}

function generateVertex(){
  let vertices = [];
  let theta = PI/numgens
  for(let i=0; i<numgens;i++){
    p = createVector(length*cos(2*PI*i/numgens+theta),length*sin(2*PI*i/numgens+theta));
    append(vertices, p);
  }
  return vertices;
}
//level no se usa jaja
function drawPolygon(p,_level){
  fill(colorPickerCuadro.value());
  beginShape();
  for(let i=0;i<p.length;i++){
    vertex(p[i].x,p[i].y);
  }
  endShape(CLOSE);
}
//Pero aqui si
function drawPolyPhoto(p, level){
  /*let maskPoly = createGraphics(length*(proportion**(level)),length*(proportion**(level)));
  maskPoly.beginShape();
  for(let i=0;i<p.length;i++){
    maskPoly.curveVertex(p[i].x,p[i].y);
  }
  maskPoly.endShape(CLOSE);
  uploadedImage.mask(maskPoly)*/
  image(uploadedImage, p[2].x, p[2].y, sqrt(2)*length*proportion**(level), sqrt(2)*length*proportion**(level));
}

function draw(){
}

function drawFractal() {
  //Trasladamos
  clear();
  translate(width / 2, height / 2);
  //Escuchamos los valores
  maxlevel = iterationsSlider.value();
  proportion = proportionSlider.value();
  length = lengthSlider.value();
  numgens = generatorSlider.value();

  //Creamos las transformaciones que generaran el fractal
  let transformaciones =[];
  for(let i = 0; i<numgens;i++){
    append(transformaciones, funciones(createVector
    (length*cos(2*PI*(i)/numgens+PI/numgens),
    length*sin(2*PI*(i)/numgens+PI/numgens))));
  }

  //Generamos los vertices y empezamos a dibujar.
  vertices = generateVertex();
  let dibujar;
  if (uploadedImage){
    dibujar = drawPolyPhoto;
  }else{
    dibujar = drawPolygon;
  }
  drawOrbit(transformaciones,vertices,dibujar);
}

//Crea las funciones generadoras
//Es una funcion que desplaza hacia direccion y escala por proporcion
function funciones(direccion) {
  return function (p) {
    return p5.Vector.add(
      p5.Vector.mult(
        p5.Vector.add(p, direccion), proportion), direccion);
  }
}

//Crea una lista de las direcciones posibles para cada direccion
function createIndexesNotInverse() {
  let inotinverse = [];
  let kinv;
  for (let k=1; k<=numgens;k++){
    kinv = ((k + numgens/2 - 1) % numgens);
    
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


function drawOrbit(transformaciones, p,dibujo){
  indexesNotInverse = createIndexesNotInverse();

  function traverseForward(p, index, level){
    dibujo(p, level);
    //Si ya acabamos o el diametro es muy pequeño salimos
    difference = p5.Vector.sub(p[0],p[numgens/2]);
    if (level >= maxlevel ||mag(difference.x,difference.y) < length/20){
      return;
    }
    let indices = indexesNotInverse[index];
    //Recorremos las posibles direcciones
    for (let i=0; i<numgens-1;i++){
      let f_p =[];
      for(let j=0;j< p.length;j++){
        append( f_p,transformaciones[indices[i]](p[j]) );
      }
      traverseForward(f_p, indices[i], level+1);
    }
  }
  //Dibujamos 
  dibujo(p, 0);
  for(let i = 0;i<numgens;i++){
    //Vamos a aplicar cada transformacion al poligono
    let f_p =[];
    for(let j=0;j< p.length;j++){
      append( f_p,transformaciones[i](p[j]));
    }
    //Y nos vamos
    traverseForward(f_p,i,1);
  }
}


function preload(){
  // logo_im = loadImage("imgs/im.png");
  // logo_unam = loadImage("imgs/unam.png");
}

function windowResized() {
  // Actualiza el tamaño del lienzo cuando se cambia el tamaño de la ventana
  divWidth = fractalDiv.size().width;
  resizeCanvas(divWidth, windowHeight/2);
}
//  Cambiar color background
function changeBackgroundColor() {
  // Obtener el color seleccionado por el color picker
  let selectedColor = colorPicker.color();
  // Aplicar el color como fondo del contenedor fractalDiv
  fractalDiv.style("background-color", selectedColor.toString());
}


function uploadImage() {
  const fileInput = document.getElementById('imageUpload');
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      uploadedImage = loadImage(event.target.result, function(img) {
        console.log("Ya se subió");
        drawFractal();
        //para que se actualice el fractal justo después de subir la foto
      });
    };
    reader.readAsDataURL(file);
  } else {
    console.error("No hay foto");
  }
}
