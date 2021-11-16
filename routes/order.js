const orderRouter = require('express').Router()
const orderController = require('../controllers/order')

orderRouter.get('/:id', (req, res, next) => {
    if (req.params.id === '0') return next({ name: 'CastError', message: 'There is no order saved to database with id of 0' })
    next()
})

orderRouter.post('/', (req, res, next) => {
    const { customerId, productsIds } = req.body

    if (!customerId) return next({ name: 'ValidationError', message: 'Customer id cannot be null or empty' })
    if (!(productsIds instanceof Array)) return next({ name: 'ValidationError', message: 'Product ids should be send in an array' })
    if (productsIds.length === 0) return next({ name: 'ValidationError', message: 'Product ids cannot be empty' })
    next()
})

orderRouter.get('/', orderController.getOrders)
orderRouter.get('/:id', orderController.getOrderById)
orderRouter.post('/', orderController.makeOrder)

module.exports = orderRouter
