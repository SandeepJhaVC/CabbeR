//defining variables
var driver, car, bgimg, bg, ride1img, ride2img, ride3img, right, left, engine, rideGroup, carGroup, obs1, obs2, obs3, obs4, ride3, circle, rideGroup2;
var back, game, hit, achieve, achieve2, dropimg, dropGroup, drop, drop2, ride1, ride2, ride3, ride4, ride, heart, life, leftBT, rightBT, fwdBT, bwdBT;
var rides = 0;
var completed = 0;
var death = 0;

function preload() {
  //loading images
  //track
  bgimg = loadImage("Images/Road.png");
  //car
  car = loadImage("Images/car/car1.png");
  right = loadImage("Images/car/carRight.png");
  left = loadImage("Images/car/carLeft.png");
  //rides
  ride1img = loadImage("Images/Rides/ride1.png");
  ride2img = loadImage("Images/Rides/ride2.png");
  ride3img = loadImage("Images/Rides/ride3.png");
  //other cars
  obs1 = loadImage("Images/DownObs/carDon1.png");
  obs2 = loadImage("Images/DownObs/carDon2.png");
  obs3 = loadImage("Images/UpObs/carUp1.png");
  obs4 = loadImage("Images/UpObs/carUp2.png");
  //ride circle
  circle = loadImage("Images/Rides/rideCircle.png");
  //dropPoint
  dropimg = loadImage("Images/Rides/drop.png");
  heart = loadImage("Images/Rides/life.png");
  //car sounds
  engine = loadSound("Sounds/Engine.mp3");
  back = loadSound("Sounds/back.mp3");
  //interactive sounds
  hit = loadSound("Sounds/Over.mp3");
  achieve = loadSound("Sounds/achieve.mp3");
  achieve2 = loadSound("Sounds/achieve2.mp3");
}

function setup() {
  //framing canvas according to the window
  createCanvas(windowWidth, windowHeight);
  //track
  bg = createSprite(width / 2, height / 4);
  bg.addImage(bgimg);
  bg.scale = height / 3500;
  bg.velocityY += 3;
  //pc
  driver = createSprite(width / 2, height / 1.2);
  driver.addImage(car);
  driver.scale = width / 1500;
  //hearts
  life1 = createSprite(width / 50, height / 6.5);
  life1.addImage(heart);
  life1.scale = width / 5000;

  life2 = createSprite(width / 17, height / 6.5);
  life2.addImage(heart);
  life2.scale = width / 5000;

  life3 = createSprite(width / 10, height / 6.5);
  life3.addImage(heart);
  life3.scale = width / 5000;
  //buttons
  //Right side buttons
  rightBT = createButton("Right");
  rightBT.size(80, 50);
  rightBT.position(windowWidth / 1.28, windowHeight / 1.08);

  leftBT = createButton("Left");
  leftBT.size(80, 50);
  leftBT.position(windowWidth / 1.28, windowHeight / 1.18);
  
  //Left side buttons
  fwdBT = createButton("Forward");
  fwdBT.size(80, 50);
  fwdBT.position(windowWidth / 1000, windowHeight / 1.08);
  

  bwdBT = createButton("Backward");
  bwdBT.size(80, 50)
  bwdBT.position(windowWidth / 1000, windowHeight / 1.18);
  
  //groups
  rideGroup = new Group();
  carGroup = new Group();
  rideGroup2 = new Group();
  dropGroup = new Group();
}

function draw() {
  background(0);
  //making track to run endlessly
  if (bg.y > height / 2) {
    bg.y = height / 4;
  }
  //giving a gameState conditions
  //Play state
  if (death < 3) {

    //giving functions to the buttons for movement
    rightBT.mousePressed(Right);
    leftBT.mousePressed(Left);
    fwdBT.mousePressed(Forw);
    bwdBT.mousePressed(Back);
    //giving stop function to the buttons
    rightBT.mouseReleased(RStop);
    leftBT.mouseReleased(LStop);
    fwdBT.mouseReleased(FStop);
    bwdBT.mouseReleased(BStop);

      //giving condition for picking a ride
      for(var i = 0; i < rideGroup2.length; i++) {
      if (rideGroup2[i].isTouching(driver)) {
        if (rides < 4) {
          rideGroup2[i].destroy();
          rides++;
          achieve2.play();
        }
      }
    }
    //giving condition for not to pick others
    for (var i = 0; i < rideGroup.length; i++) {
      if (rideGroup[i].isTouching(driver)) {
        rideGroup[i].destroy();
        hit.play();
        death++;
      }
    }
    //giving condition for droping a ride
    for (var i = 0; i < dropGroup.length; i++) {
      if (dropGroup[i].isTouching(driver) && rides > 0) {
        dropGroup[i].destroy();
        achieve.play();
        rides--;
        completed++;
      }
    }


    //function for not to touch other car
    driver.collide(carGroup, crash);
    //gicing condition for hearts
    if (death === 1) {
      life3.destroy();
    } else if (death === 2) {
      life2.destroy();
    }
    //calling functions
    spawnRide();
    spawnCar();
    dropPoint();
  }//End state
  else if (death === 3) {
    bg.velocityY = 0;
    driver.velocityY = 0;
    driver.velocityX = 0;
    carGroup.destroyEach();
    rideGroup.destroyEach();
    rideGroup2.destroyEach();
    dropGroup.destroyEach();
    engine.stop();
    hit.stop();
    back.stop();
    life1.destroy();
  }

  drawSprites();

  // giving text for game over
  textSize(width / 20);
  if (death === 3) {
    fill("red");
    text("Game Over", width / 2.5, height / 2);
  }
  //giving condition and text for completing the game
  if (completed === 5) {
    fill("lightGreen");
    text("congratulations you won", width / 4.3, height / 2);
    bg.velocityY = 0;
    driver.velocityY = 0;
    driver.velocityX = 0;
    carGroup.destroyEach();
    rideGroup.destroyEach();
    rideGroup2.destroyEach();
    dropGroup.destroyEach();
    engine.stop();
    hit.stop();
    back.stop();
    console.log(completed);
  }
  //giving text for rides 
  push();
  textSize(width / 45);
  fill("orange");
  text("current rides: " + rides, width / 100, height / 30);
  text("completed rides: " + completed, width / 100, height / 20);
  pop();
}
//movement functions for buttons 
function Right() {
  driver.velocityX += 3;
  engine.play();
}
function Left() {
  driver.velocityX -= 3;
  engine.play();
}
function Back() {
  driver.velocityY += 3;
  engine.play();
}
function Forw() {
  driver.velocityY -= 3;
  engine.play();
}
//stop funtion for buttons
function RStop(){
  driver.velocityX =0;
  engine.stop();
}
function FStop(){
  driver.velocityY =0;
  engine.stop();
}
function BStop(){
  driver.velocityY =0;
  engine.stop();
}
function LStop(){
  driver.velocityX =0;
  engine.stop();
}

//function for driver colliding with other car
function crash(driver, obs) {
  hit.play();
  death++;
}

//function to spawn rides
function spawnRide() {
  if (frameCount % 200 === 0) {
    var num = Math.round(random(1, 2));
    if (num === 1) {
      ride3 = createSprite(width / 6, height / 1000);
      ride3.velocityY += 3;
      ride3.addImage(circle);
      ride3.scale = width / 2000;
      ride3.lifetime = 400;
      rideGroup2.add(ride3);
    } else if (num === 2) {
      var ride = createSprite(width / 6, height / 1000);
      ride.velocityY += 3;

      var rand = Math.round(random(1, 3));
      switch (rand) {
        case 1: ride.addImage(ride1img);
          break;
        case 2: ride.addImage(ride2img);
          break;
        case 3: ride.addImage(ride3img);
        default: break;
      }

      ride.scale = width / 2000;
      ride.lifetime = 400;
      rideGroup.add(ride);
    }
  }

  if (frameCount % 300 === 0) {
    var num = Math.round(random(1, 2));
    if (num === 1) {
      ride4 = createSprite(width / 1.2, height / 1000);
      ride4.velocityY += 3;
      ride4.addImage(circle);
      ride4.scale = width / 2000;
      ride4.lifetime = 400
      rideGroup2.add(ride4);
    } else if (num === 2) {
      var ride2 = createSprite(width / 1.2, height / 1000);

      var rand = Math.round(random(1, 3));
      switch (rand) {
        case 1: ride2.addImage(ride1img);
          break;
        case 2: ride2.addImage(ride2img);
          break;
        case 3: ride2.addImage(ride3img);
        default: break;
      }

      ride2.velocityY += 3;
      ride2.scale = width / 2000;
      ride2.lifetime = 400;
      rideGroup.add(ride2);
    }
  }

}

//function to spawn cars
function spawnCar() {
  if (frameCount % 700 === 0) {
    var obs = createSprite(width / 3, height / 1000);

    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1: obs.addImage(obs1);
        break;
      case 2: obs.addImage(obs2);
        break;
      default: break;
    }

    obs.scale = width / 1200;
    obs.velocityY += 3;
    obs.lifetime = 400;
    carGroup.add(obs);
  }
  if (frameCount % 800 === 0) {
    var obss = createSprite(width / 1.5, height / 0.9);

    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1: obss.addImage(obs3);
        break;
      case 2: obss.addImage(obs4);
        break;
      default: break;
    }

    obss.scale = width / 1200;
    obss.velocityY -= 3;
    obss.lifetime = 400;
    carGroup.add(obss);
  }
}

//function to spawn dropPoint
function dropPoint() {
  if (frameCount % 500 === 0) {
    drop = createSprite(width / 4, height / 1000);
    drop.velocityY += 2.8;
    drop.addImage(dropimg);
    drop.scale = width / 2500;
    driver.depth += drop.depth;
    drop.lifetime = 400;
    dropGroup.add(drop);
  }
  if (frameCount % 700 === 0) {
    drop2 = createSprite(width / 1.35, height / 1000);
    drop2.velocityY += 3;
    drop2.addImage(dropimg);
    drop2.scale = width / 2500;
    driver.depth += drop2.depth;
    drop2.lifetime = 400;
    dropGroup.add(drop2);
  }
}