import Error from "./Error";

/**
 * Some common error classes that might be needed in the development process.
 */
export class NotFoundError extends Error {
    constructor(message = "Not found.") {
        super(message, "NOT_FOUND");
    }
}

type NotAuthorizedErrorArgsType = {
    message?: string;
    code?: string;
    data?: any;
};

export class NotAuthorizedError extends Error {
    public data?: string;
    constructor({ message, code, data }: NotAuthorizedErrorArgsType = {}) {
        super(message || `Not authorized.`, code || `NOT_AUTHORIZED`);
        this.data = data;
    }
}


export default Error;
