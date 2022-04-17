var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombieImg; 
var zombieGroup;
var h1Img,h2Img,h3Img,h1,h2,h3;
var bullets = 70;
var score = 0
var life = 3
var loseSound,winSound,explosionSound;
var gameState = "FIGHT"

function preload(){
  
  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")
  zombieImg = loadImage("assets/zombie.png")
  bgImg = loadImage("assets/bg.jpeg")
  h1Img = loadImage("assets/heart_1.png")
  h2Img = loadImage("assets/heart_2.png")
  h3Img = loadImage("assets/heart_3.png")
  loseSound = loadSound("assets/lose.mp3")
  winSound = loadSound("assets/win.mp3")
  explosionSound = loadSound("assets/explosion.mp3")
}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
bg.addImage(bgImg)
bg.scale = 1.1


  

//creating the player sprite
player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
 player.addImage(shooterImg)
   player.scale = 0.3
   player.debug = true
   player.setCollider("rectangle",0,0,300,300)

h1 = createSprite(displayWidth-150, 40,20,20);
h1.visible = false;
h1.addImage("heart1",h1Img)
h1.scale = 0.3;

h2 = createSprite(displayWidth-100, 40,20,20);
h2.visible = false;
h2.addImage("heart2",h2Img)
h2.scale = 0.3;

h3 = createSprite(displayWidth-50, 40,20,20);
h3.addImage("heart3",h3Img)
h3.scale = 0.3;

bulletGroup = new Group()
zombieGroup = new Group()

}

function draw() {
  background(0); 

if(gameState === "FIGHT"){

if(life === 3){
  h3.visible = true;
  h1.visible = false;
  h2.visible = false;
}

if(life === 2){
  h2.visible = true;
  h1.visible = false;
  h3.visible = false;
}

if(life === 1){
  h1.visible = true;
  h2.visible = false;
  h3.visible = false;
}

if(life === 0){
  gameState = "LOST"
  loseSound.play()
}

if(score === 20){
  gameState = "WON"
  winSound.play()
}

    //moving the player up and down and making the game mobile compatible using touches
if(keyDown("UP_ARROW")||touches.length>0){
  player.y = player.y-30
}
if(keyDown("DOWN_ARROW")||touches.length>0){
 player.y = player.y+30
}

//release bullets and change the image of shooter to shooting position when space is pressed
if(keyWentDown("space")){
  bullet = createSprite(displayWidth-1150,player.y-30,20,10)
  bullet.velocityX = 20;
  bulletGroup.add(bullet);
  player.depth = bullet.depth
  player.depth = player.depth + 2
  bullets = bullets - 1 
  player.addImage(shooter_shooting)
  explosionSound.play()
}

//player goes back to original standing image once we stop pressing the space bar
else if(keyWentUp("space")){
  player.addImage(shooterImg)
}

if(zombieGroup.isTouching(player)){
  loseSound.play()
  for(var i = 0; i < zombieGroup.length;i++){
    if(zombieGroup[i].isTouching(player)){
      zombieGroup[i].destroy()
      life = life - 1
    }
  }
}

if(zombieGroup.isTouching(bulletGroup)){
  for(var i = 0; i < zombieGroup.length;i++){
    if(zombieGroup[i].isTouching(bulletGroup)){
      zombieGroup[i].destroy()
      bulletGroup.destroyEach()
      explosionSound.play()
      score = score + 1 
    }
  }
}

if(bullets == 0){
  gameState = "BULLET"
  loseSound.play()
}

enemy()
}

drawSprites();

  textSize(20)
  fill("RED")
  text("bullet = "+ bullets,displayWidth - 210,displayHeight/2 - 250)
  text("score = "+ score,displayWidth - 200,displayHeight/2 - 220)
  text("life = "+ life,displayWidth - 200,displayHeight/2 - 280)

  if(gameState === "BULLET"){
    textSize(50);
    fill("YELLOW")
    text("YOU RAN OUT OF BULLETS!!",470,410)
    zombieGroup.destroyEach()
    bulletGroup.destroyEach()
    player.destroy()

  }
  else if(gameState === "LOST"){
    textSize(100);
    fill("RED")
    text("YOU LOST!!",470,410)
    zombieGroup.destroyEach()
    bulletGroup.destroyEach()
    player.destroy()
  }
  else if(gameState === "WON"){
    textSize(100);
    fill("GREEN")
    text("YOU WON!!",470,410)
    zombieGroup.destroyEach()
    bulletGroup.destroyEach()
    player.destroy()
  }
}
function enemy(){
  if(frameCount%50===0){
    zombie = createSprite(random(1500,1800),random(100,500),40,40)
    zombie.addImage(zombieImg)
    zombie.scale = 0.15
    zombie.velocityX = -3
    zombie.lifetime = 400
    zombieGroup.add(zombie)
  }
}



