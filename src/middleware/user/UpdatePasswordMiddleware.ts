import { NextFunction, Request, Response } from "express";
import ResponseBody from "../../schema/responsebody/ResponseBody";
import verifyLoginCredentials from "../../utils/VerifyLoginCredentials";
import loginCredentialsErrorHandler from "../../errorhandler/LoginCredentialsErrorHandler";
import { User } from "../../schema/database/UserSchema";

async function updatePasswordMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user) {
        const body: ResponseBody = {
            status: 401,
            message: "User not authorised. Please login.",
            data: {},
        };

        res.status(body.status).json(body).send();
        return;
    }

    try {
        res.locals.user = await verifyLoginCredentials(req.session.user.username!, req.body.oldPassword);
        next();
    } catch (error: any) {
        loginCredentialsErrorHandler(error, req, res);
    }
}

export default updatePasswordMiddleware;
