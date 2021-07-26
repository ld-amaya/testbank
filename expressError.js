/** Create custom errors */

class ExpressError extends Error {
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status
    }
}

/** 400 Bad reqeust error */
class BadRequestError extends ExpressError{
    constructor(message = 'Bad Request') {
        super (message, 400)
    }
}

/** 401 Unauthorized Error */
class UnauthorizedError extends ExpressError {
    constructor(message = 'Unauthorized user') {
        super(message, 401)
    }
}

/** 403 Forbidden Request */
class ForbiddenError extends ExpressError{
    constructor(message = 'Bad Request') {
        super(message, 403)
    }
}

/** 404 Not found error */
class NotFoundError extends ExpressError {
    constructor(message = 'Page Not Found') {
        super(message, 404);
    }
}

module.exports = {
    ExpressError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError
};





    
