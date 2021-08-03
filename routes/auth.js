"use strict"

const express = require("express");
const Auth = require('../models/auth');
const jsonschema = require('jsonschema');
const newUserSchema = require('../schemas/newUserSchema.json');
const userLoginSchema = require('../schemas/userLoginSchema.json');
const { BadRequestError } = require("../expressError");
const { createToken } = require('../helpers/token');

const router = express.Router();

/** User login */
router.post('/login', async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, userLoginSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        // Verify user credentials in database
        const user = await Auth.authenticate(req.body);
        // Create token for the user
        const token = createToken(user);
        return res.json({ token });
    } catch (err) {
        return next(err);
    }
})

/** New user registration */
router.post('/register', async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, newUserSchema);
        if (!validator.valid) {
            const errs = validator.errs.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        // Add user to database
        const newUser = await Auth.register({ ...req.body });
        // Create token for the user
        const token = createToken(newUser);
        return res.json({ token });
    } catch (err) {
        return next(err);
    }
})
module.exports = router;