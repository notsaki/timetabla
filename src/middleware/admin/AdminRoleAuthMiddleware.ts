import { Request, Response, NextFunction } from "express";
import roleAuthMiddleware from "../RoleAuthMiddleware";
import { Role } from "../../schema/database/UserSchema";

function adminRoleAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    roleAuthMiddleware(Role.Admin, req, res, next);
}

export default adminRoleAuthMiddleware;
