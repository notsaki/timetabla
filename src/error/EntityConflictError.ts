import ErrorCode from "../schema/ErrorCode";

class EntityConflictError extends Error {
    constructor(message = `${ErrorCode.EntityConflict}: Entity conflict`) {
        super(message);
    }
}

export default EntityConflictError;
