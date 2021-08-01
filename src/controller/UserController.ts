import { Request, Response, Router } from "express";
import { updatePasswordValidator, userValidator } from "../middleware/ValidatorMiddleware";
import { User } from "../schema/database/UserSchema";
import userConflictMiddleware from "../middleware/user/UserConflictMiddleware";
import UserService from "../service/UserService";
import ResponseBody from "../schema/responsebody/ResponseBody";
import updatePasswordMiddleware from "../middleware/user/UpdatePasswordMiddleware";
import isAuthenticatedMiddleware from "../middleware/auth/IsAuthenticatedMiddleware";

const userController = Router();

userController.post("/", userValidator, userConflictMiddleware, async (req: Request, res: Response) => {
    const user: User = new User().assign(req.body);

    let body = new ResponseBody(201, "User created successfully!");

    try {
        await UserService.saveNew(user);
    } catch (error: any) {
        body = new ResponseBody(500, "Internal server error.");
        console.log(error);
    }

    res.status(body.status).json(body).send();
});

userController.put(
    "/password",
    isAuthenticatedMiddleware,
    updatePasswordValidator,
    updatePasswordMiddleware,
    async (req: Request, res: Response) => {
        let body = new ResponseBody(200, "Password updated successfully!");

        try {
            await UserService.updatePassword(req.body.username, req.body.newPassword);
        } catch (error: any) {
            body = new ResponseBody(500, "Internal server error");
            console.log(error);
        }

        res.status(body.status).json(body).send();
    }
);

export default userController;
