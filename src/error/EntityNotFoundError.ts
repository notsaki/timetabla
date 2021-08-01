import ErrorCode from "../schema/ErrorCode";

class EntityNotFoundError extends Error {
    constructor(message = `${ErrorCode.EntityNotFound}: Entity not found`) {
        super(message);
    }
}

export default EntityNotFoundError;
