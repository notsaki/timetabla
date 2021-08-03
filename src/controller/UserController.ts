import isAuthenticatedMid from "../middleware/IsAuthenticatedMid";
import { passwordResetSchemaValidator, updatePasswordSchemaValidator } from "../middleware/SchemaValidatorMiddleware";
import { verifyLoginCredentialsUpdatePasswordMid } from "../middleware/VerifyLoginCredentialsMid";
import { Request, Response, Router } from "express";
import UserService from "../service/UserService";
import ResponseHandler from "../utils/SendResponse";
import { User } from "../schema/database/UserSchema";
import Mailer from "../utils/Mailer";
import {
    activationCodeMatchesUsernameMid,
    resetCodeMatchesUsernameMid,
    userIsAlreadyActivatedMid,
} from "../middleware/ResetCodeMid";
import { usernameExistsMid } from "../middleware/UserExistsMid";

const userController = Router();

userController.put(
    "/password",
    isAuthenticatedMid,
    updatePasswordSchemaValidator,
    verifyLoginCredentialsUpdatePasswordMid,
    async (req: Request, res: Response) => {
        try {
            await UserService.updatePassword(req.session.user!.username!, req.body.newPassword);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError();

            console.log(error);
        }

        ResponseHandler.sendOk("Password updated successfully!");
    }
);

userController.get(
    "/:username/activate/:activationcode",
    usernameExistsMid,
    userIsAlreadyActivatedMid,
    activationCodeMatchesUsernameMid,
    async (req: Request, res: Response) => {
        try {
            await UserService.resetActivationCode(req.params.username);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError();

            console.log(error);
        }

        ResponseHandler.sendOk("User activated successfully!");
    }
);

userController.post("/:username/reset", usernameExistsMid, async (req: Request, res: Response) => {
    const username: string = req.params.username;

    try {
        await UserService.createResetCode(username);
    } catch (error: any) {
        ResponseHandler.sendInternalServerError();
        return;
    }

    UserService.findOne(username).then((user: User | null) => {
        Mailer.sendPasswordResetEmail(user!.email, user!.username, user!.resetCode!);
    });

    ResponseHandler.sendOk("Email for password reset has been sent.");
});

userController.post(
    "/:username/reset/:resetcode",
    usernameExistsMid,
    passwordResetSchemaValidator,
    resetCodeMatchesUsernameMid,
    async (req: Request, res: Response) => {
        try {
            await UserService.resetResetCode(req.params.username);
            await UserService.updatePassword(req.params.username, req.body.newPassword);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError();
            return;
        }

        ResponseHandler.sendOk("Password has been reset.");
    }
);

export default userController;
