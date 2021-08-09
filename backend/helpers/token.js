const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require("../config");

/** create and return a signed jwt */
function createToken({id,username,first_name, last_name,email, is_teacher}) {
    let payload = {
        id:id,
        username: username,
        first_name: first_name,
        last_name: last_name,
        email:email,
        is_teacher: is_teacher || false
    }
    // sign the token with the SECRET_KEY
    return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };