import { NextFunction, Request, Response } from "express";
import UserSchema from "../schema/database/UserSchema";
import ResponseBody from "../schema/responsebody/ResponseBody";

async function usernameExistsHandler(username: string, req: Request, res: Response, next: NextFunction) {
    if (!(await UserSchema.exists({ username }))) {
        const body: ResponseBody = {
            status: 404,
            message: "User not found.",
            data: {},
        };

        res.status(body.status).json(body).send();
        return;
    }

    next();
}

export async function adminUpdateUsernameUserExistsMid(req: Request, res: Response, next: NextFunction) {
    await usernameExistsHandler(req.params.username, req, res, next);
}
