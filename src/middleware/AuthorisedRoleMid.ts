import { NextFunction, Request, Response } from "express";
import UserSchema, { Role, User } from "../schema/database/UserSchema";
import ResponseHandler from "../utils/SendResponse";
import roleAuthMid from "./RoleAuthMid";

export function userCreationAuthorisedRoleMid(req: Request, res: Response, next: NextFunction) {
    const userRole: Role = req.body.data.role;

    roleAuthMid(userRole + 1, req, res, next);
}

export async function adminUpdateUpdateUserAuthorisedRoleMid(req: Request, res: Response, next: NextFunction) {
    try {
        const user: User | null = await UserSchema.findOne({ username: req.params.username });
        roleAuthMid(user!.role + 1, req, res, next);
    } catch (error: any) {
        ResponseHandler.sendInternalServerError();
        return;
    }
}
