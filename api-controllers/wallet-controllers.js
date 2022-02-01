const mongoose = require("mongoose");
const Stock = require("../models/stock");
const Wallet = require("../models/wallet");

module.exports = {
    createWallet,
    depositWallet
};
const STATUS_CODE = {
    SUCCESS_ALL: { status: 200, message: "Success!" },
    BAD_REQUEST: { status: 400, message: 'Bad request!' },
    FAILED_ACTION: { status: 424, message: 'Failed action!' },
    WALLET_ALREADY_CREATED: { status: 424, message: 'This wallet is already created!' },
    UNAUTHORIZED: { status: 401, message: 'Unauthorized!' },
    NOT_FOUND: { status: 404, message: 'Not found!' },
    INTERNAL_ERROR: { status: 500, message: 'Internal Server Error!' },
}

function createWallet(req, res) {
    const validParams = validateCreateWalletParams(req);
    if (!validParams) res.send(STATUS_CODE.BAD_REQUEST);
    const { wallet_type, user_id, currency, symbol } = req.body;
    const createRequest = wallet_type === 'fiat' ? createFiatWallet(user_id, currency) : createStockWallet(user_id, symbol)
    createRequest
        .then(data => res.send(data))
        .catch(err => handleException(err, res))
}

function depositWallet(req, res) {
    const validParams = validateUpdateWalletParams(req);
    if (!validParams) res.send(STATUS_CODE.BAD_REQUEST);
    const { wallet_type, currency, quantity, stock_id } = req.body;
    const { id } = req.params;
    const params = { id, wallet_type, currency, quantity, stock_id }
    console.log(params);
    depositWalletBalance(params)
        .then(data => res.send(data))
        .catch(err => handleException(err, res))
}


//HELPER FUNCTIONS

function handleException(error, res) {
    console.log(error.message)
    res.send(STATUS_CODE.INTERNAL_ERROR)
}
async function depositWalletBalance({ id, wallet_type, currency, quantity, stock_id }) { 
    const wallet = await Wallet.findById(id);
    if (!wallet) return STATUS_CODE.NOT_FOUND;
    quantity = Number(quantity);
    if (wallet_type === 'fiat') {
        if (wallet.currency !== currency) return STATUS_CODE.BAD_REQUEST; 
        let newBalance = wallet.balance || 0 
        newBalance += quantity
        const updatedWallet = await Wallet.findByIdAndUpdate(id, {balance: newBalance}, {new: true})
        return { ...STATUS_CODE.SUCCESS_ALL, updatedWallet }
    } else if (wallet_type === 'stock') {
        let newQuantity = wallet.quantity || 0 
        newQuantity += quantity
        const updatedWallet = await Wallet.findByIdAndUpdate(id, {quantity: newQuantity}, {new: true})
        console.log({updatedWallet});
        return { ...STATUS_CODE.SUCCESS_ALL, updatedWallet }
    }
    return STATUS_CODE.FAILED_ACTION
}

async function createStockWallet(user_id, symbol) {
    console.log(user_id, symbol)
    const findWallet = await Wallet.findOne({ owner_id: user_id, symbol })
    if (findWallet) return STATUS_CODE.WALLET_ALREADY_CREATED;
    console.log({findWallet});
    const stockRef = await findOrCreateStock(symbol);
    if (!stockRef) res.send(STATUS_CODE.INTERNAL_ERROR)

    const createWallet = new Wallet({
        _id: new mongoose.Types.ObjectId(),
        wallet_type: 'stock',
        created: Date.now(),
        updated: Date.now(),
        owner_id: user_id,
        stock: stockRef.id,
        symbol: stockRef.symbol,
        quantity: 0
    });
    const newWallet = await createWallet.save();
    console.log({ newWallet });
    if (newWallet) return { ...STATUS_CODE.SUCCESS_ALL, data: newWallet };
    return STATUS_CODE.FAILED_ACTION;
}
async function createFiatWallet(user_id, currency) {
    const findWallet = await Wallet.findOne({ owner_id: user_id, currency })
    if (findWallet) return STATUS_CODE.WALLET_ALREADY_CREATED;

    const createWallet = new Wallet({
        _id: new mongoose.Types.ObjectId(),
        wallet_type: 'fiat',
        created: Date.now(),
        updated: Date.now(),
        owner_id: user_id,
        currency,
        balance: 0
    })
    const newWallet = await createWallet.save();
    if (newWallet) return { ...STATUS_CODE.SUCCESS_ALL, data: newWallet };
    return STATUS_CODE.FAILED_ACTION;
}

function validateCreateWalletParams(req) {
    const { wallet_type, user_id, currency, symbol, quantity } = req.body;
    if (!wallet_type || (wallet_type !== 'fiat' && wallet_type !== 'stock')) return false;
    if (wallet_type === 'fiat' && (!user_id || !currency)) return false;
    if (wallet_type === 'stock' && (!user_id || !symbol)) return false;
    return true;
}

function validateUpdateWalletParams(req) {
    const { wallet_type, currency, quantity, stock_id } = req.body;
    const { id } = req.params;
    if (!wallet_type) return false;
    if (wallet_type === 'fiat' && (!quantity || !currency)) return false;
    if (wallet_type === 'stock' && (!quantity || !stock_id)) return false;
    return true;
}
async function findOrCreateStock(symbol) {
    const stock = await Stock.findOne({ symbol })
    if (stock && stock.id) {
        return stock;
    } else {
        const createStock = new Stock({
            _id: new mongoose.Types.ObjectId(),
            symbol
        });
        const newStock = await createStock.save();
        return newStock;
    }
}