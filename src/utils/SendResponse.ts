import { Response } from "express";
import ResponseBody from "../schema/responsebody/ResponseBody";

class ResponseHandler {
    static sendResponse(res: Response, status: number, message: string, data: object = {}) {
        this.sendResponseInj(res, { status, message, data });
    }

    static sendResponseInj(res: Response, body: ResponseBody) {
        res.status(body.status).json(body).send();
    }

    static sendOk(res: Response, message = "Ok") {
        this.sendResponse(res, 200, message);
    }

    static sendUnauthorised(res: Response, message = "Unauthorised request.") {
        this.sendResponse(res, 401, message);
    }

    static sendUnprocessableEntity(res: Response, message = "Invalid JSON format.") {
        this.sendResponse(res, 422, message);
    }

    static sendConflict(res: Response, message = "Entity already exists in the defined data source.") {
        this.sendResponse(res, 409, message);
    }

    static sendInternalServerError(res: Response, message = "Internal server error.") {
        this.sendResponse(res, 500, message);
    }

    static sendNotFound(res: Response, message = "Entity not found.") {
        this.sendResponse(res, 404, message);
    }
}

export default ResponseHandler;
