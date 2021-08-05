const express = require('express');
const router = express.Router();
const jsonschema = require('jsonschema');
const questionSchema = require('../schemas/questionSchema.json');
const Question = require('../models/question');
const { BadRequestError } = require('../expressError');
const {
    ensureUserLoggedIn,
    ensureUserIsTeacher
} = require('../middleware/auth')


/** 
 * GET ROUTES 
 * Needs to be logged in
 * */

/** 
 * Get all questions 
 * This is only accessible for the teachers
 * Ensure only teacher has access
 * */

router.get("/",ensureUserIsTeacher, async (req, res, next) => {
    try {
        const questions = await Question.getAll()
        return res.status(201).json({ questions });
    } catch (err) {
        return next(err);
   }
});

/** 
 * Get all questions based on topic 
 * This is only accessible for the teachers
 * Ensure only teacher has access
 * */
router.get("/t/:topic", ensureUserIsTeacher, async (req, res, next) => {
    try {
        // Get topic id first, throw badrequesterror if no id
        const topic_id = await Question.getTopicId(req.params.topic);
        if (!topic_id) {   
            throw new BadRequestError();
        }
        const questions = await Question.getAll(topic_id.id);
        return res.status(201).json({ questions });
    } catch (err) {
        return next(err);
   }
});

/** 
 * 
 * Get one question 
 * Any student can access
 * 
 * */
router.get("/q/:id", ensureUserLoggedIn, async (req, res, next) => {
    try {
        const question = await Question.get(req.params.id);
        return res.status(201).json({ question });
    } catch (err) {
        return next(err);
    }
});

/** 
 *  
 * POST ROUTES 
 * Needs to be logged in and a teacher
 * 
 * */

/** 
 * Add question to database 
 * Only Accessible to teachers
 * */

router.post('/',ensureUserIsTeacher, async (req, res, next) => {
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
        let { question, topic, image, a, b, c, d, answer } = req.body
        const topic_id = await Question.getTopicId(topic);
        if (!topic_id) {
            throw new BadRequestError();
        }

        // Save to database
        const tid = +topic_id.id;
        const result = await Question.addQuestion({tid, question, image, a, b, c, d, answer});
        return res.status(201).json({ question: result });
    } catch (err) {
        return next(err);
    }
});


/** 
 *  
 * PATCH ROUTES 
 * Needs to be logged in and a teacher
 * 
 * */

/** Update question in database */
router.patch("/:id",ensureUserIsTeacher, async (req, res, next) => {
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
        let { question, topic, image, a, b, c, d, answer } = req.body
        const topic_id = await Question.getTopicId(topic);
        if (!topic_id) {
            throw new BadRequestError();
        }

        // Get question id if existing
        const qid = await Question.get(req.params.id);
        if (!qid) {
            throw new BadRequestError();
        }

        // Save to database
        const tid = +topic_id.id;
        const id = req.params.id;
        const result = await Question.update({ question, tid, image, a, b, c, d, answer, id });
        return res.status(201).json({ question: result });

    } catch (err) {
        return next(err);
    }
});

/** 
 * DELETE ROUTES 
 * Needs to be logged in and a teacher
 * */

/** Delete question in database */

router.delete("/:id",ensureUserIsTeacher, async (req, res, next) => {
    try {
        const result = await Question.delete(req.params.id);
        return res.status(201).json({ result });
    } catch (err) {
        return next(err)
    }
});

module.exports = router;