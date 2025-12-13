/**
 * MainScene - Main game scene with all interactions and visual elements
 */
class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.storyManager = null;
        this.uiManager = null;
        this.windmill = null;
        this.panda = null;
        this.paper = null;
        this.background = null;
        this.isInEnding = false;
    }

    preload() {
        // We'll create simple graphics instead of loading images
        // This makes the game instantly playable without external assets
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Initialize managers
        this.storyManager = new StoryManager();
        this.uiManager = new UIManager(this);

        // Create background
        this.createBackground();

        // Create scene elements
        this.createPanda();
        this.createWindmill();
        this.createPaper();

        // Create UI
        this.uiManager.createTextBox();

        // Start the story
        this.startNode();
    }

    /**
     * Create background with sunset colors
     */
    createBackground() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Sky gradient
        const sky = this.add.rectangle(0, 0, width, height, 0xffcc99);
        sky.setOrigin(0, 0);

        // Sun
        const sun = this.add.circle(width - 100, 100, 60, 0xffaa66);
        sun.setAlpha(0.8);

        // Ground
        const ground = this.add.rectangle(0, height - 100, width, 100, 0x99cc99);
        ground.setOrigin(0, 0);

        this.background = this.add.container(0, 0);
    }

    /**
     * Create panda character (棉棉)
     */
    createPanda() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const pandaX = width / 2 - 100;
        const pandaY = height - 180;

        // Panda body
        const body = this.add.ellipse(pandaX, pandaY, 80, 100, 0x333333);
        
        // Panda head
        const head = this.add.circle(pandaX, pandaY - 60, 50, 0xeeeeee);
        
        // Ears
        const leftEar = this.add.circle(pandaX - 30, pandaY - 85, 20, 0x333333);
        const rightEar = this.add.circle(pandaX + 30, pandaY - 85, 20, 0x333333);
        
        // Eyes
        const leftEye = this.add.ellipse(pandaX - 15, pandaY - 65, 25, 30, 0x333333);
        const rightEye = this.add.ellipse(pandaX + 15, pandaY - 65, 25, 30, 0x333333);
        const leftPupil = this.add.circle(pandaX - 15, pandaY - 60, 8, 0xffffff);
        const rightPupil = this.add.circle(pandaX + 15, pandaY - 60, 8, 0xffffff);
        
        // Nose
        const nose = this.add.ellipse(pandaX, pandaY - 50, 12, 8, 0x333333);
        
        // Mouth (simple curve)
        const mouth = this.add.ellipse(pandaX, pandaY - 42, 20, 10, 0x333333);
        mouth.setAlpha(0.3);

        this.panda = this.add.container(0, 0, [
            body, head, leftEar, rightEar,
            leftEye, rightEye, leftPupil, rightPupil,
            nose, mouth
        ]);

        // Breathing animation
        this.tweens.add({
            targets: this.panda,
            scaleY: 1.02,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Blinking animation
        this.time.addEvent({
            delay: 3000,
            callback: () => {
                this.tweens.add({
                    targets: [leftEye, rightEye],
                    scaleY: 0.1,
                    duration: 100,
                    yoyo: true
                });
            },
            loop: true
        });
    }

    /**
     * Create windmill
     */
    createWindmill() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const windmillX = width / 2 + 150;
        const windmillY = height - 200;

        // Windmill pole
        const pole = this.add.rectangle(windmillX, windmillY + 40, 10, 80, 0x8b4513);

        // Windmill blades (4 rectangles forming a cross)
        const blade1 = this.add.rectangle(windmillX, windmillY - 25, 10, 50, 0xff6666);
        const blade2 = this.add.rectangle(windmillX + 25, windmillY, 50, 10, 0xff8888);
        const blade3 = this.add.rectangle(windmillX, windmillY + 25, 10, 50, 0xff6666);
        const blade4 = this.add.rectangle(windmillX - 25, windmillY, 50, 10, 0xff8888);

        // Center circle
        const center = this.add.circle(windmillX, windmillY, 15, 0xffaa66);

        this.windmill = this.add.container(0, 0, [pole, blade1, blade2, blade3, blade4, center]);
        this.windmillCenter = { x: windmillX, y: windmillY };
        this.windmillBlades = [blade1, blade2, blade3, blade4];

        // Make clickable
        center.setInteractive({ useHandCursor: true });
        center.on('pointerdown', () => this.onWindmillClick());

        // Slow rotation by default
        this.tweens.add({
            targets: this.windmillBlades,
            angle: 360,
            duration: 8000,
            repeat: -1,
            ease: 'Linear'
        });
    }

    /**
     * Handle windmill click
     */
    onWindmillClick() {
        // Stop all existing tweens on blades
        this.windmillBlades.forEach(blade => {
            this.tweens.killTweensOf(blade);
        });

        // Fast spin animation
        this.tweens.add({
            targets: this.windmillBlades,
            angle: '+=360',
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                // Resume slow rotation
                this.tweens.add({
                    targets: this.windmillBlades,
                    angle: '+=360',
                    duration: 8000,
                    repeat: -1,
                    ease: 'Linear'
                });
            }
        });

        // Play click sound effect (visual feedback)
        this.cameras.main.shake(100, 0.002);
    }

    /**
     * Create paper and pen
     */
    createPaper() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const paperX = width / 2;
        const paperY = height / 2;

        // Paper
        const paper = this.add.rectangle(paperX, paperY, 150, 200, 0xffffee);
        paper.setStrokeStyle(2, 0xcccccc);
        paper.setAlpha(0);

        // Lines on paper
        const line1 = this.add.rectangle(paperX, paperY - 40, 120, 2, 0xcccccc);
        const line2 = this.add.rectangle(paperX, paperY - 20, 120, 2, 0xcccccc);
        const line3 = this.add.rectangle(paperX, paperY, 120, 2, 0xcccccc);
        const line4 = this.add.rectangle(paperX, paperY + 20, 120, 2, 0xcccccc);
        line1.setAlpha(0);
        line2.setAlpha(0);
        line3.setAlpha(0);
        line4.setAlpha(0);

        // Pen
        const pen = this.add.rectangle(paperX + 80, paperY + 50, 8, 50, 0x4444ff);
        pen.setAngle(45);
        pen.setAlpha(0);

        this.paper = this.add.container(0, 0, [paper, line1, line2, line3, line4, pen]);
        this.paperElements = [paper, line1, line2, line3, line4, pen];
    }

    /**
     * Show paper animation
     */
    showPaper() {
        this.paperElements.forEach((element, index) => {
            this.tweens.add({
                targets: element,
                alpha: 1,
                duration: 300,
                delay: index * 100
            });
        });
    }

    /**
     * Hide paper
     */
    hidePaper() {
        this.paperElements.forEach(element => {
            element.setAlpha(0);
        });
    }

    /**
     * Start a story node
     */
    startNode() {
        const node = this.storyManager.getCurrentNode();
        
        if (!node) return;

        // Handle interactions
        if (node.interaction === 'paper') {
            this.showPaper();
        } else {
            this.hidePaper();
        }

        // Display text
        this.uiManager.displayText(node.text, () => {
            // Create buttons after text is displayed
            this.uiManager.createButtons(node.buttons, (action) => {
                this.handleAction(action);
            });
        });
    }

    /**
     * Handle button actions
     */
    handleAction(action) {
        if (action === 'restart') {
            this.isInEnding = false;
            this.storyManager.reset();
            this.hidePaper();
            this.startNode();
            return;
        }

        const result = this.storyManager.nextNode(action);

        // Check if we reached an ending
        if (result && result.ending) {
            this.showEnding(result.ending);
        } else if (action === 'action') {
            // Show countdown before ending
            this.showActionCountdown();
        } else {
            this.startNode();
        }
    }

    /**
     * Show action countdown (simulated 5 minutes)
     */
    showActionCountdown() {
        this.uiManager.clearButtons();
        
        // Show countdown text
        let countdown = 5;
        this.uiManager.textContent.setText(`开始行动中... ${countdown}秒`);

        const countdownTimer = this.time.addEvent({
            delay: 200,
            callback: () => {
                countdown--;
                if (countdown > 0) {
                    this.uiManager.textContent.setText(`开始行动中... ${countdown}秒`);
                } else {
                    countdownTimer.destroy();
                    // Now show the random ending
                    const result = this.storyManager.nextNode('action');
                    this.showEnding(result.ending);
                }
            },
            repeat: 4
        });
    }

    /**
     * Show ending
     */
    showEnding(endingName) {
        this.isInEnding = true;
        const ending = this.storyManager.getEnding(endingName);

        // Display ending text
        this.uiManager.displayText(ending.text, () => {
            // Show restart button
            this.uiManager.createButtons([
                { text: "重新开始", action: "restart" }
            ], (action) => {
                this.handleAction(action);
            });
        });

        // Special effects for endings
        if (endingName === 'funny') {
            // Windmill spins once for applause
            this.time.delayedCall(1500, () => {
                this.onWindmillClick();
            });
        }
    }

    update() {
        // Update logic if needed
    }
}
