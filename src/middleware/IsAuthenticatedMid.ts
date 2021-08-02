import { NextFunction, Request, Response } from "express";
import authenticatedSession from "../utils/AuthenticatedSession";
import ResponseHandler from "../utils/SendResponse";

function isAuthenticatedMid(req: Request, res: Response, next: NextFunction) {
    if (!authenticatedSession(req.session)) {
        ResponseHandler.sendUnauthorised(res, "User not authenticated. Please login.");
        return;
    }

    next();
}

export default isAuthenticatedMid;
