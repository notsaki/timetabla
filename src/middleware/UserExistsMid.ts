import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../utils/ResponseHandler";
import UserService from "../service/UserService";
import ServiceSingleton from "../singleton/ServiceSingleton";

const userService: UserService = ServiceSingleton.userService;

async function idExistsHandler(id: string, req: Request, res: Response, next: NextFunction) {
    if (!(await userService.idExists(id))) {
        ResponseHandler.sendNotFound("User not found.");
        return;
    }

    next();
}

export async function idExistsMid(req: Request, res: Response, next: NextFunction) {
    await idExistsHandler(req.params.id, req, res, next);
}
