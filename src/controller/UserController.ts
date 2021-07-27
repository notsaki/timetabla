import { Request, Response, Router } from "express";
import { userValidatorMiddleware } from "../middleware/ValidatorMiddleware";
import passwordHashMiddleware from "../middleware/PasswordHashMiddleware";
import UserService from "../service/UserService";
import { RegisterUser } from "../schema/UserSchema";

const userController: Router = Router();

userController.post("/", userValidatorMiddleware, passwordHashMiddleware, async (req: Request, res: Response) => {
    const registerUser = new RegisterUser().assign(req.body);

    try {
        await UserService.save(registerUser);
        res.status(201);
    } catch (error) {
        if (error.message.indexOf("4000") !== -1) {
            res.status(409);
        } else {
            res.status(500);
        }
    }

    res.send();
});

export default userController;
