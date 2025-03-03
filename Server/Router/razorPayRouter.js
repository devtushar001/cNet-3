import express from "express";
import { createRazorPayOrderController, verifyRazorPayOrderController } from "../Controller/razorPayController.js";
import { isAuth } from "../MiddleWares/AutheMiddleware.js";

const razorPayRouter = express.Router();

razorPayRouter.post('/create-order', isAuth, createRazorPayOrderController);
razorPayRouter.post('/verify-order', verifyRazorPayOrderController);

export default razorPayRouter;