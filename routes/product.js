const productRouter = require('express').Router()
const productController = require('../controllers/product')

const validationForProduct = (req, res, next) => {
    const { name, price, description } = req.body

    if (req.method === 'PUT' || req.method === 'GET') {
        if (req.params.id === '0') return next({ name: 'CastError', message: 'There is no product saved to database with id of 0' })
    } else if (req.method === 'POST') {
        if (!name) return next({ name: 'ValidationError', message: 'Product name cannot be empty' })
        if (price === undefined || price === null) return next({ name: 'ValidationError', message: 'Price is not defined' })
        if (parseInt(price) <= 0 || parseFloat(price) <= 0) return next({ name: 'ValidationError', message: 'Price should be greater than zero' })
    }

    next()
}

productRouter.get('/:id', validationForProduct)
productRouter.post('/', validationForProduct)
productRouter.put('/:id', validationForProduct)

productRouter.get('/', productController.getProducts)
productRouter.get('/:id', productController.getProductById)
productRouter.post('/', productController.createProduct)
productRouter.put('/:id', productController.updateProduct)

module.exports = productRouter