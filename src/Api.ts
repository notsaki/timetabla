import { Router } from "express";
import authController from "./controller/AuthController";
import adminController from "./controller/admincontroller/AdminController";
import isAuthenticatedMid from "./middleware/IsAuthenticatedMid";
import { adminRoleAuthMid } from "./middleware/RoleAuthMid";
import userController from "./controller/UserController";
import adminCourseController from "./controller/admincontroller/AdminCourseController";

const apiController: Router = Router();

apiController.use("/auth", authController);
apiController.use("/admin", isAuthenticatedMid, adminRoleAuthMid, adminController);
apiController.use("/user", userController);
apiController.use("/course", adminCourseController);

export default apiController;
