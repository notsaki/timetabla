import { Request, Response, Router } from "express";
import { adminUpdateUsernameSchemaValidator, userSchemaValidator } from "../../middleware/SchemaValidatorMiddleware";
import { User } from "../../schema/database/UserSchema";
import UserService from "../../service/UserService";
import { adminUpdateUsernameConflictMid, userConflictMid } from "../../middleware/UserConflictMid";
import { adminUpdateUsernameUserExistsMid } from "../../middleware/UserExistsMid";
import {
    adminUpdateUpdateUserAuthorisedRoleMid,
    userCreationAuthorisedRoleMid,
} from "../../middleware/AuthorisedRoleMid";
import ResponseHandler from "../../utils/SendResponse";

const adminUserController = Router();

adminUserController.post(
    "/",
    userSchemaValidator,
    userCreationAuthorisedRoleMid,
    userConflictMid,
    async (req: Request, res: Response) => {
        const user: User = req.body.data;

        try {
            await UserService.saveNew(user);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError(res);
            console.log(error);
            return;
        }

        ResponseHandler.sendResponse(res, 201, "User created successfully!");
    }
);

adminUserController.put(
    "/:username/username",
    adminUpdateUsernameSchemaValidator,
    adminUpdateUsernameUserExistsMid,
    adminUpdateUpdateUserAuthorisedRoleMid,
    adminUpdateUsernameConflictMid,
    async (req: Request, res: Response) => {
        try {
            await UserService.updateUsername(req.params.username, req.body.data.newUsername);
        } catch (error: any) {
            ResponseHandler.sendInternalServerError(res);
            return;
        }

        ResponseHandler.sendOk(res, "Username updated successfully!");
    }
);

export default adminUserController;
