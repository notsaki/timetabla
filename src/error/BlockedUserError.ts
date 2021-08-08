import ErrorCode from "../schema/ErrorCode";

class BlockedUserError extends Error {
    constructor(message = "User blocked") {
        super(`${ErrorCode.BlockedUser}: ${message}`);
    }
}

export default BlockedUserError;
