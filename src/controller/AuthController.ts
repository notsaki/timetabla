import { Router, Request, Response } from "express";
import { loginCredentialsValidator } from "../middleware/ValidatorMiddleware";
import loginCredentialsAuthMiddleware from "../middleware/auth/LoginCredentialsAuthMiddleware";
import ResponseBody from "../schema/responsebody/ResponseBody";
import isAuthenticatedMiddleware from "../middleware/auth/IsAuthenticatedMiddleware";

const authController = Router();

authController.post(
    "/login",
    loginCredentialsValidator,
    loginCredentialsAuthMiddleware,
    async (req: Request, res: Response) => {
        req.session.user = {
            id: req.body.id,
            username: req.body.username,
            authenticated: true,
        };

        const body = new ResponseBody(200, "User authenticated!");

        res.status(body.status).json(body).send();
    }
);

authController.post("/logout", isAuthenticatedMiddleware, (req: Request, res: Response) => {
    req.session.user = {
        id: undefined,
        username: undefined,
        authenticated: false,
    };

    const body = new ResponseBody(200, "Logout successful!");

    res.status(body.status).json(body).send();
});

export default authController;
