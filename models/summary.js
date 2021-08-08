const db = require("../db");
const { BadRequestError } = require("../expressError");

class Summary{

    static async get() {
        const sqlString = `SELECT s.start, s.endExam, s.score, t.topic
                        FROM testsummary as s
                        JOIN topics as t
                        ON s.topic_id = t.id`
        const res = await db.query(sqlString);
        return res.rows
    }

    static async getByUser(user_id) {
        const sqlString = `SELECT s.start, s.endExam, s.score, t.topic
                        FROM testsummary as s
                        JOIN topics as t
                        ON s.topic_id = t.id
                        WHERE user_id = $1`
        const res = await db.query(sqlString, [user_id]);
        return res.rows
    }

    static async getByExamId(exam_id) {
        const sqlString = `SELECT s.start, s.endExam, s.score, t.topic
                        FROM testsummary as s
                        JOIN topics as t
                        ON s.topic_id = t.id
                        WHERE s.id = $1`
        const res = await db.query(sqlString, [exam_id]);
        return res.rows
    }

    static async getByUserAndExamId(user_id, exam_id) {
        const sqlString = `SELECT s.start, s.endExam, s.score, t.topic
                        FROM testsummary as s
                        JOIN topics as t
                        ON s.topic_id = t.id
                        WHERE s.user_id = $1 AND s.id = $2`
        const res = await db.query(sqlString, [user_id, exam_id]);
        return res.rows
    }

    static async save(examId, score) {
        const endDate = new Date();
        const sqlString = `UPDATE testsummary
                            SET endExam = $1,
                            score = $2,
                            is_done = $3
                            WHERE id = $4
                            RETURNING user_id, start, endExam, score,is_done,topic_id`
        const res = await db.query(sqlString, [endDate, +score, true, examId]);
        return res.rows[0]
    }
    static async isDone(examId) {
        const sqlString = `SELECT is_done FROM testsummary WHERE id = $1`;
        const res = await db.query(sqlString, [examId]);
        return res.rows[0];
    }
}

module.exports = Summary