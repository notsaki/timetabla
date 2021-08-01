import { NextFunction, Request, Response, Router } from "express";
import UserService from "../service/UserService";
import ResponseBody from "../schema/responsebody/ResponseBody";
import { adminRequestBodySchemaValidator } from "../middleware/SchemaValidatorMiddleware";
import { adminUpdateUsernameConflictMid } from "../middleware/UserConflictMid";
import { adminUpdateUsernameUserExistsMid } from "../middleware/UserExistsMid";

const adminController = Router();

adminController.put(
    "/user/:username/username",
    adminRequestBodySchemaValidator,
    adminUpdateUsernameUserExistsMid,
    adminUpdateUsernameConflictMid,
    async (req: Request, res: Response) => {
        let body: ResponseBody = {
            status: 200,
            message: "Username updated successfully!",
            data: {},
        };

        try {
            await UserService.updateUsername(req.params.username, req.body.data.newUsername);
        } catch (error: any) {
            body.status = 500;
            body.message = "Internal server error";
        }

        res.status(body.status).json(body).send();
    }
);

export default adminController;
