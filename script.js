"use strict";

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const elapsed = document.getElementById("elapsed");

class Vector {
  x;
  y;
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
}
class Entity {
  loc = new Vector(0, 0);
  vel = new Vector(0, 0);
  color;
  minspeed;
  
  constructor(x, y, vx, vy){
    this.loc.x = x;
    this.loc.y = y;
    this.vel.x = vx;
    this.vel.y = vy;
  }
  draw(){
   // console.log("draw", context.fillStyle, this.color);
    context.fillStyle = this.color;
    context.fillRect (this.loc.x, this.loc.y, 10, 10);
    //context.closePath();
    }
  move(delta){
    this.loc.x += this.vel.x * delta;
    this.loc.y += this.vel.y * delta;
    }
  wall(){
    if (this.loc.x <= 0) this.vel.x = this.minspeed;
    if (this.loc.x >= canvas.width - 10) this.vel.x = -this.minspeed;
    if (this.loc.y <= 0) this.vel.y = this.minspeed;
    if (this.loc.y >= canvas.height - 10) this.vel.y = - this.minspeed;
    }
   left() {
    this.vel.x = -this.minspeed;
  }
   right() {
    this.vel.x = this.minspeed;
  }
   up() {
    this.vel.y = -this.minspeed;
    } 
   down() {
    this.vel.y = this.minspeed;
  }
  collision(other){
    const playerCenter = new Vector(this.loc.x + 5, this.loc.y + 5);
    const enemyCenter = new Vector(other.loc.x + 5, other.loc.y + 5);
    if (Math.abs (playerCenter.x - enemyCenter.x) <10 && Math.abs (playerCenter.y - enemyCenter.y) < 10)
      return true;
    }
}
class Player extends Entity {
  minspeed = 0.1;
  color = "black";
  }
class Enemy extends Entity {
  minspeed = 0.2;
  color = "red";
  }
const player = new Player(0, 0, 0.1, 0.1);
const enemies = [];

function clear() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

let last_ts = null; 
const started = Date.now();
function animate(timestamp) {
  clear();
  const elapsedSeconds = (Date.now() - started) / 1000;
  elapsed.textContent = elapsedSeconds;
  if (last_ts != null) {
    const delta = timestamp - last_ts;
    player.move(delta);
    player.wall();
    enemies.forEach(enemy => {
      enemy.move(delta);
      enemy.wall();
    });
  }
  player.draw();
  for(let i = 0; i < enemies.length; i++){
    enemies[i].draw();
  }
  //console.log("player", player.loc.x, player.loc.y, "enemy" , enemies[0].loc.x, enemies[0].loc.y);
  let over = false;
  for(let i = 0; i < enemies.length; i++){
    if (player.collision(enemies[i])){
      over = true;
      alert("skill issue")
    }
  }

  if (Math.floor (elapsedSeconds/7) +1> enemies.length) {
    enemies.push(new Enemy(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height), 0.1, 0.1));

    }
  
  last_ts = timestamp;
  if (!over)
    requestAnimationFrame((t) => animate(t));
}
function keydown(event) {
  if (event.keyCode == '38') {
    player.up();
  }
  else if (event.keyCode == '40') {
    player.down();
  }
  else if (event.keyCode == '37') {
   player.left();
  }
  else if (event.keyCode == '39') {
   player.right();
  }
  }
document.addEventListener("keydown", keydown);

document.getElementById("left").addEventListener("click", event => player.left());
document.getElementById("right").addEventListener("click", event => player.right());
document.getElementById("up").addEventListener("click", event => player.up());
document.getElementById("down").addEventListener("click", event => player.down());
requestAnimationFrame(animate);
