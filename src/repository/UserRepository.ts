import UserSchema, { Role, User } from "../schema/database/UserSchema";
import { hashNew } from "../utils/Hash";
import randomString from "../utils/RandomString";
import EntityNotFoundError from "../error/EntityNotFoundError";

export default class UserRepository {
    static async saveOne(user: User): Promise<void> {
        user.password = hashNew(user.password);

        await new UserSchema(user).save();
    }

    static async saveMany(users: User[]): Promise<void> {
        users.map((user: User) => {
            user.password = hashNew(user.password);
            return user;
        });

        await UserSchema.insertMany(users);
    }

    static async deleteOne(username: string): Promise<void> {
        await UserSchema.deleteOne({ username });
    }

    static async deleteMany(search: object): Promise<void> {
        await UserSchema.deleteMany(search);
    }

    static async findOne(username: string): Promise<User> {
        const user: User | null = await UserSchema.findOne({ username });

        if (!user) {
            throw new EntityNotFoundError("User not found.");
        }

        return user;
    }

    static async findMany(search: object): Promise<User[]> {
        return UserSchema.find(search);
    }

    static async exists(username: string): Promise<boolean> {
        return UserSchema.exists({ username });
    }

    static async count(search: object): Promise<number> {
        return UserSchema.count(search);
    }

    static async updateOne(username: string, update: object): Promise<void> {
        await UserSchema.updateOne({ username }, update);
    }

    static async updateMany(search: object, update: object): Promise<void> {
        await UserSchema.updateMany(search, update);
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
