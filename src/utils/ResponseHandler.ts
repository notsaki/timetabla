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

    static sendOk(message = "Ok", data: object = {}) {
        ResponseHandler.sendResponse(200, message, data);
    }

    static sendUnauthorised(message = "Unauthorised request.", data: object = {}) {
        ResponseHandler.sendResponse(401, message, data);
    }

    static sendUnprocessableEntity(message = "Invalid JSON format.", data: object = {}) {
        ResponseHandler.sendResponse(422, message, data);
    }

    static sendConflict(message = "Entity already exists in the defined data source.", data: object = {}) {
        ResponseHandler.sendResponse(409, message, data);
    }

    static sendInternalServerError(message = "Internal server error.", data: object = {}) {
        ResponseHandler.sendResponse(500, message, data);
    }

    static sendNotFound(message = "Entity not found.", data: object = {}) {
        ResponseHandler.sendResponse(404, message, data);
    }

    static sendMethodNotAllowed(message = "Request not allowed for the specific resource", data: object = {}) {
        ResponseHandler.sendResponse(405, message, data);
    }

    static sendForbidden(message = "User not allowed to access this resource.", data: object = {}) {
        ResponseHandler.sendResponse(403, message, data);
    }

    static sendNoContent(message = "No content", data: object = {}) {
        ResponseHandler.sendResponse(204, message, data);
    }
}

export function setResMid(req: Request, res: Response, next: NextFunction) {
    ResponseHandler.res = res;

    next();
}

export default ResponseHandler;
