
const cos = Math.cos;
const sin = Math.sin;
const sqrt = Math.sqrt;
const pi = 3.141592;
const alto_t = 800;
const ancho_t = 800;
var alto = 600;
var ancho = 600;


function preload() {
  foto = loadImage('dp.png');
  marco = loadImage('marco.png');
}


function fractaliza() {
    let fotos = [];
    fotos.push(foto);
    let iteraciones = 4;
    let foto_s = aplica_itera(fotos, iteraciones);
    // let f = new BytesIO();
    // let salida = Image.new("RGBA", [alto_t, alto_t]);
    // let marco;
    // salida = Image.new("RGBA", [alto_t, alto_t]);
    // marco = marco.resize([alto_t, alto_t]).convert("RGBA");
    image(marco, 0, 0, alto_t, alto_t);
    
  }
 

function v_sum(u, v) {
    return u[0] + v[0], u[1] + v[1];
}

function v_res(u, v) {
    return [u[0] - v[0], u[1] - v[1]];
}

function pit_h(u, v) {
    return sqrt((u[0] - v[0]) ** 2 + (u[1] - v[1]) ** 2);
}

function itera(imgs, newImg, v, width, n, i) {
    if ([0, 1].includes(n)) {
        return;
    } else {
        width = parseInt(width / 2);
        // let img = imgs[parseInt((i + 1) / 2) % imgs.length];
        // let act = img.resize(width, width);
        let r1 = sqrt(2 * (3 * width) ** 2);
        let vi = v_res(v, [r1 * cos(i * pi / 4), r1 * sin(i * pi / 4)]);
        let r2 = sqrt(2 * (3 * width / 2) ** 2);
        let L = Array.from({length: 4}, (_, jj) => pit_h(vi, [v[0] + r2 * cos(pi * (2 * jj - 1) / 4), v[1] + r2 * sin(pi * (2 * jj - 1) / 4)]));
        let minL = L.indexOf(Math.min(...L));
        for (let l = 0; l < 4; l++) {
            let j = 2 * l - 1;
            if (l === minL) {
                continue;
            } else {
                let v_ent = [v[0] + r2 * cos(pi * j / 4), v[1] + r2 * sin(pi * j / 4)];
                let v1 = [v[0] + r2 * cos(pi * j / 4), v[1] + r2 * sin(pi * j / 4)];
                itera(imgs, newImg, v1, width, n - 1, j);
                img = imgs[(parseInt((i + 1) / 2) + l) % imgs.length];
                // act = img.resize(width, width);
                // image(img, v_sum(v_ent, [-width / 2, -width / 2]), width, width);
            }
        }
        return newImg;
    }
}

function aplica_itera(imgs, its) {
    ancho = parseInt(ancho / 3);
    let imga = imgs[0];
    image(imga, width/2-ancho/2, height/2-ancho/2, ancho, ancho);
    ancho = parseInt(ancho /2);
    let pos = [[ancho, ancho], [ancho + ancho * 3, ancho], [ancho, ancho + ancho * 3], [ancho + ancho * 3, ancho + ancho * 3]];
    for (let word = 0; word < 4; word++) {
        let imga = imgs[word % imgs.length];
        image(imga, pos[word][0]+ancho, pos[word][1]+ancho, ancho, ancho);
    }
    let r = sqrt(2 * (3 * ancho / 2) ** 2);
    let cx = ancho / 2;
    let cy = ancho / 2;
    for (let k = 0; k < 4; k++) {
        let i = 2 * k - 1;
        let v = [cx + r * cos(i * pi / 4), cy + r * sin(i * pi / 4)];
        //itera(imgs, newImg, v, ancho, its, i);
    }
  }

function cuadrada(imagen) {
    let img = imagen;
    let x = img.width;
    let y = img.height;
    return image(img, 0,0, x, y);
}


function setup() {
  createCanvas(800, 800);
  background(101);

  var button = createButton("fractaliza");
  button.position(25, 15);
  button.mousePressed(fractaliza);

  var button1 = createButton('itera');
  button1.position(105, 15);
  button1.mousePressed(aplica_itera);


}


// function nuevoRegistro(request) {
//   if (request.method === 'POST') {
//       let nvo_registro = new NuevoRegistro(request.POST, request.FILES);
//       if (nvo_registro.is_valid()) {
//           nvo_registro = nvo_registro.save(commit = false);
//           console.log(Object.values(request.session));
//           nvo_registro.save();
//           let fotos = [];
//           let obj = Persona.objects.last();
//           let foto = obj.foto;
//           fotos.push(cuadrada(Image.open(foto)));
//           for (let adj of Persona._meta.get_fields()) {
//               if (adj.includes('adju')) {
//                   try {
//                       foto = obj[adj.attname];
//                       fotos.push(cuadrada(Image.open(foto)));
//                   } catch (error) {
//                       continue;
//                   }
//               }
//           }
//           let iteraciones = 5;
//           let foto_s = aplica_itera(fotos, obj, iteraciones);
//           let f = new BytesIO();
//           let salida = Image.new("RGBA", [2600, 2600]);
//           let marco;
//           try {
//               marco = Image.open('/home/dario/pag_lab/static/fractalizate/marco.png');
//           } catch (error) {
//               marco = Image.open('static/fractalizate/marco.png');
//           }
//           salida = Image.new("RGBA", [2600, 2600]);
//           marco = marco.resize([2600, 2600]).convert("RGBA");
//           salida.paste(marco, [0, 0]);
//           salida.paste(foto_s, [200, 200]);
//           try {
//               let blob = new BytesIO();
//               salida.save(blob, 'PNG');
//               nvo_registro.foto_fractalizada.delete(save = false);
//               nvo_registro.foto_fractalizada.save('Image.png', File(blob));
//               nvo_registro.save();
//           } finally {
//               f.close();
//           }
//           //foto_s.save(nvo_registro.foto_fractalizada.url+'.png')
//           return redirect('fractalizate:success', nvo_registro.pk);
//       }
//   } else {
//       nvo_registro = new NuevoRegistro(request.GET || null);
//   }
//   return render(request, 'fractalizate/hola.html', {'nvo_registro': nvo_registro});
// }

/////

// let tronco = loadImage('dp.png');

// function drawTree(image, x, y, angle, scale) {
//   image(image, x, y, image.width*scale, image.height*scale);

//   if (scale > umbral) {
//     let newScale = scale * factorEscalado;
//     let angle1 = angle + anguloGiro;
//     let angle2 = angle - anguloGiro;
    
//     let nuevaPosicionX1 = tronco.// calcular nueva posición x para rama 1
//     let nuevaPosicionY1 = // calcular nueva posición y para rama 1
//     let nuevaPosicionX2 = // calcular nueva posición x para rama 2
//     let nuevaPosicionY2 = // calcular nueva posición y para rama 2
    
//     drawTree(image, x + nuevaPosicionX1, y + nuevaPosicionY1, angle1, newScale);
//     drawTree(image, x + nuevaPosicionX2, y + nuevaPosicionY2, angle2, newScale);
//   }
// }

// function setup() {
//   createCanvas(800, 800);
//   image(tronco, 0, 0);
//   drawTree(tronco, posicionXtronco, posicionYtronco, anguloInicial, escalaInicial);
// }