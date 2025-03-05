import express from 'express';
import { addToCart, cartItem, getCart, removeFromCart } from '../Controller/cartController.js';
import { isAuth } from '../MiddleWares/AutheMiddleware.js';


const cartRouter = express.Router();

cartRouter.post('/add', isAuth, addToCart);
cartRouter.post('/remove', isAuth, removeFromCart);
cartRouter.get('/get', isAuth, getCart);
cartRouter.get('/get-cart', isAuth, cartItem);

export default cartRouter;