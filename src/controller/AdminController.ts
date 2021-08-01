import { NextFunction, Request, Response, Router } from "express";
import UserService from "../service/UserService";
import ResponseBody from "../schema/responsebody/ResponseBody";
import { adminUpdateUsernameValidator } from "../middleware/ValidatorMiddleware";

const adminController = Router();

adminController.put(
    "/user/:username/username",
    adminUpdateUsernameValidator,
    async (req: Request, res: Response, next: NextFunction) => {
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
