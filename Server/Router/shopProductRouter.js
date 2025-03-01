import express from 'express';
import { addShopProductController, getShopProductController } from '../Controller/shopProductController.js';

const shopProductRouter = express.Router();

shopProductRouter.post('/add', addShopProductController);
shopProductRouter.get('/get-all', getShopProductController);

export default shopProductRouter;