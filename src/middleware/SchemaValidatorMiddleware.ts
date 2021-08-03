import { NextFunction, Request, Response } from "express";
import schemaValidator, { validatorHandler } from "../utils/SchemaValidator";
import RegisterUserBody from "../schema/requestbody/RegisterUserBody";
import UpdatePasswordBody from "../schema/requestbody/UpdatePasswordBody";
import LoginCredentialsBody from "../schema/requestbody/LoginCredentialsBody";
import AdminRequestBody from "../schema/requestbody/admin/AdminRequestBody";
import {
    AdminBlockUserBody,
    AdminUpdateFullnameBody,
    AdminUpdateUserEmailBody,
    AdminUpdateUsernameBody,
    AdminUpdateUserPasswordBody,
    AdminUpdateUserRoleBody,
} from "../schema/requestbody/admin/AdminUpdateUserBody";
import PasswordResetBody from "../schema/requestbody/PasswordResetBody";

export async function userSchemaValidator(req: Request, res: Response, next: NextFunction) {
    await schemaValidator(req.body.data, res, next, RegisterUserBody);
}

export async function loginCredentialsSchemaValidator(req: Request, res: Response, next: NextFunction) {
    await schemaValidator(req.body, res, next, LoginCredentialsBody);
}

export async function updatePasswordSchemaValidator(req: Request, res: Response, next: NextFunction) {
    await schemaValidator(req.body, res, next, UpdatePasswordBody);
}

export async function passwordResetSchemaValidator(req: Request, res: Response, next: NextFunction) {
    await schemaValidator(req.body, res, next, PasswordResetBody);
}

export async function adminRequestBodySchemaValidator(req: Request, res: Response, next: NextFunction) {
    await schemaValidator(req.body, res, next, AdminRequestBody);
}

export async function adminUpdateUsernameSchemaValidator(req: Request, res: Response, next: NextFunction) {
    await schemaValidator(req.body.data, res, next, AdminUpdateUsernameBody);
}

export async function adminUpdateFullnameSchemaValidator(req: Request, res: Response, next: NextFunction) {
    await schemaValidator(req.body.data, res, next, AdminUpdateFullnameBody);
}

export async function adminUpdateRoleSchemaValidator(req: Request, res: Response, next: NextFunction) {
    await schemaValidator(req.body.data, res, next, AdminUpdateUserRoleBody);
}

export async function adminUpdateEmailSchemaValidator(req: Request, res: Response, next: NextFunction) {
    await schemaValidator(req.body.data, res, next, AdminUpdateUserEmailBody);
}

export async function adminUpdatePasswordSchemaValidator(req: Request, res: Response, next: NextFunction) {
    await schemaValidator(req.body.data, res, next, AdminUpdateUserPasswordBody);
}

export async function adminBlockUserSchemaValidator(req: Request, res: Response, next: NextFunction) {
    await schemaValidator(req.body.data, res, next, AdminBlockUserBody);
}
