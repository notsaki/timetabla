import { NextFunction, Request, Response } from "express";
import verifyLoginCredentials from "../utils/VerifyLoginCredentials";
import loginCredentialsErrorHandler from "../errorhandler/LoginCredentialsErrorHandler";
import LoginCredentialsBody from "../schema/requestbody/LoginCredentialsBody";

async function verifyLoginCredentialsHandler(
    loginCredentials: LoginCredentialsBody,
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        res.locals.user = await verifyLoginCredentials(loginCredentials.username, loginCredentials.password);
        next();
    } catch (error: any) {
        loginCredentialsErrorHandler(error, req, res);
    }
}

async function verifyLoginCredentialsMid(req: Request, res: Response, next: NextFunction) {
    const loginCredentials: LoginCredentialsBody = {
        username: req.body.username,
        password: req.body.password,
    };

    await verifyLoginCredentialsHandler(loginCredentials, req, res, next);
}

export async function verifyLoginCredentialsUpdatePasswordMid(req: Request, res: Response, next: NextFunction) {
    const loginCredentials: LoginCredentialsBody = {
        username: req.session.user!.username!,
        password: req.body.oldPassword,
    };

    await verifyLoginCredentialsHandler(loginCredentials, req, res, next);
}

export async function verifyLoginCredentialsAdminPasswordValidationMid(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const loginCredentials: LoginCredentialsBody = {
        username: req.session.user!.username!,
        password: req.body.adminPassword,
    };

    await verifyLoginCredentialsHandler(loginCredentials, req, res, next);
}

export default verifyLoginCredentialsMid;
