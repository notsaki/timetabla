import UserSchema, { User } from "../schema/database/UserSchema";
import EntityNotFoundError from "../error/EntityNotFoundError";
import Repository from "./Repository";

export default class UserRepository implements Repository<User> {
    async saveOne(user: User): Promise<User> {
        return await new UserSchema(user).save();
    }

    async saveMany(users: User[]): Promise<User[]> {
        return await UserSchema.insertMany(users);
    }

    async deleteOne(id: string): Promise<void> {
        await UserSchema.findByIdAndDelete(id);
    }

    async deleteMany(search: object): Promise<void> {
        await UserSchema.deleteMany(search);
    }

    async findOne(search: object): Promise<User> {
        const user: User | null = await UserSchema.findOne(search);

        if (!user) {
            throw new EntityNotFoundError("User not found.");
        }

        return user;
    }

    async findMany(search: object): Promise<User[]> {
        return UserSchema.find(search);
    }

    async exists(search: object): Promise<boolean> {
        return UserSchema.exists(search);
    }

    async count(search: object): Promise<number> {
        return UserSchema.count(search);
    }

    async updateOne(_id: string, data: object): Promise<void> {
        await UserSchema.findOneAndUpdate({ _id }, data, { useFindAndModify: false });
    }

    async updateMany(search: object, data: object): Promise<void> {
        await UserSchema.updateMany(search, data);
    }

    async findById(id: string): Promise<User> {
        const user: User | null = await UserSchema.findById(id);

        if (!user) {
            throw new EntityNotFoundError("User not found.");
        }

        return user;
    }
}
