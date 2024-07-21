const { createCanvas } = require('canvas');
const fs = require('fs').promises;

export class CaptchaService {
    static async generateImage(fileName: string, text: string) {
        const width = 500;
        const height = 150;
        const fontSize = 64; // Adjust font size if necessary

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Fill background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Draw text with random colors
        ctx.font = `${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Calculate spacing and position
        const textLength = text.length;
        const textSpacing = width / (textLength + 1);
        const baseY = height / 2;

        for (let i = 0; i < textLength; i++) {
            const letter = text[i];
            const x = (i + 1) * textSpacing; // Position each letter
            const y = baseY;

            // Set random color for each letter
            ctx.fillStyle = CaptchaService.getRandomColor();

            ctx.fillText(letter, x, y);
        }

        // Draw horizontal lines with random colors
        const horizontalLineColors = [
            CaptchaService.getRandomColor(),
            CaptchaService.getRandomColor(),
            CaptchaService.getRandomColor(),
            CaptchaService.getRandomColor()
        ];

        ctx.lineWidth = 5;

        // Draw horizontal lines
        const horizontalPositions = [
            height / 2.5,
            height / 2.1,
            height / 1.8,
            height / 1.6
        ];

        horizontalPositions.forEach((pos, index) => {
            ctx.strokeStyle = horizontalLineColors[index % horizontalLineColors.length];
            ctx.beginPath();
            ctx.moveTo(0, pos);
            ctx.lineTo(width, pos);
            ctx.stroke();
        });

        // Draw vertical lines with random colors
        const verticalLineColors = Array.from({ length: 10 }, () => CaptchaService.getRandomColor());
        const verticalSpacing = width / (verticalLineColors.length + 1);

        verticalLineColors.forEach((color, index) => {
            const x = (index + 1) * verticalSpacing;
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        });

        // Draw circles with only borders
        const circleCount = 7;
        const borderWidth = 3; // Adjust border width if needed
        for (let i = 0; i < circleCount; i++) {
            const circleColor = CaptchaService.getRandomColor();
            const radius = Math.random() * 30 + 10; // Radius between 10 and 40
            const x = Math.random() * (width - 2 * radius) + radius; // Random x within canvas
            const y = Math.random() * (height - 2 * radius) + radius; // Random y within canvas

            ctx.strokeStyle = circleColor;
            ctx.lineWidth = borderWidth; // Set border width
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.stroke(); // Draw the circle border
        }

        const buffer = canvas.toBuffer('image/png');
        await fs.writeFile(`src/images/${fileName}`, buffer);
    }

    static deleteImage(fileName: string) {
        fs.unlink(`src/images/${fileName}`, (error: any) => {
            if (error) {
                console.error('Error deleting the image: ', error);
            }
        });
    }

    static getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}