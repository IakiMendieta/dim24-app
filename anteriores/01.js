let canvasLoaded

// using feedback
let axiom = "F--F--F";
let tuples = [
  ["Copo de Koch", "F--F--F", {"F":"F+F--F+F"}, 60],
  ["Penta Koch", "F--F--F--F", {"F":"F+F--F+F"}, 72],
  ["Curva de Hilbert", "L", {"L":"+RF-LFL-FR+", "R":"-LF+RFR+FL-"}, 90],
  ["Curva de Gosper", "FX", {"X":"X+YF++YF-FX--FXFX-YF+", "Y": "-FX+YFYF++YF+FX--FX-Y"}, 60],
  ["Curva del Dragón", "FX+FX+FX", {"X":"X+YF+", "Y":"-FX-Y"}, 90],
  ["Romero", "F", {"F":"F[+F]F[-F]F"}, 28],
  ["Ramitas", "F", {"F":"F[-F]F[+F]F"}, 25],
  ["Arbusto Simétrico", "F", {"F":"F[+F[+F][-F]F][-F[+F][-F]F]F[+F][-F]F"}, 23],
  ["Curva de Levy", "F", {"F":"+F--F+"}, 45],
  ["Isla de Koch", "F-F-F-F", {"F": "F-F+F+FF-F-F+F"}, 90]
];
let i
let generation
let lines = []
let boundary

let width
let height
let proportion
let scaleFactor
let button
let xOffset
let yOffset
let on
let newAngle
let newRules = {
  "F": "F+F--F+F"
}

let iter=0

const s = ( sketch ) => {

  let x = 100;
  let y = 100;
  proportion = .8;

  sketch.setup = () => {
    sketch.createCanvas(window.innerWidth, window.innerHeight);

    loadHydra()

    sketch.colorMode(p8.HSB,1,1,1)


    generation = axiom
    processGeneration(generation)


    setInterval(()=>{


      iter++

      iter%=4


      if( iter == 0 ) {


        generation = axiom
        generateNext()
        return

      }





    },30000)


    // iniciar 1er sketch hydra:
    escenas.escena1()

  }

  sketch.draw = () => {

    p8.background(0,0,1/2)



    for ( let [index, line] of lines.entries() ) {
      let p1, p2
      let p3, p4
      let p5, p6
      p1 = line[0]
      p2 = line[1]

      p3 = lines[ Math.floor(index + lines.length/2) % lines.length ][0]
      p4 = lines[ Math.floor(index + lines.length/2) % lines.length ][1]

      p5 = lines[ Math.floor(index + lines.length+2) % lines.length ][0]
      p6 = lines[ Math.floor(index + lines.length+2) % lines.length ][1]

      // p8.line(xOffset + p1[0] * scaleFactor, yOffset + p3[1] * scaleFactor, xOffset + p3[0] * scaleFactor, yOffset + p1[1] * scaleFactor)
      // p8.line(xOffset + p4[0] * scaleFactor, yOffset + p2[1] * scaleFactor, xOffset + p2[0] * scaleFactor, yOffset + p4[1] * scaleFactor)
      p8.stroke(0,0,0.3)

      p8.line(xOffset + p4[0] * scaleFactor, yOffset + p5[1] * scaleFactor, xOffset + p5[0] * scaleFactor, yOffset + p4[1] * scaleFactor)
      p8.line(xOffset + p6[0] * scaleFactor, yOffset + p2[1] * scaleFactor, xOffset + p2[0] * scaleFactor, yOffset + p6[1] * scaleFactor)

      p8.stroke(0,0,1)
      p8.strokeWeight(2)
      p8.line(xOffset + p1[0] * scaleFactor, yOffset + p1[1] * scaleFactor, xOffset + p2[0] * scaleFactor, yOffset + p2[1] * scaleFactor)

    }

    if (i < lines.length && on) {
      let p1, p2
      let line_ = lines[i]
      p1 = line_[0]
      p2 = line_[1]

      p8.stroke(0,1,1)
      p8.strokeWeight(10)
      p8.line(xOffset + p1[0] * scaleFactor, yOffset + p1[1] * scaleFactor, xOffset + p2[0] * scaleFactor, yOffset + p2[1] * scaleFactor)

      // i++
    }

    i = p8.frameCount % lines.length


    p8.textSize(50)
    sketch.text((p8.frameRate().toFixed(2)), 10, 60)

    p8.circle( p8.mouseX, p8.mouseY, 100 )

  }



  sketch.keyPressed = () => {

    switch( p8.key ) {

      case '1':
      escenas.escena1()
      break

      case '2':
      escenas.escena2()
      break

      case '3':
      escenas.escena3()
      break

      case '4':
      escenas.escena4()
      break

      case '5':
      escenas.escena5()
      break

      case '6':
      escenas.escena6()
      break

      case 'z':
        axiom = tuples[0][1];
        newRules = tuples[0][2];
        newAngle = p8.int(tuples[0][3]);
      break

      case 'x':
        axiom = tuples[1][1];
        newRules = tuples[1][2];
        newAngle = p8.int(tuples[1][3]);
      break

      case 'c':
        axiom = tuples[2][1];
        newRules = tuples[2][2];
        newAngle = p8.int(tuples[2][3]);
      break

      case 'v':
        axiom = tuples[3][1];
        newRules = tuples[3][2];
        newAngle = p8.int(tuples[3][3]);
      break

      case 'b':
        axiom = tuples[4][1];
        newRules = tuples[4][2];
        newAngle = p8.int(tuples[4][3]);
      break

      case 'n':
        axiom = tuples[-2][1];
        newRules = tuples[-2][2];
        newAngle = p8.int(tuples[-2][3]);
      break

      case 'm':
        axiom = tuples[-1][1];
        newRules = tuples[-1][2];
        newAngle = p8.int(tuples[-1][3]);
      break

      case 'j':
        axiom = tuples[6][1];
        newRules = tuples[6][2];
        newAngle = p8.int(tuples[6][3]);
      break

      case 'k':
        axiom = tuples[7][1];
        newRules = tuples[7][2];
        newAngle = p8.int(tuples[7][3]);
      break

      case 'l':
        axiom = tuples[5][1];
        newRules = tuples[5][2];
        newAngle = p8.int(tuples[5][3]);
      break

      case 'g':
        generateNext()
        iter++
        iter %= 4
        if( iter == 0 ) {
          generation = axiom
        }

    }

  }

}

let p8 = new p5(s);


// The midi notes of a scale
// let notes = [ 60, 62, 64, 65, 67, 69, 71];


function generateNext() {
  // p8.getAudioContext().resume();
  generation = iteration(generation || "", newRules)
  processGeneration(generation, newAngle)
  i = 0
  on = true
}

function restart() {
  i = 0
  p8.background(101)
}

function pause() {
  on = false
}

function play() {
  on = true
}

// function s
//
// function draw() {
//   /* This function is native to p8.js, it will be called on every frame, what we are doing here is to paint a
//    * step of the fractal per frame which makes the animation flow.
//    */
//
// }


//
//
//
