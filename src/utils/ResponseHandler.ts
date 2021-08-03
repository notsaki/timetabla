import { NextFunction, Request, Response } from "express";
import ResponseBody from "../schema/responsebody/ResponseBody";

class ResponseHandler {
    static res: Response;

    static setResponse(res: Response) {
        ResponseHandler.res = res;
    }

    static sendResponse(status: number, message: string, data: object = {}) {
        ResponseHandler.sendResponseInj({ status, message, data });
    }

    static sendResponseInj(body: ResponseBody) {
        ResponseHandler.res.status(body.status).json(body).send();
    }

    static sendOk(message = "Ok") {
        ResponseHandler.sendResponse(200, message);
    }

    static sendUnauthorised(message = "Unauthorised request.") {
        ResponseHandler.sendResponse(401, message);
    }

    static sendUnprocessableEntity(message = "Invalid JSON format.") {
        ResponseHandler.sendResponse(422, message);
    }

    static sendConflict(message = "Entity already exists in the defined data source.") {
        ResponseHandler.sendResponse(409, message);
    }

    static sendInternalServerError(message = "Internal server error.") {
        ResponseHandler.sendResponse(500, message);
    }

    static sendNotFound(message = "Entity not found.") {
        ResponseHandler.sendResponse(404, message);
    }

    static sendMethodNotAllowed(message = "Request not allowed for the specific resource") {
        ResponseHandler.sendResponse(405, message);
    }
}

export function setResMid(req: Request, res: Response, next: NextFunction) {
    ResponseHandler.res = res;

    next();
}

export default ResponseHandler;
