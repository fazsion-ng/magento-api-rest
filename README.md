# Magento API REST

A Node.js client wrapper to work with the Magento REST API.

## Installation

```
npm i git+https://github.com/fazsion-ng/magento-api-rest
or 
yarn add git+https://github.com/fazsion-ng/magento-api-rest

add this to the script
 "magento:install": "yarn add git+https://github.com/fazsion-ng/magento-api-rest",
```


## Setup

### Setup for the Magento REST API integration

#### ECMAScript Module Example
```js
import Magento from "magento-api-rest";

const client = new Magento({
    'url': 'https://example.com',
    'consumerKey': '<OAuth 1.0a consumer key>',
    'consumerSecret': '<OAuth 1.0a consumer secret>',
    'accessToken': '<OAuth 1.0a access token>',
    'tokenSecret': '<OAuth 1.0a access token secret>',
});
```

#### CommonJS Module Example
```js
const Magento = require('magento-api-rest').default;

const client = new Magento({
    'url': 'https://example.com',
    'consumerKey': '<OAuth 1.0a consumer key>',
    'consumerSecret': '<OAuth 1.0a consumer secret>',
    'accessToken': '<OAuth 1.0a access token>',
    'tokenSecret': '<OAuth 1.0a access token secret>',
});
```

### Options

| Option | Type | Required | Description |
--- | --- | --- | ---
| `url`  | `String`  | yes | Your Store URL |
| `consumerKey` | `String`  | yes | Your API consumer key |
| `consumerSecret` | `String` | yes | Your API consumer secret |
| `accessToken` | `String` | yes | Your API Access Token |
| `tokenSecret` | `String` | yes | Your API Access Token Secret |
| `type` | `String` | no | Magento endpoint type, default is 'V1'|
| `sha` | `Number`  | no | Magento SHA type, default is '1'|
| `timeout` | `Number`  | no | Request Timeout |
| `axiosConfig` | `Object` | no | [Reference](https://github.com/axios/axios#request-config)

If you want to use the [Asynchronous Endpoints](https://devdocs.magento.com/guides/v2.3/rest/asynchronous-web-endpoints.html) set `type` to `async/V1`.

If you want to use the [Bulk Endpoints](https://devdocs.magento.com/guides/v2.3/rest/bulk-endpoints.html) set `type` to `async/bulk/V1`.

If you want to change the sha version, values can be 1 or 256.

## Methods

### GET

`.get(endpoint)`
`.get(endpoint, params)`

| Params     | Type     | Description                                                   |
|------------|----------|---------------------------------------------------------------|
| `endpoint` | `String` | Magento API endpoint, example: `orders`                       |
| `params`   | `Object` | JSON object to be sent as params.                             |

### POST

`.post(endpoint, data)`

| Params     | Type     | Description                                                 |
|------------|----------|-------------------------------------------------------------|
| `endpoint` | `String` | Magento API endpoint, example: `shipments`                  |
| `data`     | `Object` | JSON object to be sent as body.                             |

### PUT

`.put(endpoint, data)`

| Params     | Type     | Description                                                 |
|------------|----------|-------------------------------------------------------------|
| `endpoint` | `String` | Magento API endpoint, example: `shipments/12`               |
| `data`     | `Object` | JSON object to be sent as body.                             |

### DELETE

`.delete(endpoint, data)`

| Params     | Type     | Description                                                     |
|------------|----------|-----------------------------------------------------------------|
| `endpoint` | `String` | Magento API endpoint, example: `orders/12`                      |
| `data`     | `Object` | JSON object to be sent as body.                                 |

### API

Requests are made with [Axios library](https://github.com/axios/axios) with [support to promises](https://github.com/axios/axios#promises).

```js
let params = {
     "filter_groups": [
        {
            "filters": [
                {
                    "field": "created_at",
                    "value": "2019-08-03 11:22:47",
                    "condition_type": "from"
                }
            ]
        },
        {
            "filters": [
                {
                    "field": "created_at",
                    "value": "2020-08-03 11:22:47",
                    "condition_type": "to"
                }
            ]
        }
    ],
    "sort_orders": [
        {
            "field": "created_at",
            "direction": "desc"
        }
    ],
    "page_size": 200,
    "current_page": 1
}
```
Or, you can use the parser to write the above query as:
```js
let params = {
    $from: "2019-08-03 11:22:47",
    $to: "2020-08-03 11:22:47",
    $sort: {
        "created_at": "desc"
    },
    $perPage: 200,
    $page: 1
}
```
> You cannot use both the param writing styles together.
> Parser is triggered automatically if you use any of the keys.

#### Parser Operators

| Operator | Description | Notes
---|---|---
| $or | Execute OR queries. | Syntax: $or:[ { condition1 }, { condition2 }] |
| $from | Starting point of search via ISO date. | Requires $to. |
| $to | Ending point of search via ISO date. | Requires $from. |
| $after | Search after a specific ISO date. | Exclusive. |
| $before | Search before a specific ISO date. | Exclusive. |
| $sort | Sort the data. |
| $perPage | Specifies the per page data. |
| $page | Specifies the current page. |

> By default { key: value } translates to an "eq" operation where key = value.

To get more information as to how to form search queries, use the [following reference](https://devdocs.magento.com/guides/v2.3/rest/performing-searches.html).

> If you want to use the above object in a request,
```js
async function getOrders () {
    try {
        let { data } = await client.get('orders', params);
        // Response Handling
    } catch (err) {
        // Error Handling
    }
}
```
