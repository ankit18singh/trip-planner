/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { tripRouter } from './app/trip/routers/trip.router';


const app = express();
app.use(cors())
app.use(express.json({ limit: '200mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.text())

app.use('/trip', tripRouter)

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
