import { NextFunction, Request, Response } from "express";
import verifyLoginCredentials from "../utils/VerifyLoginCredentials";
import LoginCredentialsBody from "../schema/requestbody/LoginCredentialsBody";
import getErrorCode from "../utils/GetErrorCode";
import ErrorCode from "../schema/ErrorCode";
import ResponseHandler from "../utils/ResponseHandler";

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
        switch (getErrorCode(error)) {
            case ErrorCode.BlockedUser:
                ResponseHandler.sendForbidden("User is blocked.");
                return;
            case ErrorCode.InvalidPassword:
            case ErrorCode.EntityNotFound:
                ResponseHandler.sendUnauthorised("Invalid username or password.");
                return;
            case ErrorCode.UserNotVerified:
                ResponseHandler.sendForbidden(
                    "User not activated. Please check your email for the verification code or request for a new one."
                );
                return;
            default:
                ResponseHandler.sendInternalServerError();
                return;
        }
    }
}

async function verifyLoginCredentialsMid(req: Request, res: Response, next: NextFunction) {
    const loginCredentials: LoginCredentialsBody = req.body;

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
