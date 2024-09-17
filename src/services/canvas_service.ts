import { IMAGES_PATH } from "../core/constants";

const fs = require('fs').promises;
const path = require('path');
const Jimp = require('jimp');

export class CaptchaService {
    static async generateImage(fileName: string, text: string) {
        const width = 530;
        const height = 150;
        const circleCount = 5; 
        const lineCount = 10; 
        const horizontalLineCount = 5; 
        const horizontalLineThickness = 6;

        const image = new Jimp(width, height, '#FFFFFF');

        const font = await Jimp.loadFont(Jimp['FONT_SANS_64_WHITE']); 

        const textY = height / 2 - height / 6;
        let currentX = width * 0.02;
        for (let i = 0; i < text.length; i++) {
            const letter = text[i];
            const letterColor = this.getRandomColor();
            await this.drawTextLetter(image, letter, currentX, textY, font, letterColor);
            currentX += Jimp.measureText(font, letter) * 1.4;
        }

        for (let i = 0; i < circleCount; i++) {
            const radius = 50 + Math.random() * 30;
            const centerX = Math.random() * width;
            const centerY = Math.random() * height;
            const borderColor = this.getRandomColor();
            let borderWidth = 2 + Math.random() * 5;
            this.drawCircleBorder(image, centerX, centerY, radius, borderWidth, borderColor);
        }

        const lineSpacing = width / (lineCount + 1);
        for (let i = 0; i < lineCount; i++) {
            const x = lineSpacing * (i + 1);
            const lineColor = this.getRandomColor();
            let lineThickness = 2 + Math.random() * 5;
            this.drawVerticalLine(image, x, lineThickness, lineColor);
        }

        const horizontalLineSpacing = height / (horizontalLineCount + 1);
        for (let i = 0; i < horizontalLineCount; i++) {
            const y = horizontalLineSpacing * (i + 1);
            const lineColor = this.getRandomColor();
            this.drawHorizontalLine(image, y, horizontalLineThickness, lineColor);
        }


        await image.writeAsync(`${IMAGES_PATH}/${fileName}`);
    }

    static drawHorizontalLine(image, y, thickness, lineColor) {
        const startY = y - Math.floor(thickness / 2);
        const endY = y + Math.floor(thickness / 2);
    
        for (let yPos = startY; yPos <= endY; yPos++) {
            for (let x = 0; x < image.bitmap.width; x++) {
                if (yPos >= 0 && yPos < image.bitmap.height) {
                    image.setPixelColor(lineColor, x, yPos);
                }
            }
        }
    }

    static drawCircleBorder(image, centerX, centerY, radius, borderWidth, borderColor) {
        for (let y = -radius - borderWidth; y <= radius + borderWidth; y++) {
            for (let x = -radius - borderWidth; x <= radius + borderWidth; x++) {
                if (x * x + y * y <= (radius + borderWidth) * (radius + borderWidth)) {
                    if (x * x + y * y >= radius * radius) {
                        const px = Math.round(centerX + x);
                        const py = Math.round(centerY + y);

                        if (px >= 0 && px < image.bitmap.width && py >= 0 && py < image.bitmap.height) {
                            image.setPixelColor(borderColor, px, py);
                        }
                    }
                }
            }
        }
    }

    static async drawTextLetter(image, letter, x, y, font, color) {
        const letterImage = new Jimp(Jimp.measureText(font, letter), Jimp.measureTextHeight(font, letter), '#00000000'); // Transparent background
    
        letterImage.print(font, 0, 0, letter);
        letterImage.scan(0, 0, letterImage.bitmap.width, letterImage.bitmap.height, (px, py, idx) => {
            if (letterImage.bitmap.data[idx + 3] > 0) {
                image.setPixelColor(color, x + px, y + py);
            }
        });
    }

    static drawVerticalLine(image, x, thickness, lineColor) {
        const startX = x - Math.floor(thickness / 2);
        const endX = x + Math.floor(thickness / 2);
    
        for (let xPos = startX; xPos <= endX; xPos++) {
            for (let y = 0; y < image.bitmap.height; y++) {
                if (xPos >= 0 && xPos < image.bitmap.width) {
                    image.setPixelColor(lineColor, xPos, y);
                }
            }
        }
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
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return Jimp.rgbaToInt(r, g, b, 255);
    }
}