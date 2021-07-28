import { NextFunction, Request, Response } from "express";
import UserSchema from "../schema/UserSchema";

async function userConflictMiddleware(req: Request, res: Response, next: NextFunction) {
    if (await UserSchema.exists({ username: req.body.username })) {
        res.status(409).send();
        return;
    }

    next();
}

export default userConflictMiddleware;
