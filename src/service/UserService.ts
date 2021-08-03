import UserSchema, { Role, User } from "../schema/database/UserSchema";
import { hashNew } from "../utils/Hash";
import mongoose from "mongoose";
import randomString from "../utils/RandomString";

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

    static async deleteOne(username: string) {
        await UserSchema.deleteOne({ username });
    }

    static async findOne(username: string): Promise<User | null> {
        return UserSchema.findOne({ username });
    }

    static async updatePassword(username: string, password: string) {
        password = hashNew(password);

        await UserSchema.updateOne({ username }, { password });
    }

    static async updateUsername(username: string, newUsername: string) {
        await UserSchema.updateOne({ username }, { username: newUsername });
    }

    static async updateEmail(username: string, email: string) {
        await UserSchema.updateOne({ username }, { email });
    }

    static async updateFullname(username: string, fullname: string) {
        await UserSchema.updateOne({ username }, { fullname });
    }

    static async updateBlocked(username: string, blocked: boolean) {
        await UserSchema.updateOne({ username }, { blocked });
    }

    static async updateRole(username: string, role: Role) {
        await UserSchema.updateOne({ username }, { role });
    }

    static async createResetCode(username: string) {
        await UserSchema.updateOne({ username }, { resetCode: randomString() });
    }

    static async resetResetCode(username: string) {
        await UserSchema.updateOne({ username }, { resetCode: undefined });
    }

    static async resetActivationCode(username: string) {
        await UserSchema.updateOne({ username }, { activationCode: undefined });
    }
}

export default UserService;
