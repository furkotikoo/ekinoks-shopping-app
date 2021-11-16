const { pool } = require('../config/db.config')

const getProducts = (request, response, next) => {
    pool.query('SELECT * FROM products', (error, results) => {
        if (error) return next(error)
        response.json(results.rows)
    })
}

const getProductById = (request, response, next) => {
    const productId = request.params.id

    const sql = 'SELECT * FROM products WHERE productId=$1'
    const values = [productId]
    pool.query(sql, values, (error, results) => {
        if (error) return next(error)
        response.json(results.rows[0])
    })
}

const createProduct = (request, response, next) => {
    const {
        name,
        price,
        description
    } = request.body

    const sql = 'INSERT INTO products (name, price, description) VALUES ($1, $2, $3) RETURNING *'
    const values = [name, price, description]
    pool.query(sql, values, (error, result) => {
        if (error) return next(error)
        response.send(`Product is created with ${JSON.stringify(result.rows[0])}`)
    })
}

const updateProduct = (request, response, next) => {
    const id = request.params.id;
    const {
        price,
        description
    } = request.body;

    const sql = 'UPDATE products SET price=$1, description=$2 WHERE productId=$3'
    const values = [price, description, id]
    pool.query(sql, values, (error, resutls) => {
        if (error) return next(error)
        response.json(resutls.rows[0])
    })
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct
}