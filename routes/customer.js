const customerRouter = require('express').Router()
const customerController = require('../controllers/customer')
const orderController = require('../controllers/order');

customerRouter.get('/:id', (req, res, next) => {
    if (req.params.id === '0') return next({ name: 'CastError', message: 'There is no customer saved to database with id of 0' });
    next()
})

const validateEmail = (email) => {
    if (!email) return true // email can be empty
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

customerRouter.post('/', (req, res, next) => {
    const { firstName, lastName, phone, email, admin } = req.body
    if (!firstName) return next({ name: 'ValidationError', message: 'Customer first name connot be null or empty' });
    if (!lastName) return next({ name: 'ValidationError', message: 'Customer last name connot be null or empty' });
    if (!validateEmail(email)) return next({ name: 'ValidationError', message: 'Email is not in valid format' });
    next()
})

customerRouter.get('/', customerController.getCustomers)
customerRouter.get('/:id', customerController.getCustomerById)
customerRouter.get('/:id/orders', orderController.getOrdersOfCustomer)
customerRouter.post('/', customerController.createCustomer)

module.exports = customerRouter