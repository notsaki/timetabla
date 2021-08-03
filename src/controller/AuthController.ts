import { Router, Request, Response } from "express";
import { loginCredentialsSchemaValidator } from "../middleware/SchemaValidatorMiddleware";
import isAuthenticatedMid from "../middleware/IsAuthenticatedMid";
import { Role } from "../schema/database/UserSchema";
import verifyLoginCredentialsMid from "../middleware/VerifyLoginCredentialsMid";
import ResponseHandler from "../utils/ResponseHandler";

const authController = Router();

authController.post(
    "/login",
    loginCredentialsSchemaValidator,
    verifyLoginCredentialsMid,
    async (req: Request, res: Response) => {
        req.session.user = {
            id: res.locals.user._id,
            username: req.body.username,
            role: res.locals.user.role,
            authenticated: true,
        };

        ResponseHandler.sendOk("User authenticated!");
    }
);

authController.post("/logout", isAuthenticatedMid, (req: Request, res: Response) => {
    req.session.user = {
        id: undefined,
        username: undefined,
        role: Role.Guest,
        authenticated: false,
    };

    ResponseHandler.sendOk("Logout successful!");
});

export default authController;
