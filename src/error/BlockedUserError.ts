import ErrorCode from "../schema/ErrorCode";

class BlockedUserError extends Error {
    constructor(message = `${ErrorCode.BlockedUser}: User blocked`) {
        super(message);
    }
}

export default BlockedUserError;
