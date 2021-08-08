import { Router } from "express";
import authController from "./controller/AuthController";
import adminController from "./controller/admincontroller/AdminController";
import isAuthenticatedMid from "./middleware/IsAuthenticatedMid";
import { verifyLoginCredentialsAdminPasswordValidationMid } from "./middleware/VerifyLoginCredentialsMid";
import { adminRoleAuthMid } from "./middleware/RoleAuthMid";
import { adminRequestBodySchemaValidator } from "./middleware/SchemaValidatorMiddleware";
import userController from "./controller/UserController";
import courseController from "./controller/CourseController";

const apiController: Router = Router();

apiController.use("/auth", authController);
apiController.use(
    "/admin",
    isAuthenticatedMid,
    adminRoleAuthMid,
    adminRequestBodySchemaValidator,
    verifyLoginCredentialsAdminPasswordValidationMid,
    adminController
);
apiController.use("/user", userController);
apiController.use("/course", courseController);

export default apiController;
