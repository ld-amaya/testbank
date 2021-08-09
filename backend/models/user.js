"use strict"

const db = require("../db");
const { BadRequestError } = require("../expressError");

class User{
    static async getId(username) {
        const user = await db.query(`SELECT id FROM users WHERE username = $1`, [username]);
        if (user.rowCount > 0) {
            return user.rows[0].id            
        } else {
            throw new BadRequestError('Student or teacher not found');
        }
        
    }
}

module.exports = User