const { Client } = require('pg');
const { getDatabaseURL } = require('./config');

let db;

if (process.env.NODE_ENV === 'production') {
    db = new Client({
        connectionString: getDatabaseURL(),
        ssl: {
            rejectUnauthorized: false
        }
    });
} else {
    db = new Client({
        connectionString: getDatabaseURL()
    });
}

db.connect();

module.exports = db;