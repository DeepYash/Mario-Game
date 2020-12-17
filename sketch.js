var PLAY = 1,END = 0;
var GameState = PLAY;
var mario, marioAmin, mario_collide;
var ground, gdimage;
var obst, obstanim, iground;
var backgd, backgdimg;
var obstgroup, bricksgroup;
var bricks, bricksimg;
var score = 0;
var GameOver, gameoverimg;
var restart, restateimg;
var jumpsound, diesound, checkpointSound;

function preload() {

  marioAnim = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png");
  gdimage = loadImage("ground2.png");
  obstanim = loadAnimation("obstacle1.png", "obstacle2.png", "obstacle3.png", "obstacle4.png");
  backgdimg = loadImage("bg.png");
  bricksimg = loadImage("brick.png");
  mario_collide = loadImage("collided.png")
  gameoverimg = loadImage("gameOver.png");
  restartimg = loadImage("restart.png");
  jumpsound = loadSound("jump.mp3");
  diesound = loadSound("die.mp3");
  checkpointSound = loadSound("checkPoint.mp3");
}

function setup() {

  createCanvas(600, 300);

  backgd = createSprite(300, 150, 600, 300);
  backgd.addImage("b1", backgdimg);

  GameOver = createSprite(300, 140);
  GameOver.addImage(gameoverimg);
  GameOver.scale = 0.5;

  restart = createSprite(300, 180);
  restart.addImage(restartimg);
  restart.scale = 0.5;

  mario = createSprite(100, 20, 10, 10);
  mario.addAnimation("m1", marioAnim);
  mario.scale = 1.5;

  ground = createSprite(300, 280, 600, 10);
  ground.addImage("g1", gdimage);
  ground.velocityX = -5;

  iground = createSprite(300, 250, 600, 10);
  iground.visible = false;

  obstgroup = new Group();
  bricksgroup = new Group();

  var rand = Math.round(1, 100);
  mario.setCollider("rectangle", 0, 0, 10, 40);
}

function draw() {
  background("blue");

  if (GameState === PLAY) {
    GameOver.visible = false;
    restart.visible = false;
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    if (keyDown("space")) {
      mario.velocityY = -10;
      jumpsound.play();
    }
    mario.velocityY = mario.velocityY + 1;

    spawnBricks();
    spawnobstacle();

    if (mario.isTouching(bricksgroup)) {
      score = score + 1;
      for (i = 0; i < bricksgroup.length; i++) {
        if (bricksgroup[i].isTouching(mario)) {
          bricksgroup[i].destroy();
        }
      }
    }
    if (obstgroup.isTouching(mario)) {
      GameState = END;
      diesound.play();
    }
    if (score > 0 && score % 50 === 0) {
      checkpointSound.play();
    }
  } else
  if (GameState === END) {
    GameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;

    mario.addAnimation("m1", mario_collide);
    mario.velocityY = 0;

    obstgroup.setLifetimeEach(-1);
    bricksgroup.setLifetimeEach(-1);

    obstgroup.setVelocityXEach(0);
    bricksgroup.setVelocityXEach(0);

    if (mousePressedOver(restart)) {
      reset();
    }
  }
  mario.collide(iground);


  drawSprites();
  fill("black");
  textSize(20);
  text("Score=" + score, 500, 50);
}

function spawnBricks() {
  if (frameCount % 30 === 0) {
    bricks = createSprite(600, 150, 10, 10);
    bricks.addImage("b1", bricksimg);
    bricks.velocityX = -5;
    bricks.y = Math.round(random(80, 150))
    bricksgroup.add(bricks);
    bricks.lifetime = 300;
  }
}

function spawnobstacle() {
  if (frameCount % 70 === 0) {
    obst = createSprite(600, 220, 10, 10);
    obst.addAnimation("o1", obstanim);
    obst.velocityX = -5;
    obstgroup.add(obst);
    obst.lifetime = 300;

  }

}

function reset() {
  GameState = PLAY;
  obstgroup.destroyEach();
  bricksgroup.destroyEach();
  score = 0;
  mario.addAnimation("m1", marioAnim);
  ground.velocityX = -5;

}