import express from 'express';
import { createShopCategoryController, deleteShopCategoryController, getShopCategoryController } from '../Controller/shopCategoryController.js';

const shopCategoryRouter = express.Router();

shopCategoryRouter.post('/create', createShopCategoryController);
shopCategoryRouter.get('/get-all', getShopCategoryController);
shopCategoryRouter.post('/delete', deleteShopCategoryController)


export default shopCategoryRouter;