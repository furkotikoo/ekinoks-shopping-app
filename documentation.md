# SHOPPING APP

> In this project we assumed that we have an shooping app where customers can register and order any product. Customers can display their orders and order product details as when they order.  
> The creation of customers and products held by admin. The products price and descriptions can be changed by admin.

## TABLE OF CONTENTS

  - [DATABASE DESIGN](#database-design-)
    - [Table: customers](#table-customers-)
        - [`Primary Key` : customerId](#primary-key--customerid)
        - [`Columns[]`](#columns)
    - [Table: orders](#table-orders-)
        - [`Primary Key` : orderId](#primary-key--orderid)
        - [`Foreign Keys[]`](#foreign-keys)
        - [`Columns[]`](#columns-1)
    - [Table: order_item](#table-order_item-)
        - [`Primary Key` : orderItemId](#primary-key--orderitemid)
        - [`Foreign Keys[]`](#foreign-keys-1)
        - [`Columns[]`](#columns-2)
    - [Table: products](#table-products-)
        - [`Primary Key` : productId](#primary-key--productid)
        - [`Columns[]`](#columns-3)
    - [Table Relations](#table-relations-)
  - [Project Structure](#project-structure-)
  - [package.json](#packagejson-)
  - [app.js](#appjs-)
  - [db.config.js](#dbconfigjs-)
  - [controllers](#controllers-)
    - [customer](#customer-controller)
    - [order](#order-controller)
    - [product](#product-controller)
  - [requests](#requests)
  - [routes](#routes)
  - [utils](#utils)
  - [.gitignore](#gitignore)

## DATABASE DESIGN <a id="database-design-"></a>

I created four tables via pgAdmin GUI

### Table: customers <a id="table-customers-"></a>

##### `Primary Key` : customerId <a id="primary-key--customerid"></a>

##### `Columns[]` <a id="columns"></a>

| `Name`     | `Type`             | `Nullable` |
| ---------- | ------------------ | ---------- |
| customerID | int auto_increment | `false`    |
| firstName  | varchar(30)        | `false`    |
| lastName   | varchar(30)        | `false`    |
| email      | varchar(50)        | `true`     |
| phone      | varchar(13)        | `true`     |
| admin      | boolean            | `true`     |

---

### Table: orders <a id="table-orders-"></a>

##### `Primary Key` : orderId <a id="primary-key--orderid"></a>

##### `Foreign Keys[]` <a id="foreign-keys"></a>

| `Columns`  | `Ref Table` | `Ref Columns` | `Options` |
| ---------- | ----------- | ------------- | --------- |
| customerId | customers   | customerId    |           |

##### `Columns[]` <a id="columns-1"></a>

| `Name`     | `Type`             | `Nullable` |
| ---------- | ------------------ | ---------- |
| orderID    | int auto_increment | `false`    |
| customerId | int                | `false`    |
| total      | double             | `true`     |

---

### Table: order_item <a id="table-order-items-"></a>

##### `Primary Key` : orderItemId <a id="primary-key--orderitemid"></a>

##### `Foreign Keys[]` <a id="foreign-keys-1"></a>

| `Columns` | `Ref Table` | `Ref Columns` | `Options` |
| --------- | ----------- | ------------- | --------- |
| orderId   | orders      | orderId       |           |
| productId | products    | productId     |           |

##### `Columns[]` <a id="columns-2"></a>

| `Name`      | `Type`             | `Nullable` |
| ----------- | ------------------ | ---------- |
| orderItemId | int auto_increment | `false`    |
| orderId     | int                | `false`    |
| productId   | int                | `false`    |

---

### Table: products <a id="table-products-"></a>

##### `Primary Key` : productId <a id="primary-key--productid"></a>

##### `Columns[]` <a id="columns-3"></a>

| `Name`      | `Type`             | `Nullable` |
| ----------- | ------------------ | ---------- |
| productID   | int auto_increment | `false`    |
| name        | varchar(100)       | `false`    |
| price       | double             | `false`    |
| description | text               | `true`     |

---

### Table Relations <a id="table-relations-"></a>
> - customers and orders tables has `one-to-many` relation : means that a customer can has many orders but an order only belongs to one customer
> - orders and order_item tables has `one-to-many` relation : means that an order can has many order_items but an order_item only belongs to one customer
> - products and order_item tables has `one-to-many` relation : means that a product can be included in many order_items but an order_item only has one customer

> order_item table holds two foreign keys `orderId and productId`. order_item table builds a bridge between orders and products tables. 

==========================================================================================================

## Project Structure <a id="project-structure-"></a>

├── app.js  
├── config  
│ └── db.config.js  
├── controllers  
│ └── customer.js  
│ └── order.js  
│ └── product.js  
├── node_modules  
├── requests  
│ └── customer.js  
│ └── order.js  
│ └── product.js  
├── routes  
│ └── customer.js  
│ └── order.js  
│ └── product.js  
├── utils  
│ ├── logger.js  
│ └── middleware.js  
├── package-lock.json  
├── package.json  
├── .gitignore

## package.json <a id="packagejson-"></a>

The project's package.json file looks like

```json
{
  "name": "app",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon app.js"
  },
  "author": "furkan",
  "license": "MIT",
  "devDependencies": {
    "nodemon": "^2.0.15"
  },
  "dependencies": {
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "pg": "^8.7.1",
    "pg-format": "^1.0.4"
  }
}
```

The application runs with `npm run dev` which executes the script `nodemon app.js`.  
**Nodemon** is used to automate restarting the application whenever it is saved after changes.

`dotenv` package is installed to enable using of enviroments variables  
`express` dependency is used to manage routing and middlewares  
`pg` package is used to connect and manage CRUD operations on postgres database  
`pg-format` package is used to create dynamic SQL queries

## app.js <a id="appjs-"></a>

app.js is the main page of the project  
It set to be start in development mode with node script in `package.json` file as

```json
"dev": "nodemon app.js"
```

It is responsible for routing the endpoints and initializing middlewares.

## db.config.js <a id="dbconfigjs-"></a>

db.config.js configurates the connection to postgres database.  
It then imported in controllers to execute queries on tables.  
It exports the `pool` object that generated from `pg` package with connection informations (user,password,host,database,port)

```javascript
const pg = require("pg");

const pool = new pg.Pool({
  user: "admin",
  password: "admin",
  host: "localhost",
  database: "app",
  port: 5432,
});

module.exports = { pool };
```

## controllers <a id="controllers"></a>

controllers folder has three conttrollers **customer.js**, **order.js**, **product.js**. These controllers handle CRUD operations on tables.

### customer.js <a id="customer-controller"></a>
>
> It exporting three modules **getCustomers**, **getCustomerById**, **createCustomer**. As their names suggest they operate respectively;
>
> - getting all of the customers,
> - getting customer who has the id that send via `req.params`
> - and creating new customer with the information that send via `req.body` object.

### order.js <a id="order-controller"></a>
>
> It exporting four modules **getOrders**, **getOrderById**, **getOrderOfCustomer**, **makeOrder**. As their names suggest they operate respectively;
>
> - getting all of orders,
> - getting order who has the id that send via `req.params`,
> - getting order whose customer has the id that send via `req.params`
> - and creating new order with the information that send via `req.body` object.    
> order.js controller uses a helper function that is defined in it to return structured result from _getOrders_, _getOrderById_, _getOrderOfCustomer_ queries

```javascript
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
```

> It used in queries like

```javascript
const getOrders = (request, response) => {
  const customerId = request.query.customerId;
  if (customerId) {
    return getOrderOfCustomer(request, response);
  }
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
    `;
  //..
};
```

> returns

```json
[
   {
    "customer_id": 1,
    "firstname": "Furkan",
    "lastname": "Yildiz",
    "phone": "05070478291",
    "email": "furkanyildiz47@gmail.com",
    "admin": true,
    "orders": [
      {
        "order_id": 1,
        "total": 0,
        "order_item": []
      },
      {
        "order_id": 30,
        "total": 5,
        "order_item": [
          {
            "order_item_id": 34,
            "products": [
              {
                "productid": 1,
                "name": "defaul_product",
                "price": 0,
                "description": "default product"
              }
            ]
          },
          {
            "order_item_id": 35,
            "products": [
              {
                "productid": 3,
                "name": "productRESTPOST",
                "price": 5,
                "description": "this product updated from REST CLIENT request"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "customer_id": 8,
    "firstname": "customer2",
    "lastname": "dummy",
    "phone": "22222222222",
    "email": null,
    "admin": false,
    "orders": []
  },
  ...
]
```

> order.js controller also uses transaction while creating new order. That is because the database desing i created. It firstly creates an `Order` in `orders table`, then gets the id of the new created Order, then creates new `Order_Item` to store the order id and product id in one record. That's the way that I used order_item table to make relation between orders table and product table.

```javascript
const makeOrder = (request, response, next) => {
  const { customerId, productsIds } = request.body;

  pool.connect((err, client, done) => {
    if (err) {
      console.log(`error connecting to client`, error);
      response.status(400).end();
      return false;
    }
    const shouldAbort = (err) => {
      if (err) {
        console.error("Error in transaction", err.stack);
        client.query("ROLLBACK", (err) => {
          if (err) {
            console.error("Error rolling back client", err.stack);
          }
          // release the client back to the pool
          done();
        });
      }
      return !!err;
    };

    client.query("BEGIN", (err) => {
      if (shouldAbort(err)) return next(err);

      const calculateTotal =
        "SELECT SUM(price) as total FROM products WHERE productId = ANY($1)";
      const calculateTotalValues = [productsIds];
      client.query(calculateTotal, calculateTotalValues, (err, res) => {
        if (shouldAbort(err)) return next(err);
        const total = res.rows[0].total;

        const createOrder =
          "INSERT INTO orders(customerId,total) VALUES($1,$2) RETURNING orderId";
        const createOrderValues = [customerId, total];
        client.query(createOrder, createOrderValues, (err, res) => {
          if (shouldAbort(err)) return next(err);

          const orderId = res.rows[0].orderid;

          const createOrderItemValues = productsIds.map((productId) => [
            orderId,
            productId,
          ]);
          // [ [ 29, 1 ], [ 29, 2 ] ]

          const createOrderItem = format(
            "INSERT INTO order_item(orderId,productId) VALUES %L",
            createOrderItemValues
          );
          // INSERT INTO order_item(orderId,productId) VALUES ('29', '1'), ('29', '2')

          client.query(createOrderItem, (err, res) => {
            if (shouldAbort(err)) return next(err);

            client.query("COMMIT", (err) => {
              if (err) {
                logger.error("Error committing transaction", err.stack);
              }
              logger.info(`Order created successfully`);
              done();
            });
          });
        });
      });
    });
  });
};
```

### product.js <a id="product-controller"></a>
>
> It exporting four modules **getProducts**, **getProductById**, **createProduct**. **updateProduct**. As their names suggest they operate respectively;
>
> - getting all of products,
> - getting product who has the id that send via `req.params`,
> - creating new product with the information that send via `req.body` object
> - and updating existing product with the information that send via `req.body` object.

## requests

requests folder has three files **customer.rest**, **order.rest**, **product.rest** which are created to make `HTTP requests` using `REST Client` extension.

## routes

routes folder has three files **customer.js**, **order.js**, **product.js** which are created to manage endpoints that made to this route.  
Each file imports `Route()` method of `express` to direct the request to the responsible controller to get response.  
Also each router uses middlewares to validate the request parameters.

## utils

utils folder has two files **logger.js** and **middleware.js**.

### logger.js
>
> logger.js file created to log the message to the console. It exports two modules `info` and `error`.

### middleware.js
>
> exports three modules `requestLogger, unknownEndpoint, errorHandler`  
> **requestLogger** middleware logs the **METHOD, PATH, BODY** of the request  
> **unknownEndpoint** middleware handles the request that made to endpoints which are not handled by app.js  
> **errorHandler** middleware used to combine errors in one place and respond with the matched error option

## .gitignore

.gitignore file tells the git tool to ignore the files that inside in it
