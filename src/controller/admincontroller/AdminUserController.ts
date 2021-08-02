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
import UserService from "../../service/UserService";
import { adminUpdateUsernameConflictMid, userConflictMid } from "../../middleware/UserConflictMid";
import { adminUpdateUsernameUserExistsMid } from "../../middleware/UserExistsMid";
import {
    adminUpdateUpdateUserAuthorisedRoleMid,
    userCreationAuthorisedRoleMid,
} from "../../middleware/AuthorisedRoleMid";
import ResponseHandler from "../../utils/SendResponse";

const adminUserController = Router();

adminUserController.post(
    "/",
    userSchemaValidator,
    userCreationAuthorisedRoleMid,
    userConflictMid,
    async (req: Request, res: Response) => {
        const user: User = req.body.data;

        try {
            await UserService.saveNew(user);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError(res);
            console.log(error);
            return;
        }

        ResponseHandler.sendResponse(res, 201, "User created successfully!");
    }
);

adminUserController.put(
    "/:username/username",
    adminUpdateUsernameSchemaValidator,
    adminUpdateUsernameUserExistsMid,
    adminUpdateUpdateUserAuthorisedRoleMid,
    adminUpdateUsernameConflictMid,
    async (req: Request, res: Response) => {
        try {
            await UserService.updateUsername(req.params.username, req.body.data.newUsername);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError(res);
            return;
        }

        ResponseHandler.sendOk(res, "Username updated successfully!");
    }
);

adminUserController.put(
    "/:username/fullname",
    adminUpdateFullnameSchemaValidator,
    adminUpdateUsernameUserExistsMid,
    adminUpdateUpdateUserAuthorisedRoleMid,
    async (req: Request, res: Response) => {
        try {
            await UserService.updateFullname(req.params.username, req.body.data.newFullname);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError(res);
            return;
        }

        ResponseHandler.sendOk(res, "Fullname updated successfully!");
    }
);

adminUserController.put(
    "/:username/password",
    adminUpdatePasswordSchemaValidator,
    adminUpdateUsernameUserExistsMid,
    adminUpdateUpdateUserAuthorisedRoleMid,
    async (req: Request, res: Response) => {
        try {
            await UserService.updatePassword(req.params.username, req.body.data.newPassword);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError(res);
            return;
        }

        ResponseHandler.sendOk(res, "Password updated successfully!");
    }
);

adminUserController.put(
    "/:username/email",
    adminUpdateEmailSchemaValidator,
    adminUpdateUsernameUserExistsMid,
    adminUpdateUpdateUserAuthorisedRoleMid,
    async (req: Request, res: Response) => {
        try {
            await UserService.updateEmail(req.params.username, req.body.data.newEmail);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError(res);
            return;
        }

        ResponseHandler.sendOk(res, "Email updated successfully!");
    }
);

adminUserController.put(
    "/:username/role",
    adminUpdateRoleSchemaValidator,
    adminUpdateUsernameUserExistsMid,
    adminUpdateUpdateUserAuthorisedRoleMid,
    async (req: Request, res: Response) => {
        try {
            await UserService.updateRole(req.params.username, req.body.data.newRole);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError(res);
            return;
        }

        ResponseHandler.sendOk(res, "Role updated successfully!");
    }
);

adminUserController.put(
    "/:username/block",
    adminBlockUserSchemaValidator,
    adminUpdateUsernameUserExistsMid,
    adminUpdateUpdateUserAuthorisedRoleMid,
    async (req: Request, res: Response) => {
        const blocked: boolean = req.body.data.block;

        try {
            await UserService.updateBlocked(req.params.username, blocked);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError(res);
            return;
        }

        ResponseHandler.sendOk(res, `User ${blocked ? "" : "un"}blocked successfully`);
    }
);

export default adminUserController;
