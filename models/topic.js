"use strict"

const { rawListeners } = require("../app");
const db = require("../db")

class Topic{
    static async get(id = null) {
        let res
        let sqlString = `SELECT id, topic FROM Topics`
        if (id === null) {
            res = await db.query(sqlString);    
        } else {
            sqlString += ` WHERE id =$1`
            res = await db.query(sqlString,[id]);    
        }
        return res.rows;
    }

    static async add({topic}) {
        const sqlString = `INSERT INTO 
                            topics (topic)
                            VALUES($1)
                            RETURNING id, topic`
        const res = await db.query(sqlString, [topic]);
        return res.rows[0]
    }

    static async edit(id,topic) {
        const sqlString = `UPDATE topics SET 
                        topic = $1
                        WHERE id =  $2
                        RETURNING id, topic`
        const res = await db.query(sqlString, [topic, id]);
        return res.rows[0];
    }

    static async delete(id ) {
        const sqlString = `DELETE FROM topics WHERE id = $1`
        const res = await db.query(sqlString, [id]);
        return (res) ? 'deleted' : 'failed'
    }
}

module.exports = Topic