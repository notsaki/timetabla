class ConflictError extends Error {
    constructor(message: string = "4000 Entity already exists") {
        super(message);
    }
}

export default ConflictError;
