export class DatabaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DatabaseError';
    }
}

export class RecordNotFoundError extends DatabaseError {
    constructor(entity: string, id: number | string) {
        super(`Record not found for entity '${entity}' with ID ${id}`);
        this.name = 'RecordNotFoundError';
    }
}

export class ValidationError extends DatabaseError {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class TransactionError extends DatabaseError {
    constructor(message: string, public readonly originalError: unknown) {
        super(`Transaction failed: ${message}`);
        this.name = 'TransactionError';
    }
}
