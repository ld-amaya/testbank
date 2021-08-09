const express = require('express');
const Exam = require("../models/exam");
const Summary = require("../models/summary");

const router = express.Router();
const { UnauthorizedError } = require("../expressError");
const {
    ensureUserLoggedIn,
    ensureUserIsTeacher,
    ensureCorrectUserLogged
} = require('../middleware/auth');

/** 
 * Students retrieves data  of an exam based on number 
 * Should return question, choices, image
 * */
router.get("/student/:username/exam/:examId/:num", ensureCorrectUserLogged, async (req, res, next) => {
    console.log('hi lou');
    const { examId, num } = req.params
    const question = await Exam.get(examId, num);
    res.status(200).json({ question });
})

/** 
 * Students takes an exam 
 * Generate exam exam id
 * Returns all question selected randomly
 * */
router.post("/student/:username/topic/:topic", ensureCorrectUserLogged, async (req, res, next) => {
    try {
        const userID = res.locals.user.id
        const questions = await Exam.create(req.params.topic,userID);
        res.status(201).json({questions})    
    } catch (err) {
        return next(err);
    }
    
})

/** 
 * Student submits exam as done 
 * Returns exam result / student score
 * */
router.patch("/student/:username/exam/:examId/finished", ensureCorrectUserLogged, async (req, res, next) => {
    const examId = req.params.examId
    const isDone = await Summary.isDone(examId);
    if (isDone) res.status(200).json({ result: 'done' });
    const score = await Exam.done(examId);
    const result = await Summary.save(examId, score)
    res.status(201).json({result})
});

/** 
 * Student submits the answer 
 * Return student's answer
 * */
router.patch("/student/:username/exam/:examId/:num", ensureCorrectUserLogged, async (req, res, next) => {
    const { examId, num } = req.params
    // Check if user is done or not
    const isDone = await Summary.isDone(examId);
    if (isDone) res.status(200).json({ result: 'done' });
    const answer = await Exam.save(examId, num, req.body.answer);
    res.status(200).json({ answer });
})

module.exports = router;