import { Request, NextFunction, Response } from "express";
import { User } from "../schema/database/UserSchema";
import ResponseHandler from "../utils/ResponseHandler";
import UserService from "../service/UserService";
import ServiceSingleton from "../singleton/ServiceSingleton";

const userService: UserService = ServiceSingleton.userService;

export async function resetCodeMatchesUsernameMid(req: Request, res: Response, next: NextFunction) {
    try {
        const user: User | null = await userService.findById(req.params.id);

        if (user!.resetCode !== req.params.resetcode) {
            ResponseHandler.sendUnauthorised("Invalid reset code.");
            return;
        }

        next();
    } catch (error: any) {
        ResponseHandler.sendNotFound("User not found.");
    }
}

export async function activationCodeMatchesUsernameMid(req: Request, res: Response, next: NextFunction) {
    try {
        const user: User = res.locals.user ?? (await userService.findById(req.params.id));

        if (user.activationCode !== req.params.activationcode) {
            ResponseHandler.sendUnauthorised("Invalid activation code.");
            return;
        }

        next();
    } catch (error) {
        ResponseHandler.sendNotFound("User not found.");
    }
}

export async function userIsAlreadyActivatedMid(req: Request, res: Response, next: NextFunction) {
    const user: User = res.locals.user ?? (await userService.findById(req.params.id));

    if (!user.activationCode) {
        ResponseHandler.sendMethodNotAllowed("User already activated.");
        return;
    }

    next();
}
