import { NextFunction, Request, Response } from "express";
import UserSchema from "../schema/database/UserSchema";
import ResponseBody from "../schema/responsebody/ResponseBody";
import sendResponse from "../utils/SendResponse";
import ResponseHandler from "../utils/SendResponse";

async function usernameExistsHandler(username: string, req: Request, res: Response, next: NextFunction) {
    if (!(await UserSchema.exists({ username }))) {
        ResponseHandler.sendNotFound(res, "User not found.");
        return;
    }

    next();
}

export async function usernameExistsMid(req: Request, res: Response, next: NextFunction) {
    await usernameExistsHandler(req.params.username, req, res, next);
}
