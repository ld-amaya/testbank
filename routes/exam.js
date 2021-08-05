const express = require('express');
const router = express.Router();

const { UnauthorizedError } = require("../expressError");
const {
    ensureUserLoggedIn,
    ensureUserIsTeacher
} = require('../middleware/auth');


router.post("/test", async (req, res, next) => {
  
})

module.exports = router;