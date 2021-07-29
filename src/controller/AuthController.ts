import { Router, Request, Response } from "express";
import { loginCredentialsValidator } from "../middleware/ValidatorMiddleware";
import loginCredentialsAuthMiddleware from "../middleware/LoginCredentialsAuthMiddleware";

const authController = Router();

authController.post(
    "/login",
    loginCredentialsValidator,
    loginCredentialsAuthMiddleware,
    async (req: Request, res: Response) => {
        req.session.user = {
            id: req.body.id,
            authenticated: true,
        };

        res.send();
    }
);

export default authController;
