import { Router, Request, Response, NextFunction } from "express";
import { loginCredentialsValidator } from "../middleware/ValidatorMiddleware";
import loginCredentialsAuthMiddleware from "../middleware/auth/LoginCredentialsAuthMiddleware";
import ResponseBody from "../schema/responsebody/ResponseBody";
import isAuthenticatedMiddleware from "../middleware/auth/IsAuthenticatedMiddleware";
import { Role } from "../schema/database/UserSchema";
import LoginCredentialsBody from "../schema/requestbody/LoginCredentialsBody";

const authController = Router();

authController.post(
    "/login",
    loginCredentialsValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        const loginCredentials: LoginCredentialsBody = {
            username: req.body.username,
            password: req.body.password,
        };

        await loginCredentialsAuthMiddleware(loginCredentials, req, res, next);
    },
    async (req: Request, res: Response) => {
        req.session.user = {
            id: res.locals.user._id,
            username: req.body.username,
            role: res.locals.user.role,
            authenticated: true,
        };

        const body: ResponseBody = {
            status: 200,
            message: "User authenticated!",
            data: {},
        };

        res.status(body.status).json(body).send();
    }
);

authController.post("/logout", isAuthenticatedMiddleware, (req: Request, res: Response) => {
    req.session.user = {
        id: undefined,
        username: undefined,
        role: Role.Guest,
        authenticated: false,
    };

    const body: ResponseBody = {
        status: 200,
        message: "Logout successful!",
        data: {},
    };

    res.status(body.status).json(body).send();
});

export default authController;
