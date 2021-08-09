"use strict"

const express = require("express");
const Summary = require("../models/summary");
const User = require("../models/user");
const router = express.Router();
const {
    ensureUserIsTeacher,
    ensureCorrectUserLogged
} = require("../middleware/auth");

router.get("/", ensureUserIsTeacher, async (req, res, next) => {
    try {
        const result = await Summary.get();
        return res.status(200).json({ result });    
    } catch (err) {
        console.log(err);
        return next(err);
    }
    
})

router.get("/exam/:id", ensureUserIsTeacher, async (req, res, next) => {
    try {
        const result = await Summary.getByExamId(req.params.id);
        return res.status(200).json({ result });
    }catch(err){
        return next(err);
    }
})

router.get("/student/:username", ensureCorrectUserLogged, async (req, res, next) => {
    try {
        const user_id = await User.getId(req.params.username);
        const result = await Summary.getByUser(+user_id);
        return res.status(200).json({ result });
    }catch(err){
        return next(err);
    }
})

router.get("/student/:username/exam/:id", ensureCorrectUserLogged, async (req, res, next) => {
    try {
        const id = req.params.id
        const user_id = await User.getId(req.params.username);
        const result = await Summary.getByUserAndExamId(user_id, id);
        return res.status(200).json({ result });    
    } catch (err) {
        return next(err);
    }
    
})

router.get("/exam/:id", ensureCorrectUserLogged, async (req, res, next) => {
    try {
        const id = req.params
        const result = await Summary.get({id});
        return res.status(200).json({ result });    
    } catch (err) {
        return next(err);
    }
    
})

module.exports = router;