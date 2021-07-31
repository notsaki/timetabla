import { Request, Response, Router } from "express";
import { userValidator } from "../middleware/ValidatorMiddleware";
import { User } from "../schema/database/UserSchema";
import userConflictMiddleware from "../middleware/user/UserConflictMiddleware";
import UserService from "../service/UserService";
import ResponseBody from "../schema/responsebody/ResponseBody";

const userController = Router();

userController.post("/", userValidator, userConflictMiddleware, async (req: Request, res: Response) => {
    const user: User = new User().assign(req.body);

    let body = new ResponseBody(201, "User created successfully!");

    try {
        await UserService.saveNew(user);
    } catch (error) {
        body = new ResponseBody(500, "Internal server error.");
    }

    res.status(body.status).json(body).send();
});

export default userController;
