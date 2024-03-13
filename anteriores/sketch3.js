let length, proportion, maxlevel, colorPicker, uploadedImage;

function setup() {
  createCanvas(800, 800);

  // Crear sliders y asignar valores iniciales
  let p = createP('iteraciones');
  //p.position(20, 5);
  iterationsSlider = createSlider(1, 6, 3, 1);
//  iterationsSlider.position(20, 40);

  let q = createP('proporción');
//  q.position(20, 45);
  proportionSlider = createSlider(0.2, 0.8, 0.4, 0.01);
//  proportionSlider.position(20, 80);

  let pq = createP('longitud');
//  pq.position(20, 85);
  lengthSlider = createSlider(width/18, width/2, width/10, width/18);
//  lengthSlider.position(20, 120);
  let texto_color=createP("Color del fondo")
  colorPicker = createColorPicker("red");
  translate(width/2,height/2);
  drawFractal();
  iterationsSlider.changed(drawFractal);
  proportionSlider.changed(drawFractal);
  lengthSlider.changed(drawFractal);
  colorPicker.changed(drawFractal);
}

function drawFractal(){
  maxlevel = iterationsSlider.value();
  proportion = proportionSlider.value();
  length = lengthSlider.value();
  h = length/2;
  background(colorPicker.color());
  f_1 = funciones(createVector(h,-h));
  g_1 = funciones(createVector(h,h));
  f_2 = funciones(createVector(-h,h));
  g_2 = funciones(createVector(-h,-h));
  transformaciones = [f_1,g_1,f_2,g_2];
  drawOrbit(transformaciones,createVector(-h,-h));
}

function funciones(direccion){
  return function(p){
    return p5.Vector.add(
      p5.Vector.mult(
        p5.Vector.add(p,direccion),proportion),direccion);
  }
}

function createIndexesNotInverse(){
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
  indexesNotInverse = createIndexesNotInverse();

  function traverseForward(p, index, level){
    if(uploadedImage){
      image(uploadedImage, p.x, p.y, length*(proportion**(level)), length*(proportion**(level)));

    } else {
    square(p.x,p.y,length*(proportion**(level)));
    }
    
    if (level >= maxlevel){
      return;
    }
    let indices = indexesNotInverse[index];
    for (let i=0; i<3;i++){
      traverseForward(transformaciones[indices[i]](p), indices[i], level+1);
    }
  }
  if(uploadedImage){
    image(uploadedImage, p.x, p.y, length, length);
  } else{
    square(p.x,p.y,length);
  }
  
  for(let i = 0;i<4;i++){
    traverseForward(transformaciones[i](p),i,1);
  }
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

