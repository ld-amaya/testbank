"use strict"

const express = require("express");
const Auth = require('../models/auth');
const jsonschema = require('jsonschema');
const newUserSchema = require('../schemas/newUserSchema.json');
const userLoginSchema = require('../schemas/userLoginSchema.json');
const checkSchema = require("../helpers/checkSchema");
const { BadRequestError } = require("../expressError");
const { createToken } = require('../helpers/token');

const router = express.Router();

/** User login */
router.post('/login', async (req, res, next) => {
    try {
        await checkSchema(req.body, userLoginSchema);
        // Verify user credentials in database
        const user = await Auth.authenticate(req.body);
        // Create token for the user
        const token = createToken(user);
        return res.status(201).json({ token });
    } catch (err) {
        return next(err);
    }
})

/** New user registration */
router.post('/register', async (req, res, next) => {
    try {
        await checkSchema(req.body, newUserSchema);
        // Add user to database
        const newUser = await Auth.register({ ...req.body });
        // Create token for the user
        const token = createToken(newUser);
        return res.status(201).json({ token });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;