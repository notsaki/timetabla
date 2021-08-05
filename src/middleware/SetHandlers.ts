import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../utils/ResponseHandler";

export default function setHandlers(req: Request, res: Response, next: NextFunction) {
    ResponseHandler.setResponse(res);
    next();
}
