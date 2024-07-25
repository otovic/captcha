import { CAPTCHA_SECURITY_TOKEN } from '../core/constants';
import { Request, Response } from 'express';

export const authenticate = async (req: Request, res: Response, next: Function) => {
    try {
        const token = req.body.token;
        token === CAPTCHA_SECURITY_TOKEN ? next() : res.status(401).json({ message: 'Unauthorized' });
    } catch (error) {
        console.error('Error authenticating: ', error);
        throw error;
    }
}