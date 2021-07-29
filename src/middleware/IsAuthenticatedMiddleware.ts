import { NextFunction, Request, Response } from "express";

function isAuthenticatedMiddleware(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user!.authenticated) {
        res.status(401).send();
        return;
    }

    next();
}
