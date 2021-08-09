import { Router } from "express";
import adminUserController from "./AdminUserController";
import adminCourseController from "./AdminCourseController";
import { adminRequestBodySchemaValidator } from "../../middleware/SchemaValidatorMiddleware";
import { verifyLoginCredentialsAdminPasswordValidationMid } from "../../middleware/VerifyLoginCredentialsMid";

const adminController = Router();

adminController.use(
    "/user",
    adminRequestBodySchemaValidator,
    verifyLoginCredentialsAdminPasswordValidationMid,
    adminUserController
);
adminController.use("/course", adminCourseController);

export default adminController;
