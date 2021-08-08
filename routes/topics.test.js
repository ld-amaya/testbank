const request = require("supertest");
const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    studentToken,
    teacherToken,
    tid
} = require("../_testCommon/_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** GET ROUTES */
const data = {topic: [{
                    id: expect.any(Number),
                    topic: 'testTopic'
                },
                {
                    id: expect.any(Number),
                    topic: 'testTopic2'
                }]}
describe("GET /topics", () => {
    
    test("works for teachers", async () => {
        const res = await request(app)
            .get("/topics")
            .set("authorization", `Bearer ${teacherToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(data)
    });

    test("works for students", async () => {
        const res = await request(app)
            .get("/topics")
            .set("authorization", `Bearer ${studentToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(data)
    });

    test("Unauthorized Access", async () => {
        const res = await request(app)
            .get("/topics");
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual({
            error: {
                message: 'Unauthorized user',
                status: 401
            }
        })
    })
})

describe("GET /topics/:id", () => {
    test("works for teachers", async () => {
        const res = await request(app)
            .get(`/topics/${tid[0]}`)
            .set("authorization", `Bearer ${teacherToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            topic: [{
                id: expect.any(Number),
                topic: 'testTopic'
            }]
        })
    });

    test("works for students", async () => {
        const res = await request(app)
            .get(`/topics/${tid[0]}`)
            .set("authorization", `Bearer ${studentToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            topic: [{
                id: expect.any(Number),
                topic: 'testTopic'
            }]
        })
    });

    test("Unauthorized Access", async () => {
        const res = await request(app)
            .get(`/topics/${tid[0]}`)
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual({
            error: {
                message: 'Unauthorized user',
                status: 401
            }
        })
    })
});

/** POST ROUTES */

describe("POST /topics", () => {
    const topic = {
            topic: 'new topic'
        }
    test("works for teachers", async () => {
        const res = await request(app)
            .post(`/topics`)
            .send(topic)
            .set('authorization', `Bearer ${teacherToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            topic: {
                id: expect.any(Number),
                topic: 'new topic'
            }
        });

        const newData = await request(app)
            .get(`/topics`)
            .set('authorization', `Bearer ${teacherToken}`);
        expect(newData.body).toEqual(
            {
                topic: [
                    {
                    id: expect.any(Number),
                    topic: 'testTopic'
                    },
                    {
                        id: expect.any(Number),
                        topic: 'testTopic2'
                    },
                    {
                        id: expect.any(Number),
                        topic: 'new topic'
                    }
                ]
            }
            
        )
    })

    test("Unauthorized access for students", async () => {
        const res = await request(app)
            .post(`/topics`)
            .send(topic)
            .set('authorization', `Bearer ${studentToken}`);
        expect(res.statusCode).toBe(401);
    })

    test("Unauthorized access if not logged", async () => {
        const res = await request(app)
            .post(`/topics`)
            .send(topic)
        expect(res.statusCode).toBe(401);
    })
})

/** PATCH ROUTES */
describe("PATCH /topics/:id", () => {
    test("works - editing topic", async () => {
        const res = await request(app)
            .patch(`/topics/${tid[1]}`)
            .send({
                topic: 'topic edited'
            })
            .set('authorization', `Bearer ${teacherToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            topic: {
                id: +`${tid[1]}`,
                topic: 'topic edited'
            }
        })
    });
    test("Returns bad request error invalid format", async () => {
        const res = await request(app)
            .patch(`/topics/${tid[1]}`)
            .send({
                topics: 'topic edited'
            })
            .set('authorization', `Bearer ${teacherToken}`);
        expect(res.statusCode).toBe(400);
    });
    test("Returns unauthorized error if not teach", async () => {
        const res = await request(app)
            .patch(`/topics/${tid[1]}`)
            .send({
                topic: 'topic edited'
            })
            .set('authorization', `Bearer ${studentToken}`);
        expect(res.statusCode).toBe(401);
        expect(res.body.error.message).toEqual('Unauthorized user');
    });
    test("Returns unauthorized error if not logged in", async () => {
        const res = await request(app)
            .patch(`/topics/${tid[1]}`)
            .send({
                topic: 'topic edited'
            })
        expect(res.statusCode).toBe(401);
        expect(res.body.error.message).toEqual('Unauthorized user');
    });
});

describe("DELETE /topics/:ic", () => {
    test("works", async () => {
        const res = await request(app)
            .delete(`/topics/${tid[1]}`)
            .set('authorization', `Bearer ${teacherToken}`);
        expect(res.statusCode).toBe(200);
    });
})