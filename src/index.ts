import { QueryType } from './core/types';
import { DatabaseService } from './services/database_service';

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

app.use(async (req: Request, res: Response, next) => {
    req.db = dbService.query();
    next();
});

app.get('/', async (req: Request, res: Response) => {
    await req.db.insertCaptcha('ACG369CF');
    res.json({ message: 'Image generated' });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});