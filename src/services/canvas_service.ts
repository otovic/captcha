const { createCanvas } = require('canvas');
const fs = require('fs');

export class CaptchaService {
    private captchaService: CaptchaService = new CaptchaService();

    constructor() {
        this.
     }

    async generateImage() {
        const width = 500;
        const height = 150;

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        ctx.font = '64px sans-serif';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const text = 'ACG369CF';
        ctx.fillText(text, width / 2, height / 2);

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;

        const textWidth = ctx.measureText(text).width;
        const textHeight = 48;

        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, height / 2.2);
        ctx.lineTo(width, height / 2.2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, height / 2.4);
        ctx.lineTo(width, height / 2.4);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, height / 1.8);
        ctx.lineTo(width, height / 1.8);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, height / 1.6);
        ctx.lineTo(width, height / 1.6);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(width / 4, 0);
        ctx.lineTo(width / 4, height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(width / 3, 0);
        ctx.lineTo(width / 3, height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.stroke();

        const buffer = canvas.toBuffer('image/png');
        await fs.writeFileAsync('src/images/textImageWithLines.png', buffer);
    }
}