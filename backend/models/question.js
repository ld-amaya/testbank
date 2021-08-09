const db = require('../db');
const { BadRequestError } = require('../expressError');

class Question{
    /** 
     *  
     * SELECT REQUESTS 
     * 
     * */
    
    /** Get all questions */
    static async getAll(topic = null) {
        let questions;
        let sqlString = `SELECT 
        q.id,
        t.topic,
        q.question,
        q.images,
        q.a,
        q.b,
        q.c,
        q.d,
        q.answer
        FROM questions as q
        JOIN topics as t
        ON t.id = q.topic_id`
        if (topic) {
            sqlString += ` WHERE q.topic_id = $1 ORDER BY q.id`;
            questions = await db.query(sqlString, [topic]);
        } else {
            sqlString += ` ORDER BY q.id`
            questions = await db.query(sqlString);
        }
        return questions.rows;
    }

    /** Retrieve topic id */
    static async getTopicId(topic) {
        const sqlString = `SELECT id FROM topics WHERE topic = $1`;
        const topic_id = await db.query(sqlString, [topic]);
        if (topic_id.rows.length <= 0) {
            throw new BadRequestError(`${topic} not found`);
        }
        return topic_id.rows[0]
    }

    /** Retrieve one question based on id */
    static async get(id) {
        const sqlString = `SELECT 
        q.id,
        t.topic,
        q.question,
        q.images,
        q.a,
        q.b,
        q.c,
        q.d,
        q.answer
        FROM questions as q
        JOIN topics as t
        ON t.id = q.topic_id
        WHERE q.id = $1`
        const question = await db.query(sqlString, [id]);
        if (question.rows.length <= 0) {
            throw new BadRequestError('Question id not found');
        }
        return question.rows; 
        
    }

    /** 
     *  
     * POST REQUESTS 
     * 
     * */
    
    /** ADD QUESTION */
    static async addQuestion({tid, question, image = null, a, b, c, d, answer}) {
        const sqlString = `INSERT INTO 
                            questions (topic_id,question,images,a,b,c,d,answer)
                            VALUES($1,$2,$3,$4,$5,$6,$7,$8)
                            RETURNING id,topic_id,question,images,a,b,c,d,answer`;
        const topic_id = +tid;
        const res = await db.query(sqlString, [topic_id, question, image, a, b, c, d, answer]);
        return (res) ? res.rows[0] : 'failed'
    }

    /** 
     *  
     * UPDATE REQUESTS 
     * 
     * */
    
    /** Update QUESTION */
    static async update({ question, tid, image = null, a, b, c, d, answer ,id }) {
        const sqlString = `UPDATE questions SET 
                                topic_id = $1,
                                question = $2,
                                images = $3,
                                a = $4,
                                b = $5,
                                c = $6,
                                d = $7,
                                answer = $8
                            WHERE id = $9
                            RETURNING id,topic_id,question,images,a,b,c,d,answer`;
        const res = await db.query(sqlString, [tid, question, image, a, b, c, d, answer,id]);
        return (res) ? res.rows[0] : 'failed'
    }

    /** 
     *  
     * DELETE REQUESTS 
     * 
     * */
    
    /** DELETE QUESTION */
    static async delete(id) {
        const sqlString = `DELETE FROM questions WHERE id = $1`
        const res = await db.query(sqlString, [id]);
        return (res) ? 'deleted' : 'failed'
    }
}

module.exports = Question;