import * as crypto from 'crypto';
import { CAPTCHA_SECURITY_TOKEN } from '../core/constants';

const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(CAPTCHA_SECURITY_TOKEN, 'salt', 32);

export const Authenticate = (token: string) => {
    try {
        return token == CAPTCHA_SECURITY_TOKEN
    } catch (error) {
        console.error('Error authenticating: ', error);
        throw error;
    }
}