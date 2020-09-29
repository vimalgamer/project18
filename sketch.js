var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage,skateboard,skateboard_image;

var sun,sun_image;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound;

function preload(){
  trex_running = loadImage("trexgreen.png");
  trex_collided = loadAnimation("trexgreencollided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud1.png");
  
  obstacle1 = loadImage("cactus1.png");
  obstacle2 = loadImage("cactus2.png");
  obstacle3 = loadImage("cactus3.png");
  obstacle4 = loadImage("cactus4.png");
  obstacle5 = loadImage("cactus5.png");
  obstacle6 = loadImage("cactus6.png");
  
  skateboard_image = loadImage("skateboard.png");
  sun_image = loadImage("sun1.png");
  
  restartImg = loadImage("restart1.jpg")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  var message = "This is a message";
  console.log(message);
  
  
  sun = createSprite(width-50,100,20,20);
  sun.addImage(sun_image);
  
  sun.scale = 0.3;
  
  trex = createSprite(100,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.5;
  
  skateboard = createSprite(trex.x,height-50,20,20);
  skateboard.addImage(skateboard_image);
  skateboard.scale = 0.3;
  
  ground = createSprite(200,height-60,400,20);
  fill("brown");
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  restart.x = width/2;
  
  restart.scale = 0.6;
  
 
  gameOver.scale = 0.3;
  restart.scale = 0.3;
  
  invisibleGround = createSprite(200,height-50,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,25,270,100);
  trex.debug = true;
  
  score = 0;
}

function draw() {
  
  background(3, 182, 252);
  //displaying score
  text("Score: "+ score,100,100);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    skateboard.visible = true;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if((touches.length > 0 || keyDown("space")&& trex.y >= height-140)) {
        trex.velocityY = -15;
        jumpSound.play();
        touches = [];
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.6;
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     skateboard.visible = false;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0;
      score = 0;
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);  
     
     if(mousePressedOver(restart)) {
      reset();
    }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  


  drawSprites();
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running", trex_running);
  
  
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   obstacle = createSprite(width+40,height-80,10,40);
   obstacle.velocityX = -(10 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    
   
    obstacle.setCollider("rectangle",0,0,198,180);
    obstacle.debug = true;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
   
    obstacle.depth = trex.depth;
    trex.depth = trex.depth + 1;
   
    obstacle.lifetime = 390;
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+50,height-150,40,10);
    cloud.addImage(cloudImage);
    cloud.scale = 1;
    cloud.velocityX = -3;
    cloud.y = Math.round(random(50,700));
    
     //assign lifetime to the variable
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

