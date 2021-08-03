const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require("../config");
const { createToken } = require("../helpers/token");

describe("Create token", () => {
    test("works creating token", async () => {
        const data = {
            username: "student",
            first_name: "stud",
            last_name: "ent",
            email: "student@email.com",
            is_teacher: false
        }
        const token = await createToken(data);
        const payload = jwt.verify(token, SECRET_KEY);
        expect(payload).toEqual({
            ...data,
            iat: expect.any(Number)
        });
    })
})