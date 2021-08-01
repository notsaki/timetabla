import { NextFunction, Request, Response } from "express";
import UserSchema from "../../schema/database/UserSchema";
import ResponseBody from "../../schema/responsebody/ResponseBody";

async function userConflictMiddleware(req: Request, res: Response, next: NextFunction) {
    if (await UserSchema.exists({ username: req.body.username })) {
        const body: ResponseBody = {
            status: 409,
            message: "Username already exists.",
            data: {},
        };

        res.status(body.status).json(body).send();
        return;
    }

    next();
}

export default userConflictMiddleware;
