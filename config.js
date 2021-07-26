require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || "jameslou"

const PORT = +process.env.PORT || 3001

function getDatabseURL() {
    return (process.env.NODE_ENV === "test")
        ? "testbank_test" :
        process.env.DATABSE_URL || "testbank";
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "tests" ? 1 : 12;

module.exports = {
    SECRET_KEY,
    PORT,
    getDatabseURL,
    BCRYPT_WORK_FACTOR
}