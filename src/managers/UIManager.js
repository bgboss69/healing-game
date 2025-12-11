/**
 * UIManager - Manages all UI elements, text display, and buttons
 */
class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.textBox = null;
        this.textContent = null;
        this.buttons = [];
        this.currentTextLines = [];
        this.currentLineIndex = 0;
        this.textDisplayTimer = null;
    }

    /**
     * Create the main text box UI
     */
    createTextBox() {
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;

        // Text box background
        this.textBox = this.scene.add.rectangle(
            width / 2,
            height - 120,
            width - 60,
            200,
            0x000000,
            0.7
        );
        this.textBox.setStrokeStyle(4, 0xffffff, 0.5);

        // Text content
        this.textContent = this.scene.add.text(
            50,
            height - 200,
            '',
            {
                fontSize: '20px',
                color: '#ffffff',
                fontFamily: 'Arial, Microsoft YaHei, sans-serif',
                wordWrap: { width: width - 120 },
                lineSpacing: 8
            }
        );

        this.textBox.setDepth(100);
        this.textContent.setDepth(101);
    }

    /**
     * Display text lines one by one
     */
    displayText(lines, onComplete) {
        this.currentTextLines = lines;
        this.currentLineIndex = 0;
        this.textContent.setText('');

        // Clear any existing timer
        if (this.textDisplayTimer) {
            this.textDisplayTimer.destroy();
        }

        // Display first line immediately
        this.showNextLine(onComplete);
    }

    /**
     * Show next line of text
     */
    showNextLine(onComplete) {
        if (this.currentLineIndex < this.currentTextLines.length) {
            const currentText = this.textContent.text;
            const newLine = this.currentTextLines[this.currentLineIndex];
            
            if (currentText) {
                this.textContent.setText(currentText + '\n' + newLine);
            } else {
                this.textContent.setText(newLine);
            }
            
            this.currentLineIndex++;

            // Schedule next line
            this.textDisplayTimer = this.scene.time.delayedCall(800, () => {
                this.showNextLine(onComplete);
            });
        } else {
            // All lines displayed
            if (onComplete) {
                this.scene.time.delayedCall(500, onComplete);
            }
        }
    }

    /**
     * Create buttons
     */
    createButtons(buttonData, onButtonClick) {
        this.clearButtons();

        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;
        const buttonY = height - 40;
        const buttonCount = buttonData.length;
        const spacing = 200;
        const startX = (width - (buttonCount - 1) * spacing) / 2;

        buttonData.forEach((btn, index) => {
            const x = startX + index * spacing;
            
            // Button background
            const buttonBg = this.scene.add.rectangle(
                x,
                buttonY,
                180,
                50,
                0xff9966
            );
            buttonBg.setStrokeStyle(3, 0xffffff);
            buttonBg.setInteractive({ useHandCursor: true });
            buttonBg.setDepth(102);

            // Button text
            const buttonText = this.scene.add.text(
                x,
                buttonY,
                btn.text,
                {
                    fontSize: '18px',
                    color: '#ffffff',
                    fontFamily: 'Arial, Microsoft YaHei, sans-serif'
                }
            );
            buttonText.setOrigin(0.5);
            buttonText.setDepth(103);

            // Button hover effect
            buttonBg.on('pointerover', () => {
                buttonBg.setFillStyle(0xffaa77);
                this.scene.tweens.add({
                    targets: buttonBg,
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 100
                });
            });

            buttonBg.on('pointerout', () => {
                buttonBg.setFillStyle(0xff9966);
                this.scene.tweens.add({
                    targets: buttonBg,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100
                });
            });

            // Button click
            buttonBg.on('pointerdown', () => {
                this.playButtonClickEffect(buttonBg);
                this.scene.time.delayedCall(150, () => {
                    onButtonClick(btn.action);
                });
            });

            this.buttons.push({ bg: buttonBg, text: buttonText });
        });
    }

    /**
     * Button click visual effect
     */
    playButtonClickEffect(button) {
        this.scene.tweens.add({
            targets: button,
            scaleX: 0.95,
            scaleY: 0.95,
            duration: 75,
            yoyo: true
        });
    }

    /**
     * Clear all buttons
     */
    clearButtons() {
        this.buttons.forEach(btn => {
            btn.bg.destroy();
            btn.text.destroy();
        });
        this.buttons = [];
    }

    /**
     * Hide UI elements
     */
    hide() {
        if (this.textBox) this.textBox.setVisible(false);
        if (this.textContent) this.textContent.setVisible(false);
        this.clearButtons();
    }

    /**
     * Show UI elements
     */
    show() {
        if (this.textBox) this.textBox.setVisible(true);
        if (this.textContent) this.textContent.setVisible(true);
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.textDisplayTimer) {
            this.textDisplayTimer.destroy();
        }
        this.clearButtons();
        if (this.textBox) this.textBox.destroy();
        if (this.textContent) this.textContent.destroy();
    }
}
