import { Request, Response, Router } from "express";
import { userValidatorMiddleware } from "../middleware/ValidatorMiddleware";
import UserSchema, { User } from "../schema/UserSchema";
import userConflictMiddleware from "../middleware/UserConflictMiddleware";
import hash from "../utils/Hash";

const userController: Router = Router();

userController.post("/", userValidatorMiddleware, userConflictMiddleware, async (req: Request, res: Response) => {
    const user: User = new User().assign(req.body);

    user.password = hash(user.password);

    try {
        await new UserSchema(user).save();

        res.status(201);
    } catch (error) {
        res.status(500);
    }

    res.send();
});

export default userController;
