//VARIABELEN

var pingPongX = null;
var pingPongY = null;
var pingPongVx = 50;
var pingPongVy = 20;
var pingPongBal = null;
var levens = 3;
var aantalLagen = 5;
var breedte = 70;
var hoogte;
var plekkenRaket = [500, 600, 700, 800];
var achtergrondKleur;

//FUNCTIES ( door ons )

//functie voor het raken van de rand met de cursor
function raaktRand() {
   if ( mouseX <= 50 || mouseX >= 850 || mouseY <= 50 || mouseY >= 550 ) {
    achtergrondKleur = 'pink';
    }
    else {
    achtergrondKleur = 'violet';
    }
}

//functie voor interactie raketten en eve ( met een hitbox die een halve celgrootte)
function eveRaaktRaketten() {
    //raket1
  if ( eve.x <= raket1.x + 0.5*raster.celGrootte && eve.x >= raket1.x - 0.5*raster.celGrootte && eve.y <= raket1.y + 0.5*raster.celGrootte && eve.y >= raket1.y - 0.5*raster.celGrootte ) {
    levens -= 1;
  }
    //raket2
    if ( eve.x <= raket2.x + 0.5*raster.celGrootte && eve.x >= raket2.x - 0.5*raster.celGrootte && eve.y <= raket2.y + 0.5*raster.celGrootte && eve.y >= raket2.y - 0.5*raster.celGrootte ) {
  levens -= 1;
  }
    //raket3
    if ( eve.x <= raket3.x + 0.5*raster.celGrootte && eve.x >= raket3.x - 0.5*raster.celGrootte && eve.y <= raket3.y + 0.5*raster.celGrootte && eve.y >= raket3.y - 0.5*raster.celGrootte ) {
  levens -= 1;
  }
}

//functie voor de pingpongbal
function pingPong() {
    //tekenen van de pingpongbal
    pingPongX += pingPongVx;
    pingPongY += pingPongVy;
    push();
    fill('violet') //pingpongbal is lichtpaars :) 
    pingPongBal = ellipse(pingPongX,pingPongY,50)
    pop();
    //zorgen dat de pingpongbal tegen de randen stuitert
    if (pingPongX == width || pingPongX == 0) {
      pingPongVx *= -1;
    }
    if (pingPongY == height || pingPongY == 0) {
      pingPongVy *= -1;
    }
    //interactie eve en de pingpongbal, met een hitbox die een halve celgrootte om het middenpunt van de cirkel heengaat
    if ( eve.x <= pingPongX + 0.5*raster.celGrootte && eve.x >= pingPongX - 0.5*raster.celGrootte && eve.y <= pingPongY + 0.5*raster.celGrootte && eve.y >= pingPongY- 0.5*raster.celGrootte) {
      levens += 1;
    }
}

//functie voor de piramide, gebaseerd op / aangepaste versie van opdr36 uit h1
function tekenPiramide(n) {
  push();
  fill('purple'); //onze piramide is paars :) 
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

//checken of je nog leeft met parameter 'levens'
function dood(levens) {
  if (levens < 1) {
    return true;
  }
  else {
    return false;
  }
}

//CLASSES

//class voor het raster
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
        if ( rij == 0 || rij == 11 || kolom == 0 || kolom == 17) {
          fill('lightblue'); //randkleur
          rect(kolom*this.celGrootte,rij*this.celGrootte,this.celGrootte,this.celGrootte);
        }
        else{ 
          fill(achtergrondKleur) //kleur van de rest van het veld
          rect(kolom*this.celGrootte,rij*this.celGrootte,this.celGrootte,this.celGrootte); 
        }
      }
    }
    pop();
  }
  
}

//class voor jos ( aka het speelbare karakter )
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

//class voor de vijand
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

//class voor de raket
class Raket {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.sprite = null;
    this.stapGrootte = null;
    this.snelheid;
  }
  
  beweeg() {
    this.snelheid -= 9.81/30; //valversnelling !
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

//FUNCTIES ( die er al waren )

function preload() {
  //brug = loadImage("images/backgrounds/dame_op_brug_1800.jpg"); 
}

function setup() {
  canvas = createCanvas(900,600);
  canvas.parent();
  frameRate(10);
  textFont("Verdana");

  //dit is deel van de piramide
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
  raaktRand();
  raster.teken();

  // priamide aanroepen
  push();
  tekenPiramide(aantalLagen);
  pop();
  
  //karakter, vijanden en raketten in beweging zetten
  eve.beweeg();
  alice.beweeg();
  bob.beweeg();
  cindy.beweeg();
  raket1.beweeg();
  raket2.beweeg();
  raket3.beweeg();

  //karakter, vijanden en raketten op beeld zetten
  eve.toon();
  alice.toon();
  bob.toon();
  cindy.toon();
  raket1.toon(); 
  raket2.toon();
  raket3.toon();

  //pingpongbal aanroepen
  pingPong();
  
  //interactie eve en de vijanden  
  if (eve.wordtGeraakt(alice) || eve.wordtGeraakt(bob) || eve.wordtGeraakt(cindy)) {
    levens -= 1;
  }

  //eve en de raketten
  eveRaaktRaketten();

  //healthbar  
  textSize(20);
  text('levens: ' + levens, 10, 20);

  //einde spel
      //verliezen
  if (dood(levens)) {
    background('red');
    fill('black');
    textSize(90);
    text("Je bent dood :(",30,300);
    noLoop();
  }
      //winnen
  if (eve.gehaald) {
    background('green');
    fill('white');
    textSize(90);
    text("Je hebt gewonnen!",30,300);
    noLoop();
  }

}

