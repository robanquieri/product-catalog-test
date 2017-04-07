# Case Study Tech Resolution

## The project
GFG Product Catalog

## Your tasks
**1. Design two alternative Storage solutions and describe advantages and drawbacks of either approach. Think about high number of concurrent requests (moderate write, heavily read). It can be different database strucutures or even completly different database products (only requirement is it needs to be opensource)**

<div style="text-align:center"><img src="https://raw.githubusercontent.com/robanquieri/product-catalog-test/master/images/sql.png" /></div>

**2. Write a Filter (transformation to internal data format if needed) and Validator (correct input values) for the input data for the WMS service into our product catalog (you can use a language of your choice, no pseudo-code is allowed). Note: We should be somehow able to execute the solution (e.g. run script, executable, unit test, etc.).**

*To execute this solution, run **add new product** endpoint, you able to test input values.*

```html
POST api/v1/products
```


**3. Describe or implement a solution to handle temporary and permanent failure of the involved webservices (language of choice, pseudo-code allowed, external tools or frameworks allowed). As the time might be already tight, at least sketch out some ideas.**

*In a distributed environment, calls to remote resources and services can fail due to transient faults, such as slow network connections, timeouts, or the resources being overcommitted or temporarily unavailable. If a service is very busy, failure in one part of the system might lead to cascading failures.*

## Solutions

#### Circuit Breaker

The Circuit Breaker pattern can prevent an application failure in one part of the system might lead to cascading failures. Applying the Circuit Breaker pattern, you can define a fallback approach for each of your microservices, if a service fails, you can make a special treatment so that the system remains available even without that service.

<div style="text-align:center"><img src="https://raw.githubusercontent.com/robanquieri/product-catalog-test/master/images/CircuitBreaker.png" /></div>

#### ELB+Autoscaling

Through the autoscaling feature you can configure some keys to increase or decrease a number of EC2 virtual machines, so as to scale your applications horizontally.

<div style="text-align:center"><img src="https://raw.githubusercontent.com/robanquieri/product-catalog-test/master/images/architecting.jpg" /></div>

### **GFG API V1 Documentation**
---
### Introduction
GFG API V1 REST-like HTTP endpoints allow you to submit queries and get text-to-speech results. You can also modify entities and intents in your agent.

## Getting Started
---

Clone the repo:
```sh
git clone https://github.com/robanquieri/product-catalog-test.git
cd product-catalog-test/api/v1
```

Install dependencies:
```sh
# Install dependencies
npm install
```

Start server:
```sh
# Start server
nodemon server.js
```

## Usage
---

### Use Postman to Test an API

#### Use the Postman Chrome extension or Postman MacOS app to test an API in API Gateway.

1. Launch Postman.

2. Enter the endpoint URL of a request in the address bar and choose the appropriate HTTP method from the drop-down list to the left of the address bar.

3. Choose the Headers tab. Optionally, delete any existing headers. This can clear any stale settings that may cause errors. Add x-access-token: {YOUR_ACCESS_TOKEN} headers.

Choose Send to submit the request and receive a response.

### Install API Setup

```html
GET api/v1/setup
```
#### Authenticate user and get the token

```html
POST api/v1/users/login
```


## Document
---

### Options

| Parameter  | Description                          | Type    |
| ---------- | :-----------------------------------:| -------:|
| page       | Indicates which page to load         | numeric |
| limit      | Indicates the page limit to load     | numeric |


#### Return value

| Properties | Description                                                | Type    |
| ---------- | :--------------------------------------------------------: | ------: |
| docs       | Array of documents                                         | Array   |
| total      | Total number of documents in collection that match a query | numeric |
| limit      | Limit that was used                                        | numeric |
| page       | Current page                                               | numeric |
| pages      | Total pages                                                | numeric |

Example

```js
{
  "docs": [
    {
      ...
    }
  ],
  "total": 15,
  "limit": 5,
  "page": 1,
  "pages": 3
}
```

## Endpoints
---

### Setup

| Endpoint     | Description                     | Type |
| ------------ | :-----------------------------: | ---: |
| api/v1/setup | Run the API setup               | GET  |


#### Run the API setup

```html
GET api/v1/setup
```

Callback
```js
{
  "success": true,
  "totalProducts": 5,
  "totalProductsImported": 4,
  "message": "Configuration executed successfully"
}
```

### Users

| Endpoint                            | Description                                   | Type   |
| ----------------------------------- | :-------------------------------------------: | -----: |
| api/v1/users/login                  | Authenticate user and get the token           | POST   |

#### Model

| field                                        | Unique | Required | Type     |
| -----------------------------------          | :----: | :------: | -----:   |
| username                                     | true   | true     | String   |
| password                                     | false  | true     | String   |

#### Authenticate user and get the token

```html
POST api/v1/users/login
```
Headers

```
Content-Type: application/json; charset=utf-8
```

| Username | Password         |
| -------- | :--------------: |
| admin    | s5aswefr2sT#7ech |

Callback
```js
{
  "success": true,
  "message": "Authentication success. Enjoy your token!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsicGFzc3dvcmQiOiJpbml0IiwidXNlcm5hbWUiOiJpbml0IiwiX192IjoiaW5pdCIsImNyZWF0ZWRBdCI6ImluaXQiLCJ1cGRhdGVkQXQiOiJpbml0IiwiX2lkIjoiaW5pdCJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnsiX192Ijp0cnVlLCJwYXNzd29yZCI6dHJ1ZSwidXNlcm5hbWUiOnRydWUsImNyZWF0ZWRBdCI6dHJ1ZSwidXBkYXRlZEF0Ijp0cnVlLCJfaWQiOnRydWV9LCJtb2RpZnkiOnt9LCJyZXF1aXJlIjp7fX0sInN0YXRlTmFtZXMiOlsicmVxdWlyZSIsIm1vZGlmeSIsImluaXQiLCJkZWZhdWx0IiwiaWdub3JlIl19LCJlbWl0dGVyIjp7ImRvbWFpbiI6bnVsbCwiX2V2ZW50cyI6e30sIl9ldmVudHNDb3VudCI6MCwiX21heExpc3RlbmVycyI6MH19LCJpc05ldyI6ZmFsc2UsIl9kb2MiOnsiX192IjowLCJwYXNzd29yZCI6IiQyYSQxMCR6ZUI3OUZhT1VkTEpmRmJpdnZjbUNPOVhlUEtyaHRuamozLzU5bWdMMTlERUtLVC5SalgzbSIsInVzZXJuYW1lIjoiYWRtaW4iLCJjcmVhdGVkQXQiOiIyMDE3LTA0LTA2VDIzOjM5OjA1LjE3MVoiLCJ1cGRhdGVkQXQiOiIyMDE3LTA0LTA2VDIzOjM5OjA1LjE3MVoiLCJfaWQiOiI1OGU2ZDE5OTMwOTc0YjFmMWNkY2Y5N2MifSwiaWF0IjoxNDkxNTIyMTA0LCJleHAiOjE0OTIxMjY5MDR9.tlVEcr9sRy5knxZtOzg2190UpM2wWvzsKcxWdCvLV0Q"
}
```

### Products

| Endpoint                               | Description                                       | Type   |
| -----------------------------------    | :-----------------------------------------------: | -----: |
| api/v1/products                        | Add new product                                   | POST   |
| api/v1/products                        | Get all products                                  | GET    |
| api/v1/products/:id                    | Get product                                       | GET    |
| api/v1/products/stock/stock/:sku/:size | Get product stock by sku and size                 | GET    |
| api/v1/products/cms/:param             | Get product content and region by sku or category | GET    |
| api/v1/products/:id                    | Update product                                    | PUT    |
| api/v1/products/:id                    | Delete product                                    | DELETE |

#### Model

| field              | Unique | Required | Type   |
| ------------------ | :----: | :------: | -----: |
| status             | false  | true     | Number |
| sku                | false  | true     | String |
| price              | false  | true     | Number |
| name               | false  | true     | String |
| description        | false  | true     | String |
| content            | false  | true     | String |
| region             | false  | true     | String |
| stock => size      | false  | true     | String |
| stock => warehouse | false  | true     | String |
| stock => quantity  | false  | true     | Number |
| brand              | false  | true     | String |
| categories         | false  | true     | Array  |
| product_image_url  | false  | true     | String |
| special_price      | false  | false    | Number |

#### Add new product


```html
POST api/v1/products
```

Headers

```
Content-Type: application/json; charset=utf-8
x-access-token: YOUR_ACCESS_TOKEN
```

Body

```js
{
  "status": 1,
  "sku": "BATMAN-123",
  "price": 122.99,
  "name": "Batmobile",
  "description": "Superhero Car",
  "content": "01 Car Batmobile",
  "region": "Centro-Oeste",
  "stock": [
    {
      "size": "RN",
      "warehouse": "Jundiaí",
      "quantity": 10
    },
    {
      "size": "M",
      "warehouse": "São Paulo",
      "quantity": 10
    },
    {
      "size": "G",
      "warehouse": "Jundiaí",
      "quantity": 10
    }
  ],
  "brand": "Bruce Wayne",
  "categories": ["Super Heroes", "Flying Cars", "Cars"],
  "product_image_url": "cdn.gfg.com.br/batmobile.jpg",
  "special_price": 11.22
}
```

Callback

```js
{
  "success": true,
  "message": "Product added successfully",
  "user_id": "58e6d6501af34f09c4fe4606"
}
```

#### Get all products

```html
GET api/v1/products
```

Headers

```
Content-Type: application/json; charset=utf-8
x-access-token: YOUR_ACCESS_TOKEN
```

Callback

```js
{
  "docs": [
    {
      "_id": "58e6d6501af34f09c4fe4606",
      "updatedAt": "2017-04-06T23:59:12.323Z",
      "createdAt": "2017-04-06T23:59:12.323Z",
      "sku": "batman-123",
      "price": 122.99,
      "name": "Batmobile",
      "description": "Superhero Car",
      "content": "01 Car Batmobile",
      "region": "Centro-Oeste",
      "brand": "Bruce Wayne",
      "product_image_url": "http://cdn.gfg.com.br/batmobile.jpg",
      "special_price": 11.22,
      "categories": [
        "Super Heroes",
        "Flying Cars",
        "Cars"
      ],
      "stock": [
        {
          "size": "rn",
          "warehouse": "Jundiaí",
          "quantity": 10,
          "_id": "58e6d6501af34f09c4fe4609"
        },
        {
          "size": "m",
          "warehouse": "São Paulo",
          "quantity": 10,
          "_id": "58e6d6501af34f09c4fe4608"
        },
        {
          "size": "g",
          "warehouse": "Jundiaí",
          "quantity": 10,
          "_id": "58e6d6501af34f09c4fe4607"
        }
      ],
      "status": 1,
      "__v": 0,
      "id": "58e6d6501af34f09c4fe4606"
    }
  ],
  "total": 5,
  "limit": 1,
  "page": 1,
  "pages": 5,
  "success": true,
  "message": "Foo"
}
```

#### Get product

```html
GET api/v1/products/:id
```

Headers

```
Content-Type: application/json; charset=utf-8
x-access-token: YOUR_ACCESS_TOKEN
```

Callback

```js
{
  "docs": [
    {
      "_id": "58e6d6501af34f09c4fe4606",
      "updatedAt": "2017-04-06T23:59:12.323Z",
      "createdAt": "2017-04-06T23:59:12.323Z",
      "sku": "batman-123",
      "price": 122.99,
      "name": "Batmobile",
      "description": "Superhero Car",
      "content": "01 Car Batmobile",
      "region": "Centro-Oeste",
      "brand": "Bruce Wayne",
      "product_image_url": "http://cdn.gfg.com.br/batmobile.jpg",
      "special_price": 11.22,
      "__v": 0,
      "categories": [
        "Super Heroes",
        "Flying Cars",
        "Cars"
      ],
      "stock": [
        {
          "size": "rn",
          "warehouse": "Jundiaí",
          "quantity": 10,
          "_id": "58e6d6501af34f09c4fe4609"
        },
        {
          "size": "m",
          "warehouse": "São Paulo",
          "quantity": 10,
          "_id": "58e6d6501af34f09c4fe4608"
        },
        {
          "size": "g",
          "warehouse": "Jundiaí",
          "quantity": 10,
          "_id": "58e6d6501af34f09c4fe4607"
        }
      ],
      "status": 1,
      "id": "58e6d6501af34f09c4fe4606"
    }
  ],
  "success": true,
  "message": "Foo"
}
```

#### Get product stock by sku and size

```html
GET api/v1/products/stock/:sku/:size
```

Headers

```
Content-Type: application/json; charset=utf-8
x-access-token: YOUR_ACCESS_TOKEN
```

Callback

```js
{
  "docs": {
    "quantity": 10,
    "warehouse": "Jundiaí"
  },
  "success": true,
  "message": "Foo"
}
```

#### Get product content and region by sku or category

```html
GET api/v1/products/cms/:param
```

Headers

```
Content-Type: application/json; charset=utf-8
x-access-token: YOUR_ACCESS_TOKEN
```

Callback

```js
{
  "docs": [
    {
      "_id": "58e6d30a89d37a2f68dd5080",
      "content": "01 Car Batmobile",
      "region": "Centro-Oeste",
      "id": "58e6d30a89d37a2f68dd5080"
    },
    {
      "_id": "58e6d30a89d37a2f68dd5084",
      "content": "01 Homecoming Lycra Spiderman ",
      "region": "Nordeste",
      "id": "58e6d30a89d37a2f68dd5084"
    },
    {
      "_id": "58e6d30a89d37a2f68dd5088",
      "content": "01 Kryptonite Crystal Shard",
      "region": "Norte",
      "id": "58e6d30a89d37a2f68dd5088"
    },
    {
      "_id": "58e6d30a89d37a2f68dd5090",
      "content": "01 Homecoming Lycra Batman",
      "region": "Sul",
      "id": "58e6d30a89d37a2f68dd5090"
    },
    {
      "_id": "58e6d6501af34f09c4fe4606",
      "content": "01 Car Batmobile",
      "region": "Centro-Oeste",
      "id": "58e6d6501af34f09c4fe4606"
    }
  ],
  "success": true,
  "message": "Foo"
}
```

#### Update product

```html
PUT api/v1/products/:id
```

Headers

```
Content-Type: application/json; charset=utf-8
x-access-token: YOUR_ACCESS_TOKEN
```

Body

```js
{
    "name": "Batmobile1"
}
```

Callback

```js
{
  "success": true,
  "message": "Product successfully changed"
}
```

#### Delete product

```html
DELETE api/v1/products/:id
```

Headers

```
Content-Type: application/json; charset=utf-8
x-access-token: YOUR_ACCESS_TOKEN
```

Callback

```js
{
  "success": true,
  "message": "Product deleted successfully"
}
```
