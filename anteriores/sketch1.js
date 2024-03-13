var angle;
var axiom = "F--F--F";
var sentence = axiom;
var len = 100;
var in_axm;
var in_ang;
var axioma;


var rules = [];
rules[0] = {
  a: "F",
  b: "F+F--F+F"
}

function generate() {
  len *= 0.5;
  var nextSentence = "";
  for (var i = 0; i < sentence.length; i++) {
    var current = sentence.charAt(i);
    var found = false;
    for (var j = 0; j < rules.length; j++) {
      if (current == rules[j].a) {
        found = true;
        nextSentence += rules[j].b;
        break;
      }
    }
    if (!found) {
      nextSentence += current;
    }
  }
  sentence = nextSentence;
  createP(sentence);
  turtle();
}

function turtle() {
  background(51);
  resetMatrix();
  translate(width / 2, 2*height/3);
  stroke(255, 100);
  for (var i = 0; i < sentence.length; i++) {
    var current = sentence.charAt(i);

    if (current == "F") {
      line(0, 0, 0, -len);
      translate(0, -len);
    } else if (current == "+") {
      rotate(angle);
    } else if (current == "-") {
      rotate(-angle)
    } else if (current == "[") {
      push();
    } else if (current == "]") {
      pop();
    }
  }
}

function setup() {
  createCanvas(600, 600);
  angle = radians(60);
  background(101);
  createP(axiom);

  in_axm = createInput();
  var axioma = in_axm.value();
  in_axm.position(95,15);

  in_ang = createInput();
  var angulo = in_ang.value();
  in_ang.position(95,35);

  var button = createButton("generate");
  button.mousePressed(generate);

  button1 = createButton('submit');
  button1.position(185, 15);
 // button1.mousePressed(interact);

  button2 = createButton('submit');
  button2.position(185, 35);
 // button2.mousePressed(interact);

  in_axioma = createElement('h4', 'Axioma');
  in_axioma.position(20, 0);
  in_angle = createElement('h4', 'Ángulo');
  in_angle.position(20, 20);

  turtle();

}

function interact() {
   //rules[0][b] = in_axm.value();
  // var angle = in_ang.value();
  //
  //greeting.html('hello ' + name + '!');
  //input.value('');

}
