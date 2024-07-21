import { QueryType } from './core/types';
import { Authenticate } from './middlewares/auth_middleware';
import { DatabaseService } from './services/database_service';
import cors from 'cors';

import express, { Request, Response } from 'express';
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

app.use(cors());
app.use(express.json());

app.use(async (req: Request, res: Response, next) => {
    try {
        const token = req.body.token;
        console.log('Authenticating token: ', token);
        Authenticate(token);
        next();
    } catch (error) {
        console.error('Error authenticating the token: ', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
});

app.use(async (req: Request, res: Response, next) => {
    req.db = dbService.query();
    next();
});

app.get('/', async (req: Request, res: Response) => {
    try {
        const token = await req.db.insertCaptcha();
        res.json({ token: token });
    } catch (error) {
        console.error('Error generating the image: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});