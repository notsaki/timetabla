import { NextFunction, Request, Response } from "express";
import loginCredentialsAuthMiddleware from "../auth/LoginCredentialsAuthMiddleware";
import LoginCredentials from "../../schema/requestbody/LoginCredentials";
import ResponseBody from "../../schema/responsebody/ResponseBody";

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

    const loginCredentials: LoginCredentials = {
        username: req.session.user.username!,
        password: req.body.oldPassword,
    };

    await loginCredentialsAuthMiddleware(loginCredentials, req, res, next);
}

export default updatePasswordMiddleware;
