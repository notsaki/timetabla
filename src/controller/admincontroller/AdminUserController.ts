import { Request, Response, Router } from "express";
import {
    adminBlockUserSchemaValidator,
    adminUpdateEmailSchemaValidator,
    adminUpdateFullnameSchemaValidator,
    adminUpdatePasswordSchemaValidator,
    adminUpdateRoleSchemaValidator,
    adminUpdateUsernameSchemaValidator,
    userSchemaValidator,
} from "../../middleware/SchemaValidatorMiddleware";
import { User } from "../../schema/database/UserSchema";
import { adminUpdateUsernameConflictMid, userConflictMid } from "../../middleware/UserConflictMid";
import { idExistsMid } from "../../middleware/UserExistsMid";
import { adminUpdateUserAuthorisedRoleMid, userCreationAuthorisedRoleMid } from "../../middleware/AuthorisedRoleMid";
import ResponseHandler from "../../utils/ResponseHandler";
import Mailer from "../../utils/Mailer";
import UserService from "../../service/UserService";
import ServiceSingleton from "../../singleton/ServiceSingleton";
import RegisterUserBody from "../../schema/requestbody/RegisterUserBody";

const userService: UserService = ServiceSingleton.userService;

const adminUserController = Router();

adminUserController.post(
    "/",
    userSchemaValidator,
    userCreationAuthorisedRoleMid,
    userConflictMid,
    async function (req: Request, res: Response) {
        const userData: RegisterUserBody = req.body.data;

        try {
            const user: User = await userService.saveOne(userData);

            userService.findById(user._id!).then((user: User | null) => {
                Mailer.sendVerificationEmail(user!.email, user!.username, user!.activationCode!);
            });

            ResponseHandler.sendResponse(201, "User created successfully!");
        } catch (error: any) {
            ResponseHandler.sendInternalServerError();
            console.log(error);
            return;
        }
    }
);

adminUserController.delete(
    "/:id",
    idExistsMid,
    adminUpdateUserAuthorisedRoleMid,
    async function (req: Request, res: Response) {
        try {
            await userService.deleteOne(req.params.id);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError();
            return;
        }

        ResponseHandler.sendOk("User deleted successfully!");
    }
);

adminUserController.put(
    "/:id/username",
    adminUpdateUsernameSchemaValidator,
    idExistsMid,
    adminUpdateUserAuthorisedRoleMid,
    adminUpdateUsernameConflictMid,
    async function (req: Request, res: Response) {
        try {
            await userService.updateUsername(req.params.id, req.body.data.newUsername);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError();
            return;
        }

        ResponseHandler.sendOk("Username updated successfully!");
    }
);

adminUserController.put(
    "/:id/fullname",
    adminUpdateFullnameSchemaValidator,
    idExistsMid,
    adminUpdateUserAuthorisedRoleMid,
    async function (req: Request, res: Response) {
        try {
            await userService.updateFullname(req.params.id, req.body.data.newFullname);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError();
            return;
        }

        ResponseHandler.sendOk("Fullname updated successfully!");
    }
);

adminUserController.put(
    "/:id/password",
    adminUpdatePasswordSchemaValidator,
    idExistsMid,
    adminUpdateUserAuthorisedRoleMid,
    async function (req: Request, res: Response) {
        try {
            await userService.updatePassword(req.params.id, req.body.data.newPassword);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError();
            return;
        }

        ResponseHandler.sendOk("Password updated successfully!");
    }
);

adminUserController.put(
    "/:id/email",
    adminUpdateEmailSchemaValidator,
    idExistsMid,
    adminUpdateUserAuthorisedRoleMid,
    async function (req: Request, res: Response) {
        try {
            await userService.updateEmail(req.params.id, req.body.data.newEmail);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError();
            return;
        }

        ResponseHandler.sendOk("Email updated successfully!");
    }
);

adminUserController.put(
    "/:id/role",
    adminUpdateRoleSchemaValidator,
    idExistsMid,
    adminUpdateUserAuthorisedRoleMid,
    async function (req: Request, res: Response) {
        try {
            await userService.updateRole(req.params.id, req.body.data.newRole);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError();
            return;
        }

        ResponseHandler.sendOk("Role updated successfully!");
    }
);

adminUserController.put(
    "/:id/block",
    adminBlockUserSchemaValidator,
    idExistsMid,
    adminUpdateUserAuthorisedRoleMid,
    async function (req: Request, res: Response) {
        const blocked: boolean = req.body.data.block;

        try {
            await userService.updateBlocked(req.params.id, blocked);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError();
            return;
        }

        ResponseHandler.sendOk(`User ${blocked ? "" : "un"}blocked successfully`);
    }
);

export default adminUserController;
