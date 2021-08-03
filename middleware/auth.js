"use strict"

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/** 
 * 
 * Authenticate user
 * If token is provided, verify token then store the payloads on
 * res.locals (username, first_name,last_name,email,is_teacher)
 * Not an error if no token was provided or if token is not valid
 * 
 */

function authenticateJWT(req, res, next) {
    try {
        // Get token from the headers
        const authHeader = req.headers && req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            // Save user details to res.locals.user
            res.locals.user = jwt.verify(token, SECRET_KEY);
        }
        return next();
    } catch (err) {
        return next();
    }
}

function ensureUserLoggedIn(req, res, next) {
    try {
        // Check if token was verified and user details are saved
        if (!res.locals.user) throw new UnauthorizedError();
        return next();
    } catch (err) {
        return next(err)
    }
}

function ensureUserIsTeacher(req, res, next) {
    try {
        // Check if token was verified and user details are saved
        if (!res.locals.user || !res.locals.user.is_teacher) throw new UnauthorizedError();
        return next();
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    authenticateJWT,
    ensureUserLoggedIn,
    ensureUserIsTeacher
};

