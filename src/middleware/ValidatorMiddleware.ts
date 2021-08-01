import { NextFunction, Request, Response } from "express";
import validator from "../utils/Validator";
import RegisterUser from "../schema/requestbody/RegisterUser";
import LoginCredentials from "../schema/requestbody/LoginCredentials";
import UpdatePassword from "../schema/requestbody/UpdatePassword";

export async function userValidator(req: Request, res: Response, next: NextFunction) {
    await validator(req, res, next, RegisterUser);
}

export async function loginCredentialsValidator(req: Request, res: Response, next: NextFunction) {
    await validator(req, res, next, LoginCredentials);
}

export async function updatePasswordValidator(req: Request, res: Response, next: NextFunction) {
    await validator(req, res, next, UpdatePassword);
}
