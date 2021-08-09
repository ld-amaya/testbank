"use strict"

const express = require("express");

const topicSchema = require("../schemas/topicSchema.json");
const Topic = require("../models/topic");
const checkSchema = require("../helpers/checkSchema");
const { BadRequestError } = require("../expressError")
const router = express.Router();
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
    return res.status(200).json({ topic });
});

/** Get topic based on id */
router.get("/:id", ensureUserLoggedIn, async (req, res, next) => {
    const topic = await Topic.get(req.params.id);
    return res.status(200).json({ topic });
})

/**
 * POST Request
 * Only Accessible of you are a teacher
 */
router.post("/", ensureUserIsTeacher, async (req, res, next) => {
    try {
        checkSchema(req.body, topicSchema);
        const topic = await Topic.add(req.body);
        return res.status(200).json({ topic });    
    } catch (err) {
        return next(err);
    }
    
});

/**
 * PATCH Request
 * Only Accessible of you are a teacher
 */
router.patch("/:id", ensureUserIsTeacher, async (req, res, next) => {
    try {
        checkSchema(req.body, topicSchema);
        const topic = await Topic.edit(req.params.id, req.body.topic);
        return res.status(200).json({ topic });    
    } catch (err) {
        return next(err);
    }
    
})

/**
 * DELETE Request
 * Only Accessible of you are a teacher
 */
router.delete("/:id", ensureUserIsTeacher, async (req, res, next) => {
    const topic = await Topic.delete(req.params.id);
    return res.status(200).json({ result: topic });
})

module.exports = router;