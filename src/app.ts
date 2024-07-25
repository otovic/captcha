import { authenticate } from './middlewares/auth_middleware';
import cors from 'cors';
import path from 'path';

import express, { Request, Response } from 'express';
import { corsOptions } from './core/cors';
import router from './routes/routes';
import { initDatabase } from './services/database_service';
const app = express();

initDatabase();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public/images/")));
app.use("/", router);

export default app;