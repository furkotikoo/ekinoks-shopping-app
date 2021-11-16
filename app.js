const express = require('express')
const app = express()
const customerRouter = require('./routes/customer')
const productRouter = require('./routes/product')
const orderRouter = require('./routes/order')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/customers', customerRouter)
app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

app.listen(3000, () => {
    console.log(`App is running on port 3000`)
})

module.exports = app