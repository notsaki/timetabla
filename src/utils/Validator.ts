import { NextFunction, Request, Response } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import ResponseBody from "../schema/responsebody/ResponseBody";

async function validator(req: Request, res: Response, next: NextFunction, model: any) {
    const user = plainToClass(model, req.body);

    validate(user, { skipMissingProperties: true }).then((error) => {
        if (error.length > 0) {
            const body = new ResponseBody(422, "Could not process request body.");

            res.status(body.status).json(body).send();
            return;
        }

        next();
    });
}

export default validator;
