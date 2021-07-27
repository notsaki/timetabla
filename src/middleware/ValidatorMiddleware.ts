import { NextFunction, Request, Response } from "express";
import validator from "../utils/Validator";
import { RegisterUser } from "../schema/UserSchema";

export async function userValidatorMiddleware(req: Request, res: Response, next: NextFunction) {
    await validator(req, res, next, RegisterUser);
}
