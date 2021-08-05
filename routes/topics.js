"use strict"

const express = require("express");
const Topic = require("../models/topic");

const router = express.Router();
const {
    BadRequestError,
    UnauthorizedError
} = require("../expressError");
const {
    ensureUserLoggedIn,
    ensureUserIsTeacher
} = require("../middleware/auth");

/**
 * GET Request
 * Only Accessible of you are logged in
 */
router.get("/", ensureUserLoggedIn, async (req, res, next) => {
    const topic = await Topic.get();
    return res.status(201).json({ topic });
});

router.get("/:id", ensureUserLoggedIn, async (req, res, next) => {
    const topic = await Topic.get(req.params.id);
    return res.status(201).json({ topic });
})

/**
 * POST Request
 * Only Accessible of you are a teacher
 */
router.post("/", ensureUserIsTeacher, async (req, res, next) => {
    const topic = await Topic.add(req.body);
    return res.status(201).json({ topic });
});

/**
 * PATCH Request
 * Only Accessible of you are a teacher
 */
router.patch("/:id", ensureUserIsTeacher, async (req, res, next) => {
    const topic = await Topic.edit(req.body);
    return res.status(201).json({ topic });
})

/**
 * DELETE Request
 * Only Accessible of you are a teacher
 */
router.delete("/:id", ensureUserIsTeacher, async (req, res, next) => {
    const topic = await Topic.delete(req.params.id);
    return res.json({ result: topic });
})

module.exports = router;