import { NextFunction, Request, Response } from "express";
import { Role, User } from "../schema/database/UserSchema";
import ResponseHandler from "../utils/ResponseHandler";
import roleAuthMid from "./RoleAuthMid";
import ServiceSingleton from "../singleton/ServiceSingleton";
import UserService from "../service/UserService";

const userService: UserService = ServiceSingleton.userService;

export function userCreationAuthorisedRoleMid(req: Request, res: Response, next: NextFunction) {
    const userRole: Role = req.body.data.role;

    roleAuthMid(userRole + 1, req, res, next);
}

export async function adminUpdateUserAuthorisedRoleMid(req: Request, res: Response, next: NextFunction) {
    try {
        const user: User | null = await userService.findById(req.params.id);
        roleAuthMid(user!.role + 1, req, res, next);
    } catch (error: any) {
        ResponseHandler.sendInternalServerError();
        return;
    }
}
