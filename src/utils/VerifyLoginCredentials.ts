import UserSchema, { User } from "../schema/database/UserSchema";
import { verify } from "./Hash";
import InvalidPasswordError from "../error/InvalidPasswordError";
import BlockedUserError from "../error/BlockedUserError";
import UnverifiedUserError from "../error/UnverifiedUserError";
import UserService from "../service/UserService";
import ServiceSingleton from "../singleton/ServiceSingleton";

const userService: UserService = ServiceSingleton.userService;

async function verifyLoginCredentials(username: string, password: string): Promise<User> {
    const user: User | null = await userService.findByUsername(username);

    if (!verify(password, user.password)) {
        throw new InvalidPasswordError();
    }

    if (user.blocked) {
        throw new BlockedUserError();
    }

    if (user.activationCode) {
        throw new UnverifiedUserError();
    }

    return user;
}

export default verifyLoginCredentials;
