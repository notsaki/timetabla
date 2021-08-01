import getErrorCode from "../utils/GetErrorCode";
import ErrorCode from "../schema/ErrorCode";
import { Request, Response } from "express";
import ResponseBody from "../schema/responsebody/ResponseBody";

function loginCredentialsErrorHandler(error: any, req: Request, res: Response) {
    let body: ResponseBody = {
        status: 500,
        message: "Internal server error",
        data: {},
    };

    switch (getErrorCode(error)) {
        case ErrorCode.BlockedUser:
            body.status = 403;
            body.message = "User is blocked.";

            res.status(body.status).json(body).send();
            return;
        case ErrorCode.InvalidPassword:
        case ErrorCode.EntityNotFound:
            body.status = 401;
            body.message = "Invalid username or password.";

            res.status(body.status).json(body).send();
            return;
        case ErrorCode.UserNotVerified:
            body.status = 403;
            body.message =
                "User not activated. Please check your email for the verification code or request for a new one.";

            res.status(body.status).json(body).send();
            return;
        default:
            res.status(body.status).json(body).send();
            return;
    }
}

export default loginCredentialsErrorHandler;
