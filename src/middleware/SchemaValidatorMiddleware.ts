import { NextFunction, Request, Response } from "express";
import schemaValidator from "../utils/SchemaValidator";
import RegisterUserBody from "../schema/requestbody/RegisterUserBody";
import UpdatePasswordBody from "../schema/requestbody/UpdatePasswordBody";
import LoginCredentialsBody from "../schema/requestbody/LoginCredentialsBody";
import AdminRequestBody from "../schema/requestbody/admin/AdminRequestBody";
import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import ResponseBody from "../schema/responsebody/ResponseBody";
import AdminUpdateUsernameBody from "../schema/requestbody/admin/AdminUpdateUsernameBody";

export async function userSchemaValidator(req: Request, res: Response, next: NextFunction) {
    await schemaValidator(req, res, next, RegisterUserBody);
}

export async function loginCredentialsSchemaValidator(req: Request, res: Response, next: NextFunction) {
    await schemaValidator(req, res, next, LoginCredentialsBody);
}

export async function updatePasswordSchemaValidator(req: Request, res: Response, next: NextFunction) {
    await schemaValidator(req, res, next, UpdatePasswordBody);
}

export async function adminRequestBodySchemaValidator(req: Request, res: Response, next: NextFunction) {
    await schemaValidator(req, res, next, AdminRequestBody);
}

export async function adminUpdateUsernameSchemaValidator(req: Request, res: Response, next: NextFunction) {
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
