import { NextFunction, Request, Response } from "express";
import verifyLoginCredentials from "../../utils/VerifyLoginCredentials";
import loginCredentialsErrorHandler from "../../errorhandler/LoginCredentialsErrorHandler";

async function loginCredentialsVerifyMid(req: Request, res: Response, next: NextFunction) {
    try {
        res.locals.user = await verifyLoginCredentials(req.body.username, req.body.password);

        next();
    } catch (error: any) {
        loginCredentialsErrorHandler(error, req, res);
    }
}

export default loginCredentialsVerifyMid;
