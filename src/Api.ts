import { Router } from "express";
import userController from "./controller/UserController";
import authController from "./controller/AuthController";
import adminController from "./controller/AdminController";
import isAuthenticatedMid from "./middleware/IsAuthenticatedMid";
import { verifyLoginCredentialsAdminPasswordValidationMid } from "./middleware/VerifyLoginCredentialsMid";
import { adminRoleAuthMid } from "./middleware/RoleAuthMid";
import { adminRequestBodySchemaValidator } from "./middleware/SchemaValidatorMiddleware";

const apiController: Router = Router();

apiController.use("/user", userController);
apiController.use("/auth", authController);
apiController.use(
    "/admin",
    isAuthenticatedMid,
    adminRoleAuthMid,
    adminRequestBodySchemaValidator,
    verifyLoginCredentialsAdminPasswordValidationMid,
    adminController
);

export default apiController;
