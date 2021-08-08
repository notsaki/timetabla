import ErrorCode from "../schema/ErrorCode";

class EntityConflictError extends Error {
    constructor(message = "Entity conflict") {
        super(`${ErrorCode.EntityConflict}: ${message}`);
    }
}

export default EntityConflictError;
