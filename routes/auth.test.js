"use strict"

const request = require("supertest");
const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
} = require("../_testCommon/_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** POST ROUTES */

describe("POST auth/login", () => {
    test("works", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({
                username: "student",
                password: "password"
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            "token": expect.any(String)
        });
    });

    test("Return unauthorized with invalid credentials", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({
                username: "student",
                password: "wrongPassword"
            });
        expect(res.statusCode).toBe(401);
    });

    test("Return bad request if invalid data format", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({
                username: 1,
                password: "password"
            })
        expect(res.statusCode).toBe(400);
    });
});

describe("POST auth/register", () => {

    test("Works - user registration", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({
                username: "test",
                password: "passwordtest",
                first_name: "test",
                last_name: "name",
                email: "test@email.com",
                is_teacher: false
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            'token': expect.any(String)
        });
    });
})
