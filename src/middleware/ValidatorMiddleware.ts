import { NextFunction, Request, Response } from "express";
import validator from "../utils/Validator";
import RegisterUserBody from "../schema/requestbody/RegisterUserBody";
import UpdatePasswordBody from "../schema/requestbody/UpdatePasswordBody";
import LoginCredentialsBody from "../schema/requestbody/LoginCredentialsBody";
import UpdateUsernameBody from "../schema/requestbody/UpdateUsernameBody";
import AdminRequestBody from "../schema/requestbody/admin/AdminRequestBody";
import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import ResponseBody from "../schema/responsebody/ResponseBody";
import AdminUpdateUsernameBody from "../schema/requestbody/admin/AdminUpdateUsernameBody";

export async function userValidator(req: Request, res: Response, next: NextFunction) {
    await validator(req, res, next, RegisterUserBody);
}

export async function loginCredentialsValidator(req: Request, res: Response, next: NextFunction) {
    await validator(req, res, next, LoginCredentialsBody);
}

export async function updatePasswordValidator(req: Request, res: Response, next: NextFunction) {
    await validator(req, res, next, UpdatePasswordBody);
}

export async function adminRequestBodyValidator(req: Request, res: Response, next: NextFunction) {
    await validator(req, res, next, AdminRequestBody);
}

export async function adminUpdateUsernameValidator(req: Request, res: Response, next: NextFunction) {
    const body: AdminUpdateUsernameBody = plainToClass(AdminUpdateUsernameBody, req.body.data);

    validate(body, { skipMissingProperties: true }).then((error: ValidationError[]) => {
        if (error.length > 0) {
            const body: ResponseBody = {
                status: 422,
                message: "Could not process request body.",
                data: {},
            };

            res.status(body.status).json(body).send();
            return;
        }

        next();
    });
}
