import isAuthenticatedMid from "../middleware/IsAuthenticatedMid";
import { updatePasswordSchemaValidator } from "../middleware/SchemaValidatorMiddleware";
import { verifyLoginCredentialsUpdatePasswordMid } from "../middleware/VerifyLoginCredentialsMid";
import { Request, Response, Router } from "express";
import ResponseBody from "../schema/responsebody/ResponseBody";
import UserService from "../service/UserService";
import sendResponse from "../utils/SendResponse";
import ResponseHandler from "../utils/SendResponse";

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

export default userController;
