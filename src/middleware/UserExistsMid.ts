import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../utils/ResponseHandler";
import SingletonRepository from "../SingletonRepository";

async function usernameExistsHandler(username: string, req: Request, res: Response, next: NextFunction) {
    if (!(await SingletonRepository.userRepository.exists(username))) {
        ResponseHandler.sendNotFound("User not found.");
        return;
    }

    next();
}

export async function usernameExistsMid(req: Request, res: Response, next: NextFunction) {
    await usernameExistsHandler(req.params.username, req, res, next);
}
