import { NextFunction, Request, Response } from "express";
import ResponseBody from "../../schema/responsebody/ResponseBody";
import LoginCredentialsBody from "../../schema/requestbody/LoginCredentialsBody";
import loginCredentialsAuthMiddleware from "../auth/LoginCredentialsAuthMiddleware";

async function adminPasswordValidationMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user) {
        const body: ResponseBody = {
            status: 401,
            message: "User not authorised. Please login.",
            data: {},
        };

        res.status(body.status).json(body).send();
        return;
    }

    const loginCredentials: LoginCredentialsBody = {
        username: req.session.user.username!,
        password: req.body.adminPassword,
    };

    await loginCredentialsAuthMiddleware(loginCredentials, req, res, next);
}

export default adminPasswordValidationMiddleware;
