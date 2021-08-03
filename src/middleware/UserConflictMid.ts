import { NextFunction, Request, Response } from "express";
import UserSchema from "../schema/database/UserSchema";
import ResponseHandler from "../utils/ResponseHandler";

async function userConflictHandler(username: string, req: Request, res: Response, next: NextFunction) {
    if (await UserSchema.exists({ username })) {
        ResponseHandler.sendConflict("Username already exists.");
        return;
    }

    next();
}

export async function adminUpdateUsernameConflictMid(req: Request, res: Response, next: NextFunction) {
    await userConflictHandler(req.body.data.newUsername, req, res, next);
}

export async function userConflictMid(req: Request, res: Response, next: NextFunction) {
    await userConflictHandler(req.body.data.username, req, res, next);
}
