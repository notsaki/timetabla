import { NextFunction, Request, Response } from "express";
import ResponseBody from "../../schema/responsebody/ResponseBody";

function isAuthenticatedMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user?.authenticated) {
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

export default isAuthenticatedMiddleware;
