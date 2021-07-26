const express = require('express');
const {NotFoundError} = require('./expressError')

/** Add routes */
const usersRoutes = require('./routes/users');
const questionsRoutes = require('./routes/questions');

const app = express();

/** Allow json format */
app.use(express.json());

/** Create server routes */
app.use('/users', usersRoutes);
app.use('/questions', questionsRoutes);

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