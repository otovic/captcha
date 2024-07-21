const crypto = require('crypto');

export class Utils {
    static generateToken(length: number) {
        return crypto.randomBytes(length).toString('hex').slice(0, length);
    }

    static generateCaptchaText(length: number) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            result += chars[randomIndex];
        }

        return result;
    }

    static generateCaptchaFileName(): [Date, string] {
        const date = new Date();
        return [date, `${date.getFullYear()}${date.getMonth()}${date.getDay()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}${this.generateToken(10)}.jpg`];
    }
}