import { NextFunction, Request, Response } from "express";
import authenticatedSession from "../utils/AuthenticatedSession";
import ResponseHandler from "../utils/ResponseHandler";

function isAuthenticatedMid(req: Request, res: Response, next: NextFunction) {
    if (!authenticatedSession(req.session)) {
        ResponseHandler.sendUnauthorised("User not authenticated. Please login.");
        return;
    }

    next();
}

export default isAuthenticatedMid;
