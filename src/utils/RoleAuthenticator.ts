import { Role } from "../schema/database/UserSchema";

function roleAuthenticator(role: Role, authenticatedRole: Role) {
    return authenticatedRole <= role;
}

export default roleAuthenticator;
