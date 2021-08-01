import ErrorCode from "../schema/ErrorCode";

class UnverifiedUserError extends Error {
    constructor(message = `${ErrorCode.UserNotVerified}: User not verified`) {
        super(message);
    }
}

export default UnverifiedUserError;
