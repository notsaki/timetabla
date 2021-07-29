import { Request, Response, Router } from "express";
import { userValidator } from "../middleware/ValidatorMiddleware";
import { User } from "../schema/UserSchema";
import userConflictMiddleware from "../middleware/UserConflictMiddleware";
import UserService from "../service/UserService";

const userController = Router();

userController.post("/", userValidator, userConflictMiddleware, async (req: Request, res: Response) => {
    const user: User = new User().assign(req.body);

    try {
        await UserService.saveNew(user);
        res.status(201);
    } catch (error) {
        res.status(500);
    }

    res.send();
});

export default userController;
