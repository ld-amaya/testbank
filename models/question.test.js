const db = require("../db");
const Question = require("./question");
const { BadRequestError, NotFoundError } = require("../expressError");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    qid,
    tid
} = require("../_testCommon/_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/***************************************** Get Request */

describe('get requests', () => {
    test('works getAll()', async () => {
        const res = await Question.getAll();
        expect(res).toEqual([
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
        ]);
    });

    test("works with getTopicId", async () => {
        const res = await Question.getTopicId('testTopic');
        expect(res).toEqual({
            id: tid[0]
        });
    });

    test("return Badrequest for topic not listed", async () => {
        try {
            await Question.getTopicId('TopicNotListed');
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    test("works with single id", async () => {
        const res = await Question.get(qid[0]);
        expect(res).toEqual([
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
        ])
    });

    test("return Badrequest for question id not listed", async () => {
        try {
            await Question.get(0);
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});


/***************************************** POST Request */

describe("POST Requests", () => {
    test("works: POST new question", async () => {
        // get topic id
        const tid = await Question.getTopicId('testTopic');
        const data = {
            question: 'test question?',
            images: null,
            a: 'test a',
            b: 'test b',
            c: 'test c',
            d: 'test d',
            answer: 'a'
        }
        const res = await Question.addQuestion({ tid:tid.id, ...data});
        expect(res).toEqual({
            id: expect.any(Number),
            topic_id: tid.id,
            question: 'test question?',
            images: null,
            a: 'test a',
            b: 'test b',
            c: 'test c',
            d: 'test d',
            answer: 'a'
        })
    });
});

/***************************************** UPDATE Request */

describe("UPDATE Request", () => {
    test("works: UPDATE question depending on id", async ()=>{
        // get topic id
        const tid = await Question.getTopicId('testTopic');
        const data = {
            question: 'question 1?',
            images: null,
            a: 'a',
            b: 'b',
            c: 'c',
            d: 'd',
            answer: 'b'
        }
        const res = await Question.update({ tid: tid.id, id: qid[0], ...data });
        expect(res).toEqual(
            {
                id: expect.any(Number),
                topic_id: tid.id,
                question: 'question 1?',
                images: null,
                a: 'a',
                b: 'b',
                c: 'c',
                d: 'd',
                answer: 'b'
            }
        )
    });

    test("Return Badrequest for question id not listed", async () => {
        try {
            // get topic id
            const tid = await Question.getTopicId('testTopic');
            const data = {
                question: 'question 1?',
                images: null,
                a: 'a',
                b: 'b',
                c: 'c',
                d: 'd',
                answer: 'b'
            }
            await Question.update({ tid: tid.id, id: 0, ...data })
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});


/***************************************** DELETE Request */
describe("DELETE Request", () => {
    test('works: delete question based on id', async () => {
        const res = await Question.delete(qid[0]);
        expect(res).toEqual('deleted');
    });
    test("Return Badrequest for question id not listed", async () => {
        try {
            await Question.delete(0);
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
})