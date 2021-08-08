import ErrorCode from "../schema/ErrorCode";

class EntityNotFoundError extends Error {
    constructor(message = "Entity not found") {
        super(`${ErrorCode.EntityNotFound}: ${message}`);
    }
}

export default EntityNotFoundError;
