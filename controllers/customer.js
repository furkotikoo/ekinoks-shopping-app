const { pool } = require('../config/db.config')

const getCustomers = (request, response) => {
    pool.query('SELECT * FROM customers', (error, results) => {

        if (error) {
            console.log(`error getCustomers`, error)
            response.status(404).end();
        }

        response.json(results.rows)
    })
}

const getCustomerById = (request, response, next) => {
    const sql = 'SELECT * FROM customers WHERE customerId=$1'
    const values = [request.params.id]

    pool.query(sql, values, (error, results) => {
        if (error) {
            // console.log(`error getCustomerById `, error)
            // response.status(404).end()
            return next(error)
        }
        response.json(results.rows)
    })
}

const createCustomer = (request, response) => {
    const {
        firstName,
        lastName,
        phone,
        email,
        admin = false
    } = request.body

    const sql = 'INSERT INTO customers (firstName, lastName, phone, email, admin) VALUES($1, $2, $3, $4, $5) RETURNING *'
    const values = [firstName, lastName, phone, email, admin]

    pool.query(sql, values, (error, result) => {
        if (error) {
            console.log(`error createCustomer`, error)
            response.status(400).end()
            return false
        }
        console.log(`result`, result)
        response.send(`Customer created with ID: ${JSON.stringify(result.rows[0])}`)
    })

}

module.exports = {
    getCustomers,
    getCustomerById,
    createCustomer
}