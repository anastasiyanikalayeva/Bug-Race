const gameState = {
	score: 0
}

function preload () {
	this.load.image('bug1', 'assets/images/bug_1.png');
	this.load.image('bug2', 'assets/images/bug_2.png');
	this.load.image('bug3', 'assets/images/bug_3.png');
	this.load.image('platform', 'assets/images/platform.png');
	this.load.image('hero', 'assets/images/hero.png');
}

function create () {
	const platforms = this.physics.add.staticGroup();
 
	platforms.create(320, 350, 'platform').setScale(2, 0.5).refreshBody();

	gameState.scoreText = this.add.text(290, 340, 'Score: 0', { fontSize: '15px', fill: '#000' })

	this.player = this.physics.add.sprite(320, 300, 'hero').setScale(.5);
	
	this.player.setCollideWorldBounds(true);

	this.physics.add.collider(this.player, platforms)

	const bugs = this.physics.add.group();

	const bugList = ['bug1', 'bug2', 'bug3']

	const bugGen = () => {
		const xCoord = Math.random() * config.width
		let randomBug = bugList[Math.floor(Math.random() * 3)]
		bugs.create(xCoord, 10, randomBug)
	}

	const bugGenLoop = this.time.addEvent({
		delay: 100,
		callback: bugGen,
		loop: true,
	});


	this.physics.add.collider(bugs, platforms, function (bug){
		bug.destroy();
		gameState.score += 10;
		gameState.scoreText.setText(`Score: ${gameState.score}`)		
	})

	this.physics.add.collider(this.player, bugs, () => {
			bugGenLoop.destroy();
			this.physics.pause();

			this.add.text(280, 150, 'Game Over', { fontSize: '15px', fill: '#000' })
			this.add.text(250, 170, 'Click to Restart', { fontSize: '15px', fill: '#000' })
			gameState.score = 0

			this.input.on('pointerdown', () => {
				this.scene.restart();
			})
	})

}

function update () {
	const cursors = this.input.keyboard.createCursorKeys();

	if(cursors.left.isDown){
		this.player.setVelocityX(-200)
	} else if (cursors.right.isDown) {
		this.player.setVelocityX(200)
	} else {
		this.player.setVelocityX(0);
	}

}

const config = {
  type: Phaser.AUTO,
  width: 640,
	height: 360,
	backgroundColor: "b9eaff",
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 200},
			enableBody: true,
			debug: false,
		}
	},
  scene: {
		preload,
		create,
		update
	}
}

const game = new Phaser.Game(config)
