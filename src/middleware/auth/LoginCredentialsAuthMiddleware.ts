import { NextFunction, Request, Response } from "express";
import UserSchema, { User } from "../../schema/database/UserSchema";
import LoginCredentialsBody from "../../schema/requestbody/LoginCredentialsBody";
import { verify } from "../../utils/Hash";
import ResponseBody from "../../schema/responsebody/ResponseBody";

async function loginCredentialsAuthMiddleware(
    loginCredentials: LoginCredentialsBody,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const user: User | null = await UserSchema.findOne({ username: loginCredentials.username });

    if (!user || !verify(loginCredentials.password, user.password)) {
        const body: ResponseBody = {
            status: 401,
            message: "Invalid username or password.",
            data: {},
        };

        res.status(body.status).json(body).send();
        return;
    }

    if (user.activationCode) {
        const body: ResponseBody = {
            status: 403,
            message: "User not activated. Please check your email for the verification code or request for a new one.",
            data: {},
        };

        res.status(body.status).json(body).send();
        return;
    }

    if (user.blocked) {
        const body: ResponseBody = {
            status: 403,
            message: "User is blocked.",
            data: {},
        };

        res.status(body.status).json(body).send();
    }

    res.locals.user = user;

    next();
}

export default loginCredentialsAuthMiddleware;
