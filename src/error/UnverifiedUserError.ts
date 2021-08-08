import ErrorCode from "../schema/ErrorCode";

class UnverifiedUserError extends Error {
    constructor(message = "User not verified") {
        super(`${ErrorCode.UserNotVerified}: ${message}`);
    }
}

export default UnverifiedUserError;
