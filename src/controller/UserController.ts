import { Request, Response, Router } from "express";
import { updatePasswordSchemaValidator, userSchemaValidator } from "../middleware/SchemaValidatorMiddleware";
import { User } from "../schema/database/UserSchema";
import UserService from "../service/UserService";
import ResponseBody from "../schema/responsebody/ResponseBody";
import isAuthenticatedMid from "../middleware/IsAuthenticatedMid";
import { verifyLoginCredentialsUpdatePasswordMid } from "../middleware/VerifyLoginCredentialsMid";
import { userConflictMid } from "../middleware/UserConflictMid";

const userController = Router();

userController.post("/", userSchemaValidator, userConflictMid, async (req: Request, res: Response) => {
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
    updatePasswordSchemaValidator,
    verifyLoginCredentialsUpdatePasswordMid,
    async (req: Request, res: Response) => {
        let body: ResponseBody = {
            status: 200,
            message: "Password updated successfully!",
            data: {},
        };

        try {
            await UserService.updatePassword(req.session.user!.username!, req.body.newPassword);
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
