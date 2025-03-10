import express from "express";
import { createWebAppController, deleteWebAppController, getAllWebAppsController, getWebAppByIdController } from "../Controller/webAppControllers.js";

const webAppRouter = express.Router();

webAppRouter.post('/create', createWebAppController);
webAppRouter.get('/get-all', getAllWebAppsController);
webAppRouter.post('/delete', deleteWebAppController);
webAppRouter.get('/get-single', getWebAppByIdController);


export default webAppRouter;