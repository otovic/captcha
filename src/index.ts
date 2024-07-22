import { QueryType } from './core/types';
import { Authenticate } from './middlewares/auth_middleware';
import { DatabaseService } from './services/database_service';
import cors from 'cors';
import path from 'path';

import express, { Request, Response } from 'express';
import { IMAGES_PATH } from './core/constants';
import { corsOptions } from './core/cors';
const app = express();
const port = 3000;

declare global {
    namespace Express {
        interface Request {
            db: QueryType
        }
    }
}

const dbService = new DatabaseService();

app.use(cors(corsOptions));
app.use(express.json());

app.use(async (req: Request, res: Response, next) => {
    try {
        const token = req.body.token;
        Authenticate(token) ? next() : res.status(401).json({ message: 'Unauthorized' });
    } catch (error) {
        console.error('Error authenticating the token: ', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
});

app.use(express.static(path.join(__dirname, "../public/images/")));

app.use(async (req: Request, res: Response, next) => {
    req.db = dbService.query();
    next();
});

app.get('/', (req, res) => {
    res.send('Welcome to the image server!');
});

app.get('/generateCaptcha', async (req: Request, res: Response) => {
    try {
        res.json(await req.db.insertCaptcha());
    } catch (error) {
        console.error('Error generating the image: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/validateCaptcha', async (req: Request, res: Response) => {
    try {
        const token = req.body.token;
        const code = req.body.code;
        res.json(await req.db.validateCaptcha(token, code));
    } catch (error) {
        console.error('Error validating the captcha: ', error);
        res.json({ status: 500, validated: false })
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});