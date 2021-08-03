import isAuthenticatedMid from "../middleware/IsAuthenticatedMid";
import { passwordResetSchemaValidator, updatePasswordSchemaValidator } from "../middleware/SchemaValidatorMiddleware";
import { verifyLoginCredentialsUpdatePasswordMid } from "../middleware/VerifyLoginCredentialsMid";
import { Request, Response, Router } from "express";
import UserService from "../service/UserService";
import ResponseHandler from "../utils/SendResponse";
import { User } from "../schema/database/UserSchema";
import Mailer from "../utils/Mailer";
import { activationCodeMatchesUsernameMid, resetCodeMatchesUsernameMid } from "../middleware/CodeMatchesUserMid";
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
            ResponseHandler.sendInternalServerError(res);

            console.log(error);
        }

        ResponseHandler.sendOk(res, "Password updated successfully!");
    }
);

userController.get(
    "/:username/activate/:activationcode",
    activationCodeMatchesUsernameMid,
    async (req: Request, res: Response) => {
        try {
            await UserService.resetActivationCode(req.params.username);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError(res);

            console.log(error);
        }

        ResponseHandler.sendOk(res, "User activated successfully!");
    }
);

userController.post("/:username/reset", usernameExistsMid, async (req: Request, res: Response) => {
    const username: string = req.params.username;

    try {
        await UserService.createResetCode(username);
    } catch (error: any) {
        ResponseHandler.sendInternalServerError(res);
        return;
    }

    UserService.findOne(username).then((user: User | null) => {
        Mailer.sendPasswordResetEmail(user!.email, user!.username, user!.resetCode!);
    });

    ResponseHandler.sendOk(res, "Email for password reset has been sent.");
});

userController.put(
    "/:username/reset/:resetcode",
    passwordResetSchemaValidator,
    resetCodeMatchesUsernameMid,
    async (req: Request, res: Response) => {
        try {
            await UserService.resetResetCode(req.params.username);
            await UserService.updatePassword(req.params.username, req.body.newPassword);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError(res);
            return;
        }

        ResponseHandler.sendOk(res, "Password has been reset.");
    }
);

export default userController;
