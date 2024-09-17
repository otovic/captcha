import cors from 'cors';
import path from 'path';

import express from 'express';
import router from './routes/routes';
import { ALLOWED_ORIGINS } from './core/constants';
import log from './services/logger';

const app = express();

const corOptions = {
  origin: true,
  optionsSuccessStatus: 200,
};

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (ALLOWED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    next();
  } else {
    res.status(403).send('Forbidden');
  }
});

app.use(cors(corOptions));
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public/images/")));
app.use("/", router);

export default app;