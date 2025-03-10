import express from 'express';
import { addShopProductController, deleteShopProductController, getShopProductController, getSingleShopProductController } from '../Controller/shopProductController.js';
import { isAuth } from '../MiddleWares/AutheMiddleware.js';

const shopProductRouter = express.Router();

shopProductRouter.post('/add', addShopProductController);
shopProductRouter.get('/get-all', getShopProductController);
shopProductRouter.get('/get-single', getSingleShopProductController);
shopProductRouter.post('/delete', deleteShopProductController)

export default shopProductRouter;