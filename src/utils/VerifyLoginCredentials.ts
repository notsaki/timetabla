import UserSchema, { User } from "../schema/database/UserSchema";
import { verify } from "./Hash";
import EntityNotFoundError from "../error/EntityNotFoundError";
import InvalidPasswordError from "../error/InvalidPasswordError";
import BlockedUserError from "../error/BlockedUserError";
import UnverifiedUserError from "../error/UnverifiedUserError";

async function verifyLoginCredentials(username: string, password: string): Promise<User> {
    const user: User | null = await UserSchema.findOne({ username });

    if (!user) {
        throw new EntityNotFoundError();
    }

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
