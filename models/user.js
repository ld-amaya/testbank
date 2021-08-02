const db = require("../db");
const Bcrypt = require("bcrypt");

const { BadRequestError } = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config");

class User{
    static async register({ username, password, first_name, last_name, email, is_teacher }) {
        //Check if user name exists, return error if true
        let sqlString = `SELECT username FROM users WHERE username = $1`;
        const checkDuplicateUsername = await db.query(sqlString, [username]);
        if (checkDuplicateUsername.rows[0]) {
            throw new BadRequestError(`${username} already taken`);
        }

        // hash user password using bcrypt
        const hashedPassword = await Bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        sqlString = `INSERT INTO 
                    users
                    (
                        username,
                        password,
                        first_name,
                        last_name,
                        email,
                        is_teacher
                    )
                    VALUES ($1,$2,$3,$4,$5,$6)
                    RETURNING username, first_name, last_name, email, is_teacher`;
        const register = await db.query(sqlString,
            [
                username,
                hashedPassword,
                first_name,
                last_name,
                email,
                is_teacher
            ]);
        return register.rows[0];
    }
}
module.exports = User;