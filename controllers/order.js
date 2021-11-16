const logger = require('../utils/logger')
const { pool } = require('../config/db.config')
const format = require('pg-format');

function nestQuery(query) {
    return `
    coalesce(
      (
        SELECT array_to_json(array_agg(row_to_json(x)))
        FROM (${query}) x
      ),
      '[]'
    )
  `;
}

const getOrders = (request, response, next) => {

    const strQuery = `
        SELECT c.customerId as customer_Id, c.firstName, c.lastName, c.phone, c.email, c.admin,
        ${nestQuery(`
            SELECT o.orderId as order_Id, total,
            ${nestQuery(`
                SELECT oit.orderItemId as order_item_Id,
                ${nestQuery(`
                    SELECT *
                    FROM products p
                    WHERE oit.productId = p.productId
                `)}AS products
                FROM order_item oit
                WHERE oit.orderId = o.orderId
            `)}AS order_item
            FROM orders o
            WHERE c.customerId = o.customerId
        `)}AS orders
        FROM customers c
    `
    pool.query(strQuery, (error, results) => {

        if (error) return next(error)

        response.json(results.rows)
    })

}

const getOrderById = (request, response, next) => {
    const orderId = request.params.id

    const strQuery =
        `SELECT o.orderId as order_Id, total,
            ${nestQuery(`
                SELECT oit.orderItemId as order_item_Id,
                ${nestQuery(`
                    SELECT *
                    FROM products p
                    WHERE oit.productId = p.productId
                `)}AS products
                FROM order_item oit
                WHERE oit.orderId = o.orderId
            `)}AS order_item
        FROM orders o
        WHERE o.orderId = ${orderId}
        `

    pool.query(strQuery, (error, results) => {
        if (error) return next(error)
        response.json(results.rows)
    })
}

const getOrdersOfCustomer = (request, response, next) => {
    const customerId = request.params.id
    const sql = `
    SELECT c.customerId as customer_Id, c.firstName, c.lastName, c.phone, c.email, c.admin,
    ${nestQuery(
        `
        SELECT o.orderId as order_Id, o.total,
           ${nestQuery(`
                SELECT oit.orderItemId as order_item_Id,
                ${nestQuery(`
                    SELECT *
                    FROM products p
                    WHERE oit.productId = p.productId
                `)}AS products
                FROM order_item oit
                WHERE oit.orderId = o.orderId
            `)}AS order_item
        FROM orders o
        WHERE o.customerId = c.customerId
        `
    )} AS orders
    FROM customers c
    WHERE c.customerId = ${customerId}
    `

    pool.query(sql, (error, results) => {
        if (error) return next(error)
        response.json(results.rows)
    })

}

const makeOrder = (request, response, next) => {

    const { customerId, productsIds } = request.body

    pool.connect((err, client, done) => {
        if (err) {
            console.log(`error connecting to client`, error)
            response.status(400).end()
            return false
        }
        const shouldAbort = err => {
            if (err) {
                console.error('Error in transaction', err.stack)
                client.query('ROLLBACK', err => {
                    if (err) {
                        console.error('Error rolling back client', err.stack)
                    }
                    // release the client back to the pool
                    done()
                })
            }
            return !!err
        }

        client.query('BEGIN', err => {
            if (shouldAbort(err)) return next(err)

            const calculateTotal = 'SELECT SUM(price) as total FROM products WHERE productId = ANY($1)'
            const calculateTotalValues = [productsIds]
            client.query(calculateTotal, calculateTotalValues, (err, res) => {
                if (shouldAbort(err)) return next(err)
                const total = res.rows[0].total

                const createOrder = 'INSERT INTO orders(customerId,total) VALUES($1,$2) RETURNING orderId'
                const createOrderValues = [customerId, total]
                client.query(createOrder, createOrderValues, (err, res) => {
                    if (shouldAbort(err)) return next(err)

                    const orderId = res.rows[0].orderid

                    const createOrderItemValues = productsIds.map(productId => [orderId, productId])
                    // [ [ 29, 1 ], [ 29, 2 ] ]

                    const createOrderItem = format('INSERT INTO order_item(orderId,productId) VALUES %L', createOrderItemValues);
                    // INSERT INTO order_item(orderId,productId) VALUES ('29', '1'), ('29', '2')

                    client.query(createOrderItem, (err, res) => {
                        if (shouldAbort(err)) return next(err);

                        client.query('COMMIT', err => {
                            if (err) {
                                logger.error('Error committing transaction', err.stack)
                            }
                            done()
                            response.status(200).send('Order created successfully')
                        })
                    })

                })
            })
        })

    })

}

module.exports = {
    getOrders,
    getOrderById,
    getOrdersOfCustomer,
    makeOrder
}