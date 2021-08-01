import { NextFunction, Request, Response } from "express";
import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import ResponseBody from "../schema/responsebody/ResponseBody";

async function schemaValidator(req: Request, res: Response, next: NextFunction, model: any) {
    const body: unknown[] = plainToClass(model, req.body);

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

export default schemaValidator;
