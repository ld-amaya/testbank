const express = require('express');
const router = express.Router();
const jsonschema = require('jsonschema');
const questionSchema = require('../schemas/question-schema.json');
const Question = require('../models/question');
const { BadRequestError } = require('../expressError');


/** 
 *  
 * GET ROUTES 
 * Needs to be logged in
 * 
 * */

/** Get all questions */
router.get("/", async (req, res, next) => {
    try {
        const questions = await Question.getAll()
        return res.status(201).json({ questions });
    } catch (err) {
        return next(err);
   }
});

/** Get all questions based on topic */
router.get("/:topic", async (req, res, next) => {
    try {
        // Get topic id first, throw badrequesterror if no id
        const topic_id = await Question.getTopicId(req.params.topic);
        if (!topic_id) {
            throw new BadRequestError(errs);
        }
        const questions = await Question.getAll(topic_id.id);
        return res.status(201).json({ questions });
    } catch (err) {
        return next(err);
   }
});

/** Get one question */
router.get("/:id", async (req, res, next) => {
    try {
        const question = await Question.get(req.params.id);
        return res.status(201).json({ question });
    } catch (err) {
        return next(err);
    }
})

/** 
 *  
 * POST ROUTES 
 * Needs to be logged in and a teacher
 * */

/** Add question to database */

router.post('/', async (req,res,next) => {
    try {
        /** 
         * Validate format based on question schema 
         * Requires question, topic, choices a, b,c,d and answer
         * Return bad error request if not complete
         * */ 
        const validator = jsonschema.validate(req.body, questionSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        // Get topic id first, throw badrequesterror if no id
        let {question, topic, image, a, b,c,d,answer} =  req.body
        const topic_id = await Question.getTopicId(topic);
        if (!topic_id) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        // Save to database
        const tid = +topic_id.id;
        const result = await Question.addQuestion({ question, tid, image, a, b, c, d, answer });
        return res.status(201).json({ result });

    } catch (err) {
        return next(err);
    }
})

module.exports = router;