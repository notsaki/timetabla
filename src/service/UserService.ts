import UserSchema, { User } from "../schema/database/UserSchema";
import { hashNew } from "../utils/Hash";
import mongoose from "mongoose";

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

    static async updatePassword(username: string, password: string) {
        password = hashNew(password);

        await UserSchema.updateOne({ username }, { password });
    }
}

export default UserService;
