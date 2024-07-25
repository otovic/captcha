import { IMAGES_PATH } from "../core/constants";

const { createCanvas } = require('canvas');
const fs = require('fs').promises;
const path = require('path');

export class CaptchaService {
    static async generateImage(fileName: string, text: string) {
        const width = 500;
        const height = 150;
        const fontSize = 64;

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        ctx.font = `${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const textLength = text.length;
        const textSpacing = width / (textLength + 1);
        const baseY = height / 2;

        for (let i = 0; i < textLength; i++) {
            const letter = text[i];
            const x = (i + 1) * textSpacing;
            const y = baseY;

            ctx.fillStyle = CaptchaService.getRandomColor();

            ctx.fillText(letter, x, y);
        }

        const horizontalLineColors = [
            CaptchaService.getRandomColor(),
            CaptchaService.getRandomColor(),
            CaptchaService.getRandomColor(),
            CaptchaService.getRandomColor()
        ];

        ctx.lineWidth = 5;

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

        const circleCount = 7;
        const borderWidth = 3;
        for (let i = 0; i < circleCount; i++) {
            const circleColor = CaptchaService.getRandomColor();
            const radius = Math.random() * 30 + 10;
            const x = Math.random() * (width - 2 * radius) + radius;
            const y = Math.random() * (height - 2 * radius) + radius;

            ctx.strokeStyle = circleColor;
            ctx.lineWidth = borderWidth;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.stroke();
        }

        const buffer = canvas.toBuffer('image/png');
        await fs.writeFile(`${IMAGES_PATH}/${fileName}`, buffer);
    }

    static async deleteImage(fileName: string) {
        const filePath = path.resolve(IMAGES_PATH, fileName);
        try {
            await fs.unlink(filePath);
        } catch (error) {
            console.log("Error deleting image");
        }
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