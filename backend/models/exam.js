"use strict"

const db = require("../db");
const { UnauthorizedError } = require("../expressError");

class Exam{

    static async get(examId, num) {
        const sqlString = `SELECT q.question,q.images, q.a, q.b, q.c, q.d, t.answer as your_answer
                FROM questions as q
                JOIN test as t
                ON q.id =t.question_id
                WHERE t.testsummary_id =$1 AND num = $2`
        const res = await db.query(sqlString, [examId, num]);
        return res.rows[0];
    }

    static async getRandomQuestions(topic_id) {
        const sqlString = `SELECT
                    id,
                    question,
                    a,
                    b,
                    c,
                    d,
                    answer
                    FROM questions
                    WHERE topic_id= $1
                    ORDER by RANDOM()
                    LIMIT 10`
        const res = await db.query(sqlString, [topic_id]);
        return res.rows
    }

    static async create(topic, userID) {
        // get topic id
        let sqlString
        const tid = await db.query(`SELECT id FROM topics WHERE topic = $1`, [topic]);
        const topic_id = tid.rows[0].id;
        //Get random questions first
        const questions = await this.getRandomQuestions(topic_id);
    
        // Create the test summary details
        const newTest = await db.query(`INSERT INTO 
                        testsummary (user_id,topic_id)
                        VALUES ($1,$2)
                        RETURNING id`,
                        [userID, topic_id])
        const test_id = newTest.rows[0].id
        //Save random questions to test table
        for (let i = 0; i < questions.length; i++) {
            sqlString = `INSERT INTO test (user_id, testsummary_id, question_id,num, a,b,c,d)
            VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`
            let res = await db.query(sqlString,
                [
                    userID,
                    test_id,
                    questions[i].id,
                    i + 1,
                    questions[i].a,
                    questions[i].b,
                    questions[i].c,
                    questions[i].d
                ]);
        }
        return questions;
    }

    static async save(examId, num, answer) {
        //Get correct anaswer
        let sqlString = `SELECT q.answer 
                        FROM questions as q
                        JOIN test as t
                        ON t.question_id = q.id
                        WHERE testsummary_id = $1 AND num = $2`
        const correct_answer = await db.query(sqlString, [examId, num]);
        let isCorrect = false
        if (correct_answer.rowCount > 0) {
            isCorrect = correct_answer.rows[0].answer === answer
        }
        
        // Save answer to test
        sqlString = `UPDATE test
                    SET answer= $1, is_correct = $2
                    WHERE testsummary_id = $3 AND num = $4
                    RETURNING answer`
        const res = await db.query(sqlString, [answer,isCorrect, examId, num]);
        return res.rows[0];
    }

    static async done(examId) {
        // Get user score 
        let sqlString = `SELECT testsummary_id FROM test WHERE is_correct =$1 AND testsummary_id = $2`
        const getScore = await db.query(sqlString, [true, examId]);
        console.log(getScore.rows);
        const score = getScore.rowCount
        return score
    }
}

module.exports = Exam