//loading the game ..

// window.addEventListener("load", function () {
    //canvas
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d")
    canvas.width = 700;
    canvas.height = 500;
    // console.log(canvas);

    // classes

    // controller class
    class InputHandler {
        constructor(game) {
            this.game = game;
            // these events checks if the key pressed or not
            window.addEventListener("keydown", e => {
                if (((e.key === 'ArrowUp') || (e.key === 'ArrowDown')) && this.game.keys.indexOf(e.key) === -1) {
                    this.game.keys.push(e.key);
                }
                else if (e.key === ' ') {
                    this.game.player.shootTop();
                } else if (e.key === 'd') {
                    this.game.debug = !this.game.debug;
                }
            })
            window.addEventListener("keyup", e => {
                if (this.game.keys.indexOf(e.key) > -1) {
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }
            })
        }
    }

    // firing class 
    class Projectile {
        constructor(game, x, y) {
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 10;
            this.height = 3;
            this.speed = 3;
            this.markedForDeletion = false;
        }
        update() {
            this.x += this.speed;
            if (this.x > this.game.width * 0.8) {
                this.markedForDeletion = true;
            }
        }
        draw(context) {
            context.fillStyle = 'red';
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    class Particle {

    }

    class Player {
        constructor(game) {
            this.game = game;
            this.width = 120;
            this.height = 120;
            this.x = 20;
            this.y = 100;
            this.speedY = 0;
            this.maxSpeed = 3;
            this.projectiles = [];
            this.image = document.getElementById('player');
        }
        update() {
            if (this.game.keys.includes("ArrowUp")) {
                this.speedY = -this.maxSpeed
            } else if (this.game.keys.includes("ArrowDown")) {
                this.speedY = this.maxSpeed
            } else {
                this.speedY = 0
            }
            this.y += this.speedY;
            // handle projectile (shooting)
            this.projectiles.forEach(projectile => {
                projectile.update();
            })
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
        }
        draw(context) {
            if (this.game.debug) {
                context.strokeRect(this.x, this.y, this.width, this.height);
            }
            context.drawImage(this.image, this.x, this.y);
            this.projectiles.forEach(projectile => {
                projectile.draw(context);
            })
        }
        shootTop() {
            if (this.game.ammo > 0) {
                this.projectiles.push(new Projectile(this.game, this.x + 80, this.y + 60));
                this.game.ammo--;
            }
        }
    }

    class Enemy {
        constructor(game) {
            this.game = game;
            this.x = this.game.width;
            this.speedX = Math.random() * -1.5 - 0.5;
            this.markedForDeletion = false;
        }
        update() {
            this.x += this.speedX - this.game.speed;
            if (this.x + this.width < 0) {
                this.markedForDeletion = true;
            }
        }
        draw(context) {
            if (this.game.debug) {
                context.strokeRect(this.x, this.y, this.width, this.height);
                context.fillStyle = 'red'
                context.font = '25 Helvetica'
                context.fillText(this.lives, this.x, this.y);
            }
            context.drawImage(this.image, this.x, this.y);
        }
    }
    class Angular1 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 120;
            this.height = 120;
            this.y = Math.random() * (this.game.height * 0.9 + this.height);
            this.image = document.getElementById('angular1');
            this.lives = 2;
            this.score = this.lives;
        }
    }
    class Angular2 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 120;
            this.height = 120;
            this.y = Math.random() * (this.game.height * 0.9 + this.height);
            this.image = document.getElementById('angular2');
            this.lives = 3;
            this.score = this.lives;
        }
    }
    class Angular3 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 120;
            this.height = 120;
            this.y = Math.random() * (this.game.height * 0.9 + this.height);
            this.image = document.getElementById('angular3');
            this.lives = 4;
            this.score = this.lives;
        }
    }
    class Angular4 extends Enemy {
        constructor(game) {
            super(game);
            this.width = 130;
            this.height = 120;
            this.y = Math.random() * (this.game.height * 0.9 + this.height);
            this.image = document.getElementById('angular4');
            this.lives = 5;
            this.score = this.lives;
        }
    }
    class Lucky extends Enemy {
        constructor(game) {
            super(game);
            this.width = 70;
            this.height = 60;
            this.y = Math.random() * (this.game.height * 0.9 + this.height);
            this.image = document.getElementById('lucky');
            this.lives = 1;
            this.score = this.lives;
            this.type = 'lucky';
        }
    }

    class Layer {
        constructor(game, image, speedModifier) {
            this.game = game;
            this.image = image;
            this.speedModifier = speedModifier;
            this.width = 1768;
            this.height = 500;
            this.x = 0;
            this.y = 0;
        }
        update() {
            if (this.x <= -this.width) {
                this.x = 0;
            }
            this.x -= this.game.speed * this.speedModifier;
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y);
            context.drawImage(this.image, this.x + this.width, this.y);
        }
    }

    class Background {
        constructor(game) {
            this.game = game;
            this.image1 = document.getElementById('layer1')
            this.image2 = document.getElementById('layer2')
            this.image3 = document.getElementById('layer3')
            this.image4 = document.getElementById('layer4')
            this.layer1 = new Layer(this.game, this.image1, 0.2)
            this.layer2 = new Layer(this.game, this.image2, 1)
            this.layer3 = new Layer(this.game, this.image3, 1)
            this.layer4 = new Layer(this.game, this.image4, 1.5)
            this.layers = [this.layer1, this.layer2, this.layer3, this.layer4]
        }
        update() {
            this.layers.forEach(layer => layer.update());
        }
        draw(context) {
            this.layers.forEach(layer => layer.draw(context));
        }
    }

    class UI {
        constructor(game) {
            this.game = game;
            this.fontSize = 25;
            this.fontFamily = 'Helvetica'
            this.color = 'white';
        }
        draw(context) {
            context.save();
            context.fillStyle = this.color;
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowColor = 'black';
            context.font = this.fontSize + 'px ' + this.fontFamily;
            //score
            context.fillText('Score ' + this.game.score, 20, 40);
            //ammo
            for (let i = 0; i < this.game.ammo; i++) {
                context.fillRect(20 + 5 * i, 50, 3, 20);
            }
            //timer
            const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
            context.fillText('Time: ' + formattedTime, 20, 100);
            // game over message
            if (this.game.gameOver) {
                context.textAlign = 'center';
                let message1;
                let message2;
                if (this.game.score >= this.game.winningScore) {
                    message1 = 'You won!';
                    message2 = 'Good Job Capt.';
                } else {
                    message1 = 'You lose!';
                    message2 = 'Try again';
                }
                context.font = '50px ' + this.fontFamily;
                context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = '25px ' + this.fontFamily;
                context.fillText(message2, this.game.width * 0.5, this.game.height * 0.5 + 20);
            }
            context.restore();
        }
    }

    // game class is considered the brain of the project
    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.background = new Background(this)
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.keys = [];
            this.enemies = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.ammo = 20;
            this.maxAmmo = 25;
            this.ammoTimer = 0;
            this.ammoInterval = 500;
            this.gameOver = false;
            this.score = 0;
            this.winningScore = 100;
            this.gameTime = 0;
            this.timeLimit = 100000;
            this.speed = 1;
            this.debug = false;
        }
        update(deltaTime) {
            //game timer
            if (!this.gameOver) {
                this.gameTime += deltaTime;
            }
            if (this.gameTime > this.timeLimit) {
                this.gameOver = true;
            }
            // background
            this.background.update();
            // ammo update
            this.player.update();
            if (this.ammoTimer > this.ammoInterval) {
                if (this.ammo < this.maxAmmo) this.ammo++;
                this.ammoTimer = 0;
            } else {
                this.ammoTimer += deltaTime
            }
            // enemy update
            this.enemies.forEach(enemy => {
                enemy.update();
                if (this.checkCollision(this.player, enemy)) {
                    enemy.markedForDeletion = true;
                }
                this.player.projectiles.forEach(projectile => {
                    if (this.checkCollision(projectile, enemy)) {
                        enemy.lives--;
                        projectile.markedForDeletion = true;
                        if (enemy.lives <= 0) {
                            enemy.markedForDeletion = true;
                            if (!this.gameOver) {
                                this.score += enemy.score;
                            }
                            if (this.score >= this.winningScore) {
                                this.gameOver = true;
                            }
                        }
                    }
                })
            })
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
        }
        draw(context) {
            this.background.draw(context);
            this.player.draw(context);
            this.ui.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            })
        }
        addEnemy() {
            const randomize = Math.random().toFixed(1);
            if (randomize <0.2) {
                this.enemies.push(new Angular1(this));
            } else if (randomize > 0.2 && randomize < 0.4) {
                this.enemies.push(new Angular2(this));
            }else if (randomize > 0.4 && randomize < 0.6) {
                this.enemies.push(new Angular3(this));
            }else if (randomize > 0.6 && randomize < 0.8) {
                this.enemies.push(new Angular4(this));
            }else if (randomize > 0.8 && randomize < 1){
                this.enemies.push(new Lucky(this));
            }
        }
        checkCollision(rect1, rect2) {
            return (rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.y + rect1.height > rect2.y)
        }
    }

    // after loading the game it will automaticly create a player 
    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    // animation loop
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(0);
// })
