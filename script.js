var pingPongX = null;
var pingPongY = null;
var pingPongVx = 50;
var pingPongVy = 20;
var pingPongBal = null;
var levens = 3;
var aantalLagen = 5;
var breedte = 70;
var hoogte;
var plekkenRaket = [500, 600, 700, 800]

function pingPong() {
    pingPongX += pingPongVx;
    pingPongY += pingPongVy;
    push();
    fill('violet')
    pingPongBal = ellipse(pingPongX,pingPongY,50)
    pop();

    if (pingPongX == width || pingPongX == 0) {
      pingPongVx *= -1;
    }
    if (pingPongY == height || pingPongY == 0) {
      pingPongVy *= -1;
    }
  //eve en de pingpongbal
    if ( eve.x <= pingPongX + 0.5*raster.celGrootte && eve.x >= pingPongX - 0.5*raster.celGrootte && eve.y <= pingPongY + 0.5*raster.celGrootte && eve.y >= pingPongY- 0.5*raster.celGrootte) {
      levens += 1;
    }
}

function tekenPiramide(n) {
  push();
  fill('purple');
  if (n>0) {
    for (var nr = 0;nr < n;nr++) {
      rect(275+nr*breedte,200,breedte,hoogte);
    }
    translate(breedte / 2,hoogte);
    n--;
    tekenPiramide(n);
  }
  pop()
}

//checken of je nog leeft
function dood(levens) {
  if (levens < 1) {
    return true;
  }
  else {
    return false;
  }
}

class Raster {
  constructor(r,k) {
    this.aantalRijen = r;
    this.aantalKolommen = k;
    this.celGrootte = null;
  }

  berekenCelGrootte() {
    this.celGrootte = canvas.width / this.aantalKolommen;
  }

  teken() {
    push();
    noFill();
    stroke('grey');
    for (var rij = 0;rij < this.aantalRijen;rij++) {
      for (var kolom = 0;kolom < this.aantalKolommen;kolom++) {
        rect(kolom*this.celGrootte,rij*this.celGrootte,this.celGrootte,this.celGrootte);
      }
    }
    pop();
  }
}

class Jos {
  constructor() {
    this.x = 400;
    this.y = 300;
    this.animatie = [];
    this.frameNummer =  3;
    this.stapGrootte = null;
    this.gehaald = false;
  }
  
  beweeg() {
    if (keyIsDown(65)) {
      this.x -= this.stapGrootte;
      this.frameNummer = 2;
    }
    if (keyIsDown(68)) {
      this.x += this.stapGrootte;
      this.frameNummer = 1;
    }
    if (keyIsDown(87)) {
      this.y -= this.stapGrootte;
      this.frameNummer = 4;
    }
    if (keyIsDown(83)) {
      this.y += this.stapGrootte;
      this.frameNummer = 5;
    }

    this.x = constrain(this.x,0,canvas.width);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);

    if (this.x == canvas.width) {
      this.gehaald = true;
    }
  }

  wordtGeraakt(vijand) {
    if (this.x == vijand.x && this.y == vijand.y) {
      return true;
    }
    else {
      return false;
    }
  }

  toon() {
    image(this.animatie[this.frameNummer],this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}  

class Vijand {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
  }

  beweeg() {
    this.x += floor(random(-1,2))*this.stapGrootte;
    this.y += floor(random(-1,2))*this.stapGrootte;

    this.x = constrain(this.x,0,canvas.width - raster.celGrootte);
    this.y = constrain(this.y,0,canvas.height - raster.celGrootte);
  }

  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte,raster.celGrootte);
  }
}

class Raket {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
    this.snelheid;
  }
  
  beweeg() {
    this.snelheid -= 9.81/30;
    this.y -= this.snelheid;

    if (this.y <= 0) {
      this.snelheid *= -1;
    }

    if ( this.y >= 400 ){
      this.snelheid *= -1;
    }
    
  }

  toon() {
    image(this.sprite,this.x,this.y,raster.celGrootte,2*raster.celGrootte);
  }
}

function preload() {
  brug = loadImage("images/backgrounds/dame_op_brug_1800.jpg");
}

function setup() {
  canvas = createCanvas(900,600);
  canvas.parent();
  frameRate(10);
  textFont("Verdana");
  

//priamide
  hoogte = breedte/2;
//raster  
  raster = new Raster(12,18);
  raster.berekenCelGrootte();
//eve
  eve = new Jos();
  eve.stapGrootte = 1*raster.celGrootte;
  for (var b = 0;b < 6;b++) {
    frameEve = loadImage("images/sprites/Eve100px/Eve_" + b + ".png");
    eve.animatie.push(frameEve);
  }
//vijanden
  alice = new Vijand(700,200);
  alice.stapGrootte = 1*eve.stapGrootte;
  alice.sprite = loadImage("images/sprites/Alice100px/Alice.png");

  bob = new Vijand(600,400);
  bob.stapGrootte = 1*eve.stapGrootte;
  bob.sprite = loadImage("images/sprites/Bob100px/Bob.png");  

  cindy = new Vijand(700,200);
  cindy.stapGrootte = 1*eve.stapGrootte;
  cindy.sprite = loadImage("images/sprites/Alice100px/Alice.png");
//raketten
  raket1 = new Raket(random(plekkenRaket), 400);
  raket1.sprite = loadImage("images/PAARSERAKET.png");
  raket1.snelheid = 20;

  raket2 = new Raket(random(plekkenRaket), 400);
  raket2.sprite = loadImage("images/PAARSERAKET.png");
  raket2.snelheid = 30;

  raket3 = new Raket(random(plekkenRaket), 400);
  raket3.sprite = loadImage("images/PAARSERAKET.png");
  raket3.snelheid = 40;
}

function draw() {
  background(brug);
    // priamide
  push();
  tekenPiramide(aantalLagen);
  pop();
  
  raster.teken();
 
  eve.beweeg();
  alice.beweeg();
  bob.beweeg();
  cindy.beweeg();
  raket1.beweeg();
  raket2.beweeg();
  raket3.beweeg();

  raket1.toon(); 
  raket2.toon();
  raket3.toon();
  eve.toon();
  alice.toon();
  bob.toon();
  cindy.toon();

/*
//pingpongbal
  pingPongX += pingPongVx;
  pingPongY += pingPongVy;
  pingPongBal = ellipse(pingPongX,pingPongY,50)
  
  if (pingPongX == width || pingPongX == 0) {
    pingPongVx *= -1;
  }
  if (pingPongY == height || pingPongY == 0) {
    pingPongVy *= -1;
  }
//eve en de pingpongbal
  if ( eve.x <= pingPongX + 0.5*raster.celGrootte && eve.x >= pingPongX - 0.5*raster.celGrootte && eve.y <= pingPongY + 0.5*raster.celGrootte && eve.y >= pingPongY- 0.5*raster.celGrootte) {
    pingPongVx *= -1;
    levens += 1;
  }
*/


pingPong();
  
//eve en de vijanden  
  if (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob) || eve.wordtGeraakt(cindy)) {
    levens -= 1;
  }

//eve en de raketten
    if ( eve.x <= raket1.x + 0.5*raster.celGrootte && eve.x >= raket1.x - 0.5*raster.celGrootte && eve.y <= raket1.y + 0.5*raster.celGrootte && eve.y >= raket1.y - 0.5*raster.celGrootte ) {
      levens -= 1;
    }

  if ( eve.x <= raket2.x + 0.5*raster.celGrootte && eve.x >= raket2.x - 0.5*raster.celGrootte && eve.y <= raket2.y + 0.5*raster.celGrootte && eve.y >= raket2.y - 0.5*raster.celGrootte ) {
    levens -= 1;
  }

  if ( eve.x <= raket3.x + 0.5*raster.celGrootte && eve.x >= raket3.x - 0.5*raster.celGrootte && eve.y <= raket3.y + 0.5*raster.celGrootte && eve.y >= raket3.y - 0.5*raster.celGrootte ) {
    levens -= 1;
  }

//healthbar  
  textSize(20);
  text('levens: ' + levens, 10, 20);

//einde spel
  if (dood(levens)) {
    background('red');
    fill('black');
    textSize(90);
    text("Je bent dood :(",30,300);
    noLoop();
  }

  if (eve.gehaald) {
    background('green');
    fill('white');
    textSize(90);
    text("Je hebt gewonnen!",30,300);
    noLoop();
  }
 
 

}

