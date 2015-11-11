    var charHeight = 36;


    var bgReady = false;
    var bgImage = new Image();
    bgImage.onload = function() {
        bgReady = true;
    };
    bgImage.src = "res/background.png";

    var heroReady = false;
    var heroImage = new Image();
    heroImage.onload = function() {
        heroReady = true;
    };
    heroImage.src = "res/hero.png";

    var monsterReady = false;
    var monsterImage = new Image();
    monsterImage.onload = function() {
        monsterReady = true;
    };
    monsterImage.src = "res/monster.png";

    
    var monstersCaught = 0;

    var keysDown = {};

    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);

    addEventListener("keyup", function (e) {
        delete keysDown[e.keyCode];
    }, false);

    var canvas, ctx, then, monster, hero;
    window.onload = function() {
        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
        canvas.width = 512;
        canvas.height = 480;
        document.body.appendChild(canvas);

        hero = {
            speed: 256,
            x: canvas.width / 2,
            y: canvas.height / 2
        };
        monster = {
            x: 0,
            y: 0
        };

        //Lets play
        var then = Date.now();
        reset();
        main();
    };     
    

    var reset = function () {
        // hero.x = canvas.width / 2;
        // hero.y = canvas.height / 2;

        monster.x = 32 + (Math.random() * (canvas.width - 64));
        monster.y = 32 + (Math.random() * (canvas.height - 64));
    };

    /**
     What may seem odd is the modifier argument passed into update. You'll see how this is referenced in the main function, but let me first explain it here. modifier is a time-based number based on 1. If exactly one second has passed, the value will be 1 and the hero's speed will be multiplied by 1, meaning he will have moved 256 pixels in that second. If one half of a second has passed, the value will be 0.5 and the hero will have moved half of his speed in that amount of time. 
     */
    var update = function (modifier) {
        if (38 in keysDown) { //Player holding up
            hero.y -= hero.speed * modifier;
            if (hero.y <= 0) {
                hero.y = canvas.height - charHeight;
            }
        }
        if (40 in keysDown) { //Player holding down
            hero.y += hero.speed * modifier;
            if (hero.y >= canvas.height - charHeight) {
                hero.y = 0;
            }
        }
        if (37 in keysDown) { //Player holding left
            hero.x -= hero.speed * modifier;
            if (hero.x <= 0) {
                hero.x = canvas.width;
            }
        }
        if (39 in keysDown) { //Player holding right
            hero.x += hero.speed * modifier;
            if (hero.x >= canvas.width) {
                hero.x = 0;
            }
        }

        //are they toughing?
        if (
            hero.x <= (monster.x + 32)
            && monster.x <= (hero.x + 32)
            && hero.y <= (monster.y + 32)
            && monster.y <= (hero.y + 32)
        ) {
            ++monstersCaught;
            reset();
        }
    };

    var render = function () {
        if (bgReady) {
            ctx.drawImage(bgImage, 0, 0);
        }
        if (heroReady) {
            ctx.drawImage(heroImage, hero.x, hero.y);
        }
        if (monsterReady) {
            ctx.drawImage(monsterImage, monster.x, monster.y);
        }

        //Score
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("Monsters caught: " + monstersCaught, 32, 32);
    };

    var w = window;
    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;   

    var main = function () {
        var now = Date.now();
        var delta = now - then;
        update(delta / 1000);
        render();

        then = now;

        //Request to do this again ASAP
        requestAnimationFrame(main);
    };

    

