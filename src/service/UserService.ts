import UserSchema, { User } from "../schema/UserSchema";
import { hashNew } from "../utils/Hash";

class UserService {
    static async saveNew(user: User) {
        user.password = hashNew(user.password);

        await new UserSchema(user).save();
    }

    static async saveMany(users: User[]) {
        users.map((user: User) => {
            user.password = hashNew(user.password);
            return user;
        });

        await UserSchema.insertMany(users);
    }
}

export default UserService;
