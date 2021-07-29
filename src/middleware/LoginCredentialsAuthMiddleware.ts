import { NextFunction, Request, Response } from "express";
import UserSchema, { LoginCredentials, User } from "../schema/UserSchema";
import { verify } from "../utils/Hash";

async function loginCredentialsAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const loginCredentials: LoginCredentials = new LoginCredentials().assign(req.body);

    const user: User | null = await UserSchema.findOne({ username: loginCredentials.username });

    if (!user || !verify(loginCredentials.password, user.password)) {
        res.status(401).send();
        return;
    }

    if (user.activationCode || user.blocked) {
        res.status(403).send();
        return;
    }

    req.body.id = user._id;

    next();
}

export default loginCredentialsAuthMiddleware;
