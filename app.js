const express = require('express');
const {NotFoundError} = require('./expressError')

/** Add JWT Authencitaction */
const { authenticateJWT } = require("./middleware/auth");

/** Add routes */
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const questionsRoutes = require('./routes/questions');
const topicRoutes = require("./routes/topics");
const examRoutes = require("./routes/exam");

const app = express();

/** Allow json format */
app.use(express.json());

/** Verify authentication if present */
app.use(authenticateJWT);

/** Use server routes */
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/questions', questionsRoutes);
app.use('/exam', examRoutes);
app.use('/topics', topicRoutes);


/** Handle page not found for invalid route */
app.use((req, res, next) => {
    return next(new NotFoundError());
});

/** Generic error handler */
app.use((err,req, res, next) => {
    if (process.env.NODE_ENV != 'test') console.error(err.stack);
    const status = err.status || 500
    const message = err.message
    return res.status(status).json({
        error: { message, status }
    });
});

module.exports = app;