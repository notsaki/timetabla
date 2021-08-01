import { NextFunction, Request, Response } from "express";
import ResponseBody from "../schema/responsebody/ResponseBody";
import authenticatedSession from "../utils/AuthenticatedSession";

function isAuthenticatedMid(req: Request, res: Response, next: NextFunction) {
    if (!authenticatedSession(req.session)) {
        const body: ResponseBody = {
            status: 401,
            message: "User not authenticated. Please login.",
            data: {},
        };

        res.status(body.status).json(body).send();
        return;
    }

    next();
}

export default isAuthenticatedMid;
