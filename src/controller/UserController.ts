import isAuthenticatedMid from "../middleware/IsAuthenticatedMid";
import { passwordResetSchemaValidator, updatePasswordSchemaValidator } from "../middleware/SchemaValidatorMiddleware";
import { verifyLoginCredentialsUpdatePasswordMid } from "../middleware/VerifyLoginCredentialsMid";
import { Request, Response, Router } from "express";
import ResponseHandler from "../utils/ResponseHandler";
import { User } from "../schema/database/UserSchema";
import Mailer from "../utils/Mailer";
import {
    activationCodeMatchesUsernameMid,
    resetCodeMatchesUsernameMid,
    userIsAlreadyActivatedMid,
} from "../middleware/ResetCodeMid";
import { idExistsMid } from "../middleware/UserExistsMid";
import UserService from "../service/UserService";
import ServiceSingleton from "../singleton/ServiceSingleton";

const userService: UserService = ServiceSingleton.userService;

const userController = Router();

userController.put(
    "/password",
    isAuthenticatedMid,
    updatePasswordSchemaValidator,
    verifyLoginCredentialsUpdatePasswordMid,
    async (req: Request, res: Response) => {
        try {
            await userService.updatePassword(req.session.user!.id!, req.body.newPassword);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError();
            console.log(error);
        }

        ResponseHandler.sendOk("Password updated successfully!");
    }
);

userController.get(
    "/:id/activate/:activationcode",
    idExistsMid,
    userIsAlreadyActivatedMid,
    activationCodeMatchesUsernameMid,
    async (req: Request, res: Response) => {
        try {
            await userService.resetActivationCode(req.params.id);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError();

            console.log(error);
        }

        ResponseHandler.sendOk("User activated successfully!");
    }
);

userController.post("/:id/reset", idExistsMid, async (req: Request, res: Response) => {
    const id: string = req.params.id;

    try {
        await userService.createResetCode(id);
    } catch (error: any) {
        ResponseHandler.sendInternalServerError();
        return;
    }

    userService.findById(id).then((user: User | null) => {
        Mailer.sendPasswordResetEmail(user!.email, user!.username, user!.resetCode!);
    });

    ResponseHandler.sendOk("Email for password reset has been sent.");
});

userController.post(
    "/:id/reset/:resetcode",
    idExistsMid,
    passwordResetSchemaValidator,
    resetCodeMatchesUsernameMid,
    async (req: Request, res: Response) => {
        try {
            await userService.resetResetCode(req.params.id);
            await userService.updatePassword(req.params.id, req.body.newPassword);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError();
            return;
        }

        ResponseHandler.sendOk("Password has been reset.");
    }
);

export default userController;
