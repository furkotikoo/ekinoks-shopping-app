const pg = require('pg')

const pool = new pg.Pool({
    user: 'admin',
    password: 'admin',
    host: 'localhost',
    database: 'app',
    port: 5432
})

module.exports = { pool }