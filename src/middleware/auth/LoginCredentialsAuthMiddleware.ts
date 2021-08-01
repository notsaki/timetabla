import { NextFunction, Request, Response } from "express";
import UserSchema, { User } from "../../schema/database/UserSchema";
import LoginCredentials from "../../schema/requestbody/LoginCredentials";
import { verify } from "../../utils/Hash";
import ResponseBody from "../../schema/responsebody/ResponseBody";
import mongoose from "mongoose";

async function loginCredentialsAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const loginCredentials: LoginCredentials = new LoginCredentials().assign(req.body);

    const user: User | null = await UserSchema.findOne({ username: loginCredentials.username });

    if (!user || !verify(loginCredentials.password, user.password)) {
        const body = new ResponseBody(401, "Invalid username or password.");

        res.status(body.status).json(body).send();
        return;
    }

    if (user.activationCode) {
        const body = new ResponseBody(
            403,
            "User not activated. Please check your email for the verification code or request for a new one."
        );

        res.status(body.status).json(body).send();
        return;
    }

    if (user.blocked) {
        const body = new ResponseBody(403, "User is blocked.");

        res.status(body.status).json(body).send();
    }

    req.body.id = user._id;

    next();
}

export default loginCredentialsAuthMiddleware;
