var aantalLagen = 5;
var breedte = 90;
var hoogte;

function setup() {
  hoogte = breedte/2;

}

function draw() {
  
  tekenPiramide(aantalLagen);
}

function tekenPiramide(n) {
  if (n>0) {
    for (var nr = 0;nr < n;nr++) {
      rect(nr*breedte,0,breedte,hoogte);
    }
    translate(breedte / 2,-hoogte);
    n--;
    tekenPiramide(n);
  }
}