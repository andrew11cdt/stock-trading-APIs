# STOCK TRADING BACKEND API
- Github Repo: https://github.com/andrew11cdt/stock-trading
## HOW TO RUN
### 1. Set up environment
- Run npm
``` 
npm install
```
### 2. Run server
```
nodemon server.js
```
### 3. Test APIs on Postman
- Import this json file to Postman: stock-apis.postman_collection.json (found in this project folder)
- Test API requests and responses as following 
## APIs
### I. JWT Token Authentication
- middleware.js
- Check for token in request header 'Authorization' to verify valid login sesson of user before create, update, delete tweets.

### II. USER
###  [POST] /api/user/login
-Response:
``` 
{
    "status": 200,
    "message": "Successfully logged in!",
    "data": {
        "dataUser": {
            "id": string,
            "username": string
        },
        "token": string
    }
} 
```
### [POST] /api/user/register
```
{
    "status": 201,
    "message": "Register successful!",
    "data": {
        "user": {
            "id": string,
            "username": string
        }
    }
}
```

## III.  User Portfolio
### [GET] /api/user/:id
- Response:
    ```
    {
        status: 200,
        message: 'Successful!',
        data: {
            wallets: {
                fiat: [{
                    id: string,
                    currency: string,
                    balance: float
                }],
            stocks: [{
                id: string,
                symbol: string,
                quantity: integer
            }]
        }
    }
    ```
## IV. User Wallet
* Each wallet should has:
    * wallet_type: 'fiat' or 'stock'
    * unique currency ('usd', 'cad', 'vnd', 'jpy'...)
    * unique stock symbol ('AAPL', 'IBM', 'TSLA' ...)
### 1. Create User Wallet
### [POST] /api/wallet/create
- Request params:
    ```
    {
        wallet_type: 'fiat',
        user_id: string,
        currency: string
    }
    ```
- Successfull response:
    ```
    {
        status: 200,
        message: "Created fiat wallet successfully!"
        data: {
            id: string,
            wallet_type: 'fiat',
            owner_id: string,
            currency: string,
            balance: float, // default: 0
        }

    }
    ```
### [POST] /api/wallet/create
- Request params:
    ```
    {
        wallet_type: 'stock',
        user_id: string,
        symbol: string,
    }
    ```
- Successfull response:
    ```
    {
        status: 200,
        message: "Created wallet successfully!"
        data: {
            id: string,
            owner_id: string,
            wallet_type: 'stock',
            stock: string,
            symbol: string,
            quantity: integer, // default: 0
            }
        }
    }
    ```
### 2. Add balance/quantity Wallet
### 2.1 Deposit fiat balance 
### [PUT] /api/wallet/deposit/:id
- Request Params:
    ```
    {
        wallet_type: 'fiat',
        currency: string,
        quantity: float
    }
    ```
- Successfull response:
    ```
    {
        status: 200,
        message: "Deposit successfully!"
        data: {
            id: string,
            owner_id: string,
            wallet_type: 'fiat',
            currency: string,
            balance: float
        }

    }
    ```
### 2.2 Deposit Stock balance 
### [POST] /api/wallet/deposit/:id
- Request Params:
    ```
    {
        wallet_type: 'stock',
        stock_id: string,
        quantity: float
    }
    ```
- Successfull response:
    ```
    {
        status: 200,
        message: "Deposit successfully!"
        data: {
            id: string,
            owner_id: string,
            wallet_type: 'stock',
            stock: string,
            symbol: string,
            quantity: integer
            }
        }

    }
    ```
## V. Add BUY/SELL Shares
### [POST] /api/stock/shares/add
- Request params:
    ```
    {
        wallet_id: string,
        order_type: string, // 'BUY' | 'SELL'
        quantity: integer,
        price: float,
        fiat_wallet_id: string,
    }
    ```

- Successful response:
    ```
    {
        status: 200,
        message: 'Successful!',
        data: {
             wallets: {
                fiat: [{
                    id: string,
                    currency: string,
                    balance: float
                }],
            stocks: [{
                id: string,
                symbol: string,
                quantity: integer
            }]
        }
    }
    ```
## VI. Stock Price
Shortcut meaning
> o: open price
> c: close price
> h: high price
> l: low price
### 1. Create stock
### [POST] /api/stock/create
- Request params:
    ```
    {
        symbol: string,
    }
    ```
- Successful response:
    ```
    {
        status: 200,
        message: 'Successful!'
        data: [{
            id: string,
            symbol: string,
            company_name: string,
            refreshed_time: string,
            time_zone: string,
            interval: string,
            currency: string,
            o: float,
            c: float,
            h: float,
            l: float
        }]
    }
    ````   ```stock-apis.postman_collectione: [alphavantage](https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=TSLA&interval=5min&outputsize=full&apikey=AKWEU271H5V6USY4)
### [UPDATE] /api/stocks/:id
- Request:
    ```
    {
        o: float,
        c: float,
        h: float,
        l: float,
        time: string
        currency: string
    }
    ```
