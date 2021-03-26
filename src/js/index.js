//Game objets
var platforms
var player
var music
var cursors

//Objets
var coins
var saws

//Texts and counters
var score = 0
var scoreText
var gameOverText
var gameOver = false
var gameOverScore

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

var game = new Phaser.Game(config)

function preload() {
    //Music
    this.load.audio('song', ['/assets/music.mp3', '/assets/music.ogg'])

    //Hero
    this.load.spritesheet('hero', '/assets/hero.png', { frameWidth: 20, frameHeight: 18 })
    this.load.spritesheet('hero2', '/assets/hero2.png', { frameWidth: 20, frameHeight: 18 })

    //Back decoratin
    this.load.image('back', '/assets/NightSky.png')
    this.load.image('foot', '/assets/footer.png')
    this.load.image('plat', '/assets/Platform.png')
    this.load.image('litplat', '/assets/littleplat.png')

    //Floor decoration
    this.load.image('sea', '/assets/sea.png')
    this.load.image('grass', '/assets/grass.png')
    this.load.image('lGrass', '/assets/littlegrass.png')

    //Flowers
    this.load.image('fBlue', '/assets/flower1.png')
    this.load.image('fRed', '/assets/flower2.png')
    this.load.image('fYellow', '/assets/flower3.png')

    //Bush
    this.load.image('bush', '/assets/bush.png')

    //Collectionables
    this.load.spritesheet('coin', '/assets/coins.png', { frameWidth: 20, frameHeight: 20 })
    this.load.image('saw', '/assets/saw.png')
}

function create() {
    this.music = this.sound.add('song')
    this.music.play()

    this.add.image(0, 0, 'back').setOrigin(0, 0).setScale(1.6, 2.4)


    //Grass
    this.add.image(0, 415, 'grass').setScale(2, 2).setOrigin(0, 0)
    this.add.image(100, 415, 'grass').setScale(2, 2).setOrigin(0, 0)
    this.add.image(700, 415, 'grass').setScale(2, 2).setOrigin(0, 0)
    this.add.image(690, 185, 'grass').setOrigin(0, 0)
    this.add.image(200, 82, 'grass').setOrigin(0, 0)
    this.add.image(50, 188, 'lGrass').setOrigin(0, 0)

    //Flowers
    this.add.image(70, 420, 'fBlue').setOrigin(0, 0)
    this.add.image(310, 420, 'fBlue').setOrigin(0, 0)
    this.add.image(700, 420, 'fRed').setOrigin(0, 0)
    this.add.image(390, 175, 'fRed').setOrigin(0, 0)
    this.add.image(250, 275, 'fYellow').setOrigin(0, 0)

    //Bush
    this.add.image(530, 278, 'bush').setOrigin(0, 0).setScale(1.5)
    this.add.image(400, 428, 'bush').setOrigin(0, 0).setScale(1.5)
    this.add.image(500, 80, 'bush').setOrigin(0, 0).setScale(1.5)

    //Sea
    this.add.image(-5, 570, 'sea').setOrigin(0, 0).setScale(4, 2)
    this.add.image(250, 570, 'sea').setOrigin(0, 0).setScale(4, 2)
    this.add.image(500, 570, 'sea').setOrigin(0, 0).setScale(4, 2)
    this.add.image(750, 570, 'sea').setOrigin(0, 0).setScale(4, 2)

    //footer
    platforms = this.physics.add.staticGroup()
    platforms.create(-10, 450, 'foot').setScale(2, 2).setOrigin(0, 0).refreshBody()
    platforms.create(300, 450, 'foot').setScale(2, 2).setOrigin(0, 0).refreshBody()
    platforms.create(618, 450, 'foot').setScale(2, 2).setOrigin(0, 0).refreshBody()

    //Sky platforms
    platforms.create(200, 300, 'plat').setOrigin(0, 0).refreshBody()
    platforms.create(500, 300, 'plat').setOrigin(0, 0).refreshBody()
    platforms.create(500, 100, 'plat').setOrigin(0, 0).refreshBody()
    platforms.create(200, 100, 'plat').setOrigin(0, 0).refreshBody()

    //Little platforms
    platforms.create(50, 200, 'litplat').setOrigin(0, 0).refreshBody()
    platforms.create(380, 200, 'litplat').setOrigin(0, 0).refreshBody()
    platforms.create(680, 200, 'litplat').setOrigin(0, 0).refreshBody()

    //Player
    player = this.physics.add.sprite(50, 400, 'hero').setScale(2)
    player.setBounce(0.2)
    player.setCollideWorldBounds(true)

    //Controls
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('hero2', { start: 5, end: 7 }),
        frameRate: 10,
        repeat: -1
    })

    this.anims.create({
        key: 'turn',
        frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 3 }),
        frameRate: 10
    })

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('hero', { start: 5, end: 7 }),
        frameRate: 10,
        repeat: -1
    })

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('hero', { start: 7, end: 8 }),
        frameRate: 20
    })


    cursors = this.input.keyboard.createCursorKeys()

    //Saws
    saws = this.physics.add.group()

    //Coins
    coins = this.physics.add.group({
        key: 'coin',
        scale: 1,
        repeat: 15,
        setXY: { x: 12, y: 0, stepX: 50 }
    })



    coins.children.iterate(function(child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6))
        child.setScale(2)
    })

    //Colliders
    this.physics.add.collider(player, platforms)
    this.physics.add.collider(coins, platforms)
    this.physics.add.collider(saws, platforms)
    this.physics.add.overlap(player, coins, collectCoin, null, this)
    this.physics.add.overlap(player, saws, hitSaw, null, this)

    //Text
    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fill: '#ffffff'
    })

}

function update() {
    if (gameOver) {
        gameOverText = this.add.text(270, 200, 'GAME OVER', {
            fontSize: '50px',
            fill: '#ffffff'
        })
        gameOverScore = this.add.text(325, 250, 'Score: ' + score, {
            fontSize: '35px',
            fill: '#ffffff'
        })
        return;
    }
    fallDown(player)
    if (cursors.left.isDown) {
        player.setVelocityX(-160)
        player.anims.play('left', true)
    } else if (cursors.right.isDown) {
        player.setVelocityX(160)
        player.anims.play('right', true)
    } else {
        player.setVelocityX(0)
        player.anims.play('turn', true)
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.anims.play('up', true)
        player.setVelocityY(-300)
    }
}



function fallDown(player) {
    if (player.y > 580) {
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        player.setTint(0xFF0000)
        player.anims.play('turn')
        gameOver = true
    }
}

function collectCoin(player, coin) {
    coin.disableBody(true, true)
    score += 10
    scoreText.setText('Score: ' + score)
    if (coins.countActive(true) === 0) {
        coins.children.iterate(function(child) {
            child.enableBody(true, child.x, 0, true, true)
        })

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)
        var bomb = saws.create(x, 16, 'saw')
        bomb.setBounce(1)
        bomb.setCollideWorldBounds(true)
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
        bomb.allowGravity = false
    }
}

function hitSaw(player, bomb) {
    this.physics.pause()
    player.setTint(0xFF0000)
    player.anims.play('turn')
    gameOver = true;
}