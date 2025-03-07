import express from "express";
import { createRazorPayOrderController, getUserOrderController, verifyRazorPayOrderController } from "../Controller/razorPayController.js";
import { isAuth } from "../MiddleWares/AutheMiddleware.js";

const razorPayRouter = express.Router();

razorPayRouter.post('/create-order', isAuth, createRazorPayOrderController);
razorPayRouter.post('/verify-order', isAuth ,verifyRazorPayOrderController);
razorPayRouter.get('/get-order', isAuth, getUserOrderController);

export default razorPayRouter;