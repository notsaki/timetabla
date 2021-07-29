import { Router } from "express";
import userController from "./controller/UserController";
import authController from "./controller/AuthController";

const apiController: Router = Router();

apiController.use("/user", userController);
apiController.use("/auth", authController);

export default apiController;
