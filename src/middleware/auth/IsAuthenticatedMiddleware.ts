import { NextFunction, Request, Response } from "express";
import ResponseBody from "../../schema/responsebody/ResponseBody";

function isAuthenticatedMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user?.authenticated) {
        const body = new ResponseBody(401, "User not authenticated. Please login.");

        res.status(body.status).json(body).send();
        return;
    }

    next();
}

export default isAuthenticatedMiddleware;
