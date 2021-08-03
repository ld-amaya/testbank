"use strict"

const db = require("../db");
const Auth = require("./auth");

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError
} = require("../expressError");

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

/**
 *  POST Request User Login
 * */
describe("user login", () => {
    test("works user login", async () => {
        const user = await Auth.authenticate({
            username: "student",
            password: "password"
        });
        expect(user).toEqual({
            username: "student",
            first_name: "stud",
            last_name: "ent",
            email: "student@email.com",
            is_teacher: false
        });
    });
    
    test("invalid username", async () => {
        try {
            await Auth.authenticate({
                username: "notFoundUser",
                password: "password"
            });
            fail()
        } catch (err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
    });

    test("invalid password", async () => {
        try {
            await Auth.authenticate({
                username: "student",
                password: "NotThePassword"
            });
            fail()
        } catch (err) {
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
    });
});

/**
 *  POST Request User Registration
 * */

describe("POST User Registration", () => {
    test("works for new user", async () => {
        const user = await Auth.register({
            username: "newUser",
            password: "password",
            first_name: "new",
            last_name: "user",
            email: "newUser@email.com",
            is_teacher: false
        });
        expect(user).toEqual({
            username: "newUser",
            first_name: "new",
            last_name: "user",
            email: "newUser@email.com",
            is_teacher: false
        })
    });
})