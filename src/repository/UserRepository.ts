import UserSchema, { Role, User } from "../schema/database/UserSchema";
import { hashNew } from "../utils/Hash";
import randomString from "../utils/RandomString";
import EntityNotFoundError from "../error/EntityNotFoundError";
import Repository from "./Repository";

export default class UserRepository implements Repository<User> {
    async saveOne(user: User): Promise<void> {
        user.password = hashNew(user.password);

        await new UserSchema(user).save();
    }

    async saveMany(users: User[]): Promise<void> {
        users.map((user: User) => {
            user.password = hashNew(user.password);
            return user;
        });

        await UserSchema.insertMany(users);
    }

    async deleteOne(username: string): Promise<void> {
        await UserSchema.deleteOne({ username });
    }

    async deleteMany(search: object): Promise<void> {
        await UserSchema.deleteMany(search);
    }

    async findOne(username: string): Promise<User> {
        const user: User | null = await UserSchema.findOne({ username });

        if (!user) {
            throw new EntityNotFoundError("User not found.");
        }

        return user;
    }

    async findMany(search: object): Promise<User[]> {
        return UserSchema.find(search);
    }

    async exists(username: string): Promise<boolean> {
        return UserSchema.exists({ username });
    }

    async count(search: object): Promise<number> {
        return UserSchema.count(search);
    }

    async updateOne(username: string, update: object): Promise<void> {
        await UserSchema.updateOne({ username }, update);
    }

    async updateMany(search: object, update: object): Promise<void> {
        await UserSchema.updateMany(search, update);
    }

    async updatePassword(username: string, password: string) {
        password = hashNew(password);

        await UserSchema.updateOne({ username }, { password });
    }

    async updateUsername(username: string, newUsername: string) {
        await UserSchema.updateOne({ username }, { username: newUsername });
    }

    async updateEmail(username: string, email: string) {
        await UserSchema.updateOne({ username }, { email });
    }

    async updateFullname(username: string, fullname: string) {
        await UserSchema.updateOne({ username }, { fullname });
    }

    async updateBlocked(username: string, blocked: boolean) {
        await UserSchema.updateOne({ username }, { blocked });
    }

    async updateRole(username: string, role: Role) {
        await UserSchema.updateOne({ username }, { role });
    }

    async createResetCode(username: string) {
        await UserSchema.updateOne({ username }, { resetCode: randomString() });
    }

    async resetResetCode(username: string) {
        await UserSchema.updateOne({ username }, { resetCode: undefined });
    }

    async resetActivationCode(username: string) {
        await UserSchema.updateOne({ username }, { activationCode: undefined });
    }
}
