import ErrorCode from "../schema/ErrorCode";

class InvalidPasswordError extends Error {
    constructor(message = `${ErrorCode.InvalidPassword}: Invalid password`) {
        super(message);
    }
}

export default InvalidPasswordError;
