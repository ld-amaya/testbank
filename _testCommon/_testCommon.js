const db = require("../db");
const tid=[];
const qid = [];


async function commonBeforeAll() {
    await db.query("DELETE FROM questions");
    await db.query("DELETE FROM topics");

    const topicId = await db.query(`
    INSERT INTO topics (topic) VALUES ('testTopic')
    RETURNING id`);

    tid.push(+(topicId.rows[0].id))
    let res = await db.query(`INSERT INTO questions (topic_id, question, images, a, b, c, d, answer)
                    VALUES (${tid[0]},'question 1?',null,'a','b','c','d','a')
                    RETURNING id`);
    qid.push(res.rows[0].id);

    res =await db.query(`INSERT INTO questions (topic_id, question, images, a, b, c, d, answer)
                    VALUES (${tid[0]},'question 2?',null,'d','c','b','a','d')
                    RETURNING id`);
    qid.push(res.rows[0].id);
}

async function commonBeforeEach() {
    await db.query("BEGIN");
}

async function commonAfterEach() {
    await db.query("ROLLBACK");
}

async function commonAfterAll() {
    await db.end();
}

module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    qid,
    tid
}