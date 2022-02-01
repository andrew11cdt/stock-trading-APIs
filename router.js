const express = require("express");
const router = express.Router();
const middleware = require('./middleware/middleware');
const userController = require('./api-controllers/user-controllers');
const walletController = require('./api-controllers/wallet-controllers');
const stockController = require('./api-controllers/stock-controllers');
//USER
router.post('/user/register', userController.registerUser);
router.post('/user/login',userController.loginUser);
router.get('/user/:id',userController.getPortfolio);

// //WALLET
router.post('/wallet/create',middleware.checkToken,walletController.createWallet);
// Add Balance
router.put('/wallet/deposit/:id',middleware.checkToken,walletController.depositWallet);

// ADD BUY/SELL SHARES
router.post('/stock/share/add',middleware.checkToken,stockController.addShares);

// //STOCK
// router.post('/stock/create',middleware.checkToken,stockController.createStock);

module.exports = router;