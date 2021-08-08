import Service from "./Service";
import { Role, User } from "../schema/database/UserSchema";
import UserRepository from "../repository/UserRepository";
import RepositorySingleton from "../singleton/RepositorySingleton";
import RegisterUserBody from "../schema/requestbody/RegisterUserBody";
import { hashNew } from "../utils/Hash";
import randomString from "../utils/RandomString";

export default class UserService implements Service {
    userRepository: UserRepository = RepositorySingleton.userRepository;

    async findMany(search: object): Promise<any[]> {
        return await this.userRepository.findMany(search);
    }

    async findOne(search: object): Promise<User> {
        return await this.userRepository.findOne(search);
    }

    async saveMany(users: RegisterUserBody[]): Promise<User[]> {
        users.map((user: User) => {
            user.password = hashNew(user.password);
            return user;
        });

        return await this.userRepository.saveMany(users);
    }

    async saveOne(user: User): Promise<User> {
        user.password = hashNew(user.password);

        return await this.userRepository.saveOne(user);
    }

    async deleteMany(search: object): Promise<void> {
        return this.userRepository.deleteMany(search);
    }

    async deleteOne(id: any): Promise<void> {
        return this.userRepository.deleteOne(id);
    }

    async findById(id: string): Promise<User> {
        return this.userRepository.findById(id);
    }

    async findByManyIds(ids: string[]): Promise<User[]> {
        return this.userRepository.findMany({ _id: { $in: ids } });
    }

    async updateMany(search: any, data: object): Promise<void> {
        return this.userRepository.updateMany(search, data);
    }

    async updateOne(id: any, data: object): Promise<void> {
        return this.userRepository.updateMany(id, data);
    }

    async updatePassword(id: string, password: string): Promise<void> {
        password = hashNew(password);

        return await this.userRepository.updateOne(id, { password });
    }

    async updateUsername(id: string, newUsername: string): Promise<void> {
        return await this.userRepository.updateOne(id, { username: newUsername });
    }

    async updateEmail(id: string, email: string): Promise<void> {
        return await this.userRepository.updateOne(id, { email });
    }

    async updateFullname(id: string, fullname: string): Promise<void> {
        return await this.userRepository.updateOne(id, { fullname });
    }

    async updateBlocked(id: string, blocked: boolean): Promise<void> {
        return await this.userRepository.updateOne(id, { blocked });
    }

    async updateRole(id: string, role: Role): Promise<void> {
        return await this.userRepository.updateOne(id, { role });
    }

    async createResetCode(id: string): Promise<void> {
        return await this.userRepository.updateOne(id, { resetCode: randomString() });
    }

    async resetResetCode(id: string): Promise<void> {
        return await this.userRepository.updateOne(id, { resetCode: undefined });
    }

    async resetActivationCode(id: string): Promise<void> {
        return await this.userRepository.updateOne(id, { activationCode: undefined });
    }

    async exists(search: object): Promise<boolean> {
        return await this.userRepository.exists(search);
    }

    async usernameExists(username: string): Promise<boolean> {
        return await this.exists({ username });
    }

    async idExists(_id: string): Promise<boolean> {
        return await this.exists({ _id });
    }

    async findByUsername(username: string): Promise<User> {
        return await this.findOne({ username });
    }
}
