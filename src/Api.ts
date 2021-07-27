import { Router } from "express";
import userController from "./controller/UserController";

const apiController: Router = Router();

apiController.use("/user", userController);

export default apiController;
