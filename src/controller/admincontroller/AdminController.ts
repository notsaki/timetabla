import { Router } from "express";
import adminUserController from "./AdminUserController";

const adminController = Router();

adminController.use("/user", adminUserController);

export default adminController;
