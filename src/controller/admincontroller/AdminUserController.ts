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
import { usernameExistsMid } from "../../middleware/UserExistsMid";
import {
    adminUpdateUpdateUserAuthorisedRoleMid,
    userCreationAuthorisedRoleMid,
} from "../../middleware/AuthorisedRoleMid";
import ResponseHandler from "../../utils/ResponseHandler";
import Mailer from "../../utils/Mailer";
import SingletonRepository from "../../SingletonRepository";
import UserRepository from "../../repository/UserRepository";

const userRepository: UserRepository = SingletonRepository.userRepository;

const adminUserController = Router();

adminUserController.post(
    "/",
    userSchemaValidator,
    userCreationAuthorisedRoleMid,
    userConflictMid,
    async function (req: Request, res: Response) {
        const user: User = req.body.data;

        try {
            await userRepository.saveOne(user);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError();
            console.log(error);
            return;
        }

        userRepository.findOne(user.username).then((user: User | null) => {
            Mailer.sendVerificationEmail(user!.email, user!.username, user!.activationCode!);
        });

        ResponseHandler.sendResponse(201, "User created successfully!");
    }
);

adminUserController.delete(
    "/:username",
    usernameExistsMid,
    adminUpdateUpdateUserAuthorisedRoleMid,
    async function (req: Request, res: Response) {
        try {
            await userRepository.deleteOne(req.params.username);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError();
            return;
        }

        ResponseHandler.sendOk("User deleted successfully!");
    }
);

adminUserController.put(
    "/:username/username",
    adminUpdateUsernameSchemaValidator,
    usernameExistsMid,
    adminUpdateUpdateUserAuthorisedRoleMid,
    adminUpdateUsernameConflictMid,
    async function (req: Request, res: Response) {
        try {
            await userRepository.updateUsername(req.params.username, req.body.data.newUsername);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError();
            return;
        }

        ResponseHandler.sendOk("Username updated successfully!");
    }
);

adminUserController.put(
    "/:username/fullname",
    adminUpdateFullnameSchemaValidator,
    usernameExistsMid,
    adminUpdateUpdateUserAuthorisedRoleMid,
    async function (req: Request, res: Response) {
        try {
            await userRepository.updateFullname(req.params.username, req.body.data.newFullname);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError();
            return;
        }

        ResponseHandler.sendOk("Fullname updated successfully!");
    }
);

adminUserController.put(
    "/:username/password",
    adminUpdatePasswordSchemaValidator,
    usernameExistsMid,
    adminUpdateUpdateUserAuthorisedRoleMid,
    async function (req: Request, res: Response) {
        try {
            await userRepository.updatePassword(req.params.username, req.body.data.newPassword);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError();
            return;
        }

        ResponseHandler.sendOk("Password updated successfully!");
    }
);

adminUserController.put(
    "/:username/email",
    adminUpdateEmailSchemaValidator,
    usernameExistsMid,
    adminUpdateUpdateUserAuthorisedRoleMid,
    async function (req: Request, res: Response) {
        try {
            await userRepository.updateEmail(req.params.username, req.body.data.newEmail);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError();
            return;
        }

        ResponseHandler.sendOk("Email updated successfully!");
    }
);

adminUserController.put(
    "/:username/role",
    adminUpdateRoleSchemaValidator,
    usernameExistsMid,
    adminUpdateUpdateUserAuthorisedRoleMid,
    async function (req: Request, res: Response) {
        try {
            await userRepository.updateRole(req.params.username, req.body.data.newRole);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError();
            return;
        }

        ResponseHandler.sendOk("Role updated successfully!");
    }
);

adminUserController.put(
    "/:username/block",
    adminBlockUserSchemaValidator,
    usernameExistsMid,
    adminUpdateUpdateUserAuthorisedRoleMid,
    async function (req: Request, res: Response) {
        const blocked: boolean = req.body.data.block;

        try {
            await userRepository.updateBlocked(req.params.username, blocked);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError();
            return;
        }

        ResponseHandler.sendOk(`User ${blocked ? "" : "un"}blocked successfully`);
    }
);

export default adminUserController;
