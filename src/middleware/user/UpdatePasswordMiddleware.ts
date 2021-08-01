import { NextFunction, Request, Response } from "express";
import loginCredentialsAuthMiddleware from "../auth/LoginCredentialsAuthMiddleware";

async function updatePasswordMiddleware(req: Request, res: Response, next: NextFunction) {
    req.body.username = req.session.user?.username;
    req.body.password = req.body.oldPassword;

    await loginCredentialsAuthMiddleware(req, res, next);
}

export default updatePasswordMiddleware;
