import UserSchema, { RegisterUser, User } from "../schema/UserSchema";
import ConflictError from "../error/ConflictError";
import hash from "../utils/Hash";

class UserService {
    static async save(registerUser: RegisterUser) {
        const user: User = new User().assign(registerUser);

        user.password = hash(user.password);

        if (await UserSchema.exists({ username: user.username })) {
            throw new ConflictError();
        }

        await new UserSchema(user).save();
    }
}

export default UserService;
