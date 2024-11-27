import cors from 'cors';
import path from 'path';

import express from 'express';
import router from './routes/routes';
import { ALLOWED_ORIGINS } from './core/constants';
import log from './services/logger';

const app = express();

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const requestType = req.method;
  const url = req.url;

  if (url.includes('/images/')) {
    next();
    return;
  }

  if (ALLOWED_ORIGINS.includes(origin) || origin === undefined) {
    res.header('Access-Control-Allow-Origin', origin);
    next();
  } else {
    console.log('Forbidden request from: ', origin);
    res.status(403).send('Forbidden');
  }
});
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, "../public/images/")));
app.use("/", router);

export default app;