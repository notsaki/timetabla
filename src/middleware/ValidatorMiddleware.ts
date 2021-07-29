import { NextFunction, Request, Response } from "express";
import validator from "../utils/Validator";
import { LoginCredentials, RegisterUser } from "../schema/UserSchema";

export async function userValidator(req: Request, res: Response, next: NextFunction) {
    await validator(req, res, next, RegisterUser);
}

export async function loginCredentialsValidator(req: Request, res: Response, next: NextFunction) {
    await validator(req, res, next, LoginCredentials);
}
