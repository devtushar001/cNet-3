import express from 'express';
import { hireMeController } from '../Controller/hireMecontroller.js';

const hireMeRouter = express.Router();

hireMeRouter.post('/hire', hireMeController);

export default hireMeRouter;
