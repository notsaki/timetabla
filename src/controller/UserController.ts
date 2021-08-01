import { Request, Response, Router } from "express";
import { updatePasswordValidator, userValidator } from "../middleware/ValidatorMiddleware";
import { User } from "../schema/database/UserSchema";
import userConflictMiddleware from "../middleware/user/UserConflictMiddleware";
import UserService from "../service/UserService";
import ResponseBody from "../schema/responsebody/ResponseBody";
import updatePasswordMiddleware from "../middleware/user/UpdatePasswordMiddleware";
import isAuthenticatedMid from "../middleware/auth/IsAuthenticatedMid";

const userController = Router();

userController.post("/", userValidator, userConflictMiddleware, async (req: Request, res: Response) => {
    const user: User = req.body;

    let body: ResponseBody = {
        status: 201,
        message: "User created successfully!",
        data: {},
    };

    try {
        await UserService.saveNew(user);
    } catch (error: any) {
        body.status = 500;
        body.message = "Internal server error!";
        console.log(error);
    }

    res.status(body.status).json(body).send();
});

userController.put(
    "/password",
    isAuthenticatedMid,
    updatePasswordValidator,
    updatePasswordMiddleware,
    async (req: Request, res: Response) => {
        let body: ResponseBody = {
            status: 200,
            message: "Password updated successfully!",
            data: {},
        };

        try {
            await UserService.updatePassword(res.locals.user.username, req.body.newPassword);
        } catch (error: any) {
            body = {
                status: 500,
                message: "Internal server error!",
                data: {},
            };
            console.log(error);
        }

        res.status(body.status).json(body).send();
    }
);

export default userController;
