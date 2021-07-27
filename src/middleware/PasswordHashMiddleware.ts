import { NextFunction, Request, Response } from "express";
import hash from "../utils/Hash";

function passwordHashMiddleware(req: Request, res: Response, next: NextFunction) {
    req.body.password = hash(req.body.password);
    next();
}

export default passwordHashMiddleware;
