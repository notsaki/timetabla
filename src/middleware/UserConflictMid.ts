import { NextFunction, Request, Response } from "express";
import UserSchema from "../schema/database/UserSchema";
import ResponseBody from "../schema/responsebody/ResponseBody";

async function userConflictHandler(username: string, req: Request, res: Response, next: NextFunction) {
    if (await UserSchema.exists({ username })) {
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

export async function adminUpdateUsernameConflictMid(req: Request, res: Response, next: NextFunction) {
    await userConflictHandler(req.body.data.newUsername, req, res, next);
}

export async function userConflictMid(req: Request, res: Response, next: NextFunction) {
    await userConflictHandler(req.body.username, req, res, next);
}
