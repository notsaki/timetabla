import { NextFunction, Request, Response } from "express";
import schemaValidator, { validatorHandler } from "../utils/SchemaValidator";
import RegisterUserBody from "../schema/requestbody/RegisterUserBody";
import UpdatePasswordBody from "../schema/requestbody/UpdatePasswordBody";
import LoginCredentialsBody from "../schema/requestbody/LoginCredentialsBody";
import AdminRequestBody from "../schema/requestbody/admin/AdminRequestBody";
import AdminUpdateUsernameBody from "../schema/requestbody/admin/AdminUpdateUsernameBody";

export async function userSchemaValidator(req: Request, res: Response, next: NextFunction) {
    await schemaValidator(req.body.data, res, next, RegisterUserBody);
}

export async function loginCredentialsSchemaValidator(req: Request, res: Response, next: NextFunction) {
    await schemaValidator(req.body, res, next, LoginCredentialsBody);
}

export async function updatePasswordSchemaValidator(req: Request, res: Response, next: NextFunction) {
    await schemaValidator(req.body, res, next, UpdatePasswordBody);
}

export async function adminRequestBodySchemaValidator(req: Request, res: Response, next: NextFunction) {
    await schemaValidator(req.body, res, next, AdminRequestBody);
}

export async function adminUpdateUsernameSchemaValidator(req: Request, res: Response, next: NextFunction) {
    await schemaValidator(req.body.data, res, next, AdminUpdateUsernameBody);
}
