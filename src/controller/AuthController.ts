import { Router, Request, Response, NextFunction } from "express";
import { loginCredentialsSchemaValidator } from "../middleware/SchemaValidatorMiddleware";
import ResponseBody from "../schema/responsebody/ResponseBody";
import isAuthenticatedMid from "../middleware/IsAuthenticatedMid";
import { Role } from "../schema/database/UserSchema";
import verifyLoginCredentialsMid from "../middleware/VerifyLoginCredentialsMid";

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

        const body: ResponseBody = {
            status: 200,
            message: "User authenticated!",
            data: {},
        };

        res.status(body.status).json(body).send();
    }
);

authController.post("/logout", isAuthenticatedMid, (req: Request, res: Response) => {
    req.session.user = {
        id: undefined,
        username: undefined,
        role: Role.Guest,
        authenticated: false,
    };

    const body: ResponseBody = {
        status: 200,
        message: "Logout successful!",
        data: {},
    };

    res.status(body.status).json(body).send();
});

export default authController;
