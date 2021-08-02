"use strict"

const express = require("express");
const User = require('../models/User');
const jsonschema = require('jsonschema');
const newUserSchema = require('../schemas/newUserSchema.json');
const { BadRequestError } = require("../expressError");

const router = express.Router();

router.post("/register", async (req, res, next) => {
    try {
        const validator = jsonschema.validate(req.body, newUserSchema);
        if (!validator.valid) {
            const errs = validator.errs.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        // Add user to database
        const newUser = await User.register({ ...req.body });
        return res.json({ user: newUser });
    } catch (err) {
        return next(err);
    }
})
module.exports = router;