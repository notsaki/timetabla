import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../utils/ResponseHandler";
import UserService from "../service/UserService";
import ServiceSingleton from "../singleton/ServiceSingleton";

const userService: UserService = ServiceSingleton.userService;

async function userConflictHandler(username: string, req: Request, res: Response, next: NextFunction) {
    if (await userService.usernameExists(username)) {
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
