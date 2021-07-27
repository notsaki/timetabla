import { Response } from "express";
import UserSchema, { RegisterUser, User } from "../schema/UserSchema";
import ConflictError from "../error/ConflictError";

class UserService {
    static async save(registerUser: RegisterUser) {
        const user: User = new User().assign(registerUser);

        if (await UserSchema.exists({ username: user.username })) {
            throw new ConflictError();
        }

        await new UserSchema(user).save();
    }
}

export default UserService;
