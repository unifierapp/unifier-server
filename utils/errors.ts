export class HTTPError extends Error {
    httpCode = 500
    code = 'ERROR_SERVER_UNSPECIFIED_ERROR'

    constructor(message = 'Internal server error.', httpCode?: number) {
        super(message)
        if (httpCode) {
            this.httpCode = httpCode
        }
    }
}

export class IncorrectCredentialsError extends HTTPError {
    httpCode = 401
    code = 'ERROR_INCORRECT_CREDENTIALS'

    constructor(message = 'Credentials are incorrect.') {
        super(message)
    }
}

export class NotFoundError extends HTTPError {
    httpCode = 404
    code = 'ERROR_NOT_FOUND'

    constructor(message = 'Resource not found.') {
        super(message)
    }
}

export class BadArgumentError extends HTTPError {
    httpCode = 400
    code = 'ERROR_BAD_ARGUMENT'

    constructor(message = 'Bad argument.') {
        super(message)
    }
}

export class UnauthorizedError extends HTTPError {
    httpCode = 401
    code = 'ERROR_UNAUTHORIZED'

    constructor(message = 'Endpoint can\'t be used. The user has not signed in.') {
        super(message)
    }
}

export class AlreadyExistsError extends HTTPError {
    httpCode = 401
    code = 'ERROR_UNAUTHORIZED'

    constructor(message = 'This resource already exists.') {
        super(message)
    }
}

export class UserMismatchError extends HTTPError {
    httpCode = 403
    code = 'ERROR_USER_MISMATCH'

    constructor(
        message = 'This resource belongs to another user. You can\'t access this.'
    ) {
        super(message)
    }
}