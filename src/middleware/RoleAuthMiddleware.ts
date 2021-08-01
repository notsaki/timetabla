import { NextFunction, Request, Response } from "express";
import { Role } from "../schema/database/UserSchema";
import ResponseBody from "../schema/responsebody/ResponseBody";
import roleAuthenticator from "../utils/RoleAuthenticator";

function roleAuthMiddleware(role: Role, req: Request, res: Response, next: NextFunction) {
    if (!roleAuthenticator(req.session.user!.role, role)) {
        const body: ResponseBody = {
            status: 401,
            message: "Unauthorised request.",
            data: {},
        };

        res.status(body.status).json(body).send();

        return;
    }

    next();
}

export default roleAuthMiddleware;
