import { Router } from "express";
import userController from "./controller/UserController";
import authController from "./controller/AuthController";
import adminController from "./controller/AdminController";
import adminRoleAuthMiddleware from "./middleware/admin/AdminRoleAuthMiddleware";
import isAuthenticatedMid from "./middleware/auth/IsAuthenticatedMid";
import adminPasswordValidationMiddleware from "./middleware/admin/AdminPasswordValidationMiddleware";
import { adminRequestBodyValidator } from "./middleware/ValidatorMiddleware";

const apiController: Router = Router();

apiController.use("/user", userController);
apiController.use("/auth", authController);
apiController.use(
    "/admin",
    isAuthenticatedMid,
    adminRoleAuthMiddleware,
    adminRequestBodyValidator,
    adminPasswordValidationMiddleware,
    adminController
);

export default apiController;
