import { NextFunction, Request, Response } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

async function validator(req: Request, res: Response, next: NextFunction, model: any) {
    const user = plainToClass(model, req.body);

    validate(user, { skipMissingProperties: true }).then((error) => {
        if (error.length > 0) {
            res.status(422).send();
            return;
        }

        next();
    });
}

export default validator;
