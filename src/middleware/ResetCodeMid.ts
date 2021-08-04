import { Request, NextFunction, Response } from "express";
import { User } from "../schema/database/UserSchema";
import UserRepository from "../repository/UserRepository";
import ResponseHandler from "../utils/ResponseHandler";

export async function resetCodeMatchesUsernameMid(req: Request, res: Response, next: NextFunction) {
    const user: User | null = await UserRepository.findOne(req.params.username);

    if (user!.resetCode !== req.params.resetcode) {
        ResponseHandler.sendUnauthorised("Invalid reset code.");
        return;
    }

    next();
}

export async function activationCodeMatchesUsernameMid(req: Request, res: Response, next: NextFunction) {
    const user: User = res.locals.user ?? (await UserRepository.findOne(req.params.username));

    if (!user) {
        ResponseHandler.sendNotFound("User not found.");
        return;
    }

    if (user.activationCode !== req.params.activationcode) {
        ResponseHandler.sendUnauthorised("Invalid activation code.");
        return;
    }

    next();
}

export async function userIsAlreadyActivatedMid(req: Request, res: Response, next: NextFunction) {
    const user: User = res.locals.user ?? (await UserRepository.findOne(req.params.username));

    if (!user.activationCode) {
        ResponseHandler.sendMethodNotAllowed("User already activated.");
        return;
    }

    next();
}
