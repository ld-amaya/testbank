const db = require("../db");
const { createToken } = require("../helpers/token");
const Auth = require("../models/auth");
const tid=[];
const qid = [];
const uid = [];
const ts = [];

async function commonBeforeAll() {
    await db.query("DELETE FROM questions");
    await db.query("DELETE FROM topics");
    await db.query("DELETE FROM users");

    // Add topic
    let topicId = await db.query(`
    INSERT INTO topics (topic) VALUES ('testTopic')
    RETURNING id`);

    tid.push(+(topicId.rows[0].id))

    topicId = await db.query(`
    INSERT INTO topics (topic) VALUES ('testTopic2')
    RETURNING id`);

    tid.push(+(topicId.rows[0].id))
    
    // Add questions
    let res = await db.query(`INSERT INTO questions (topic_id, question, images, a, b, c, d, answer)
                    VALUES (${tid[0]},'question 1?',null,'a','b','c','d','a')
                    RETURNING id`);
    qid.push(res.rows[0].id);

    res =await db.query(`INSERT INTO questions (topic_id, question, images, a, b, c, d, answer)
                    VALUES (${tid[0]},'question 2?',null,'d','c','b','a','d')
                    RETURNING id`);
    qid.push(res.rows[0].id);

    //Create dummy users
    let user = await Auth.register({
        username: "student",
        password: "password",
        first_name: "stud",
        last_name: "ent",
        email: "student@email.com",
        is_teacher: false
    });
    uid.push(user.id);
    user = await Auth.register({
        username: "teacher",
        password: "password",
        first_name: "teach",
        last_name: "er",
        email:"teacher@email.com",
        is_teacher: true
    });
    uid.push(user.id);
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
// Create dummy users
const studentToken = createToken(
    {
        username: "student",
        first_name: "stud",
        last_name: "ent",
        email:"student@email.com",
        is_teacher: false
    });
const teacherToken = createToken({
        username: "teacher",
        first_name: "teach",
        last_name: "er",
        email:"teacher@email.com",
        is_teacher: true
    });

module.exports = {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    teacherToken,
    studentToken,
    qid,
    tid,
    uid,
    ts
}