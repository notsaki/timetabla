import { NextFunction, Request, Response } from "express";
import { Role } from "../schema/database/UserSchema";
import roleAuthenticator from "../utils/RoleAuthenticator";
import ResponseHandler from "../utils/SendResponse";

export function adminRoleAuthMid(req: Request, res: Response, next: NextFunction) {
    roleAuthMid(Role.Admin, req, res, next);
}

export function professorRoleAuthMid(req: Request, res: Response, next: NextFunction) {
    roleAuthMid(Role.Professor, req, res, next);
}

export function studentRoleAuthMid(req: Request, res: Response, next: NextFunction) {
    roleAuthMid(Role.Student, req, res, next);
}

function roleAuthMid(role: Role, req: Request, res: Response, next: NextFunction) {
    if (!roleAuthenticator(req.session.user!.role, role)) {
        ResponseHandler.sendUnauthorised("User's role is not authorised for this request.");
        return;
    }

    next();
}

export default roleAuthMid;
