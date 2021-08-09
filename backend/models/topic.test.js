const Topic = require("./topic");
const { BadRequestError } = require("../expressError");
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

/****************************** GET REQUEST */
describe('get request', ()=> {
    test("works: get()", async () => {
        const res = await Topic.get()
        expect(res).toEqual(
             [{
                id: expect.any(Number),
                topic: 'testTopic'
            },
            {
                id: expect.any(Number),
                topic: 'testTopic2'
            }]
        )
    })
    test("works: get(id)", async () => {
        const res = await Topic.get(tid[0])
        expect(res).toEqual([{
                id: expect.any(Number),
                topic: 'testTopic'
            }])
    })
})

/**************************** CREATE REQUEST */
describe("POST request", function () {
    test("works: add()", async () => {
        const res = await Topic.add({
            topic:'testing'
        })
        expect(res).toEqual({
            id: expect.any(Number),
            topic:'testing'
        })
    })
})


/**************************** UPDATE REQUEST */
describe("PATCH request", function () {
    test("works: edit(id, topic)", async () => {
        const res = await Topic.edit(tid[0], 'edit test')
        expect(res).toEqual({
            id: tid[0],
            topic: 'edit test'
        })
    })
    test("return bad request error for id not found", async () => {
        try {
            await Topic.edit(tid[-1], 'edit test')
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    })
})

/**************************** DELETE REQUEST */
describe("DELETE Request", function () {
    test("works: delete(id)", async () => {
        const res = await Topic.delete(tid[0])
        expect(res).toEqual('deleted');
    });
    test("return bad request error for invalid id", async ()=> {
        try {
            await Topic.delete(0);
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    })
})