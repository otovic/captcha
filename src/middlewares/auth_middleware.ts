import * as crypto from 'crypto';
import { CAPTCHA_SECURITY_TOKEN } from '../core/constants';

const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(CAPTCHA_SECURITY_TOKEN, 'salt', 32);

export const Authenticate = (token: string) => {
    try {
        const [ivStr, encryptedText] = token.split(':');
        const iv = Buffer.from(ivStr, 'hex');
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Error authenticating: ', error);
        throw error;
    }
}