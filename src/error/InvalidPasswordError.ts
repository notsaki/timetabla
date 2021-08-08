import ErrorCode from "../schema/ErrorCode";

class InvalidPasswordError extends Error {
    constructor(message = "Invalid password") {
        super(`${ErrorCode.InvalidPassword}: ${message}`);
    }
}

export default InvalidPasswordError;
