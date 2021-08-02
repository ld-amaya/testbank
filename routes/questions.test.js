const request = require("supertest");
const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    qid
} = require("../_testCommon/_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** GET ROUTES */

describe("GET /questions", function () {
    const data = {
        questions: [
            {
                id: expect.any(Number),
                topic: 'testTopic',
                question: 'question 1?',
                images: null,
                a: 'a',
                b: 'b',
                c: 'c',
                d: 'd',
                answer: 'a'
            },
            {
                id: expect.any(Number),
                topic: 'testTopic',
                question: 'question 2?',
                images: null,
                a: 'd',
                b: 'c',
                c: 'b',
                d: 'a',
                answer: 'd'
            }
        ]
    }
    
    test("works", async () => {
        let res = await request(app).get("/questions");
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(data)
    });
    
    test("works with filtering per topic", async () => {
        let res = await request(app).get(`/questions/t/testTopic`);
        expect(res.statusCode).toBe(201);
    });

    test("works with filtering per question", async () => {
        let res = await request(app).get(`/questions/q/${qid[0]}`);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({
            question: [
                {
                    id: expect.any(Number),
                    topic: 'testTopic',
                    question: 'question 1?',
                    images: null,
                    a: 'a',
                    b: 'b',
                    c: 'c',
                    d: 'd',
                    answer: 'a'
                }
            ]
        });
    });

    test("404 Error", async () => {
        let res = await request(app).get(`/question`);
        expect(res.statusCode).toBe(404);
    })

    test('400 bad request error', async () => {
        let res = await request(app).get(`/questions/t/random`);
        expect(res.statusCode).toBe(400);
    })
});

/** POST ROUTES */
describe("POST /questions", () => {
    let data = {
        topic: 'testTopic',
        question: 'question add?',
        images: null,
        a: 'b',
        b: 'a',
        c: 'd',
        d: 'c',
        answer: 'b'
    }
    test('Add new question', async () => {
        let res = await request(app)
            .post(`/questions`)
            .send(data);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            question: {
                id: expect.any(Number),
                topic_id: expect.any(Number),
                question: 'question add?',
                images: null,
                a: 'b',
                b: 'a',
                c: 'd',
                d: 'c',
                answer: 'b'
            }
        });
    });
});

/** PATCH ROUTES */
describe('PATCH /:id', () => {
    const data = {
        topic: 'testTopic',
        question: 'question revised?',
        images: null,
        a: 'd',
        b: 'c',
        c: 'b',
        d: 'a',
        answer: 'd'
    }
    test("should udpate question", async () => {
        const res = await request(app)
            .patch(`/questions/${qid[1]}`)
            .send(data);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            question: {
                id: expect.any(Number),
                topic_id: expect.any(Number),
                question: 'question revised?',
                images: null,
                a: 'd',
                b: 'c',
                c: 'b',
                d: 'a',
                answer: 'd'
            }
        })
    })
})

/** DELETE ROUTES */
describe('DELETE /:id', () => {
    test("should delete question", async () => {
        let res = await request(app).delete(`/questions/${qid[1]}`);
        expect(res.statusCode).toBe(201);
    
        res = await request(app).get(`/questions`);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            questions: [{
                id: expect.any(Number),
                topic: 'testTopic',
                question: 'question 1?',
                images: null,
                a: 'a',
                b: 'b',
                c: 'c',
                d: 'd',
                answer: 'a'
            }]
        })
    })
})