import express from "express";
import { saveTextEditorController,getTextEditorController, deleteTextEditorController } from "../Controller/textEditorController.js";


const textEditorRouter = express.Router();

textEditorRouter.post("/save", saveTextEditorController);
textEditorRouter.get("/get", getTextEditorController);
textEditorRouter.post("/delete", deleteTextEditorController);

export default textEditorRouter;
