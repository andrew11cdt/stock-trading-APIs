const Tweet = require('../models/stock');
const Wallet = require("../models/wallet");

module.exports = {
    addShares
};
const STATUS_CODE = {
    SUCCESS_ALL: { status: 200, message: "Success!" },
    BAD_REQUEST: { status: 400, message: 'Bad request!' },
    FAILED_ACTION: { status: 424, message: 'Failed Action!' },
    UNAUTHORIZED: { status: 401, message: 'Unauthorized!' },
    NOT_FOUND: { status: 404, message: 'Not found!' },
    INTERNAL_ERROR: { status: 500, message: 'Internal Server Error!' },
    INSUFFICIENT_BALANCE: { status: 424, message: 'Insufficient balance!' },
}

function addShares(req, res) {
    handleAddShares(req)
    .then(data => res.send(data))
    .catch(err => handleException(err, res))
}

//HELPER FUNCTIONS

async function handleAddShares(req) {
    const { wallet_id, order_type, quantity, price, fiat_wallet_id } = req.body;
    const stockWallet = await Wallet.findById(wallet_id)
    const fiatWallet = await Wallet.findById(fiat_wallet_id)
    console.log({stockWallet, fiatWallet});
    if (!stockWallet || !fiatWallet) return STATUS_CODE.NOT_FOUND
    if (order_type === 'BUY') {
        const spend = quantity * price;
        const newBalance = fiatWallet.balance - spend
        console.log(newBalance);
        if (newBalance > 0) {
            const updatedFiat = await Wallet.findByIdAndUpdate(fiat_wallet_id, {balance: newBalance}, {new: true})
            const newQuantity = stockWallet.quantity + quantity
            const updatedStock = await Wallet.findByIdAndUpdate(wallet_id, {quantity: newQuantity}, {new: true})
            return {...STATUS_CODE.SUCCESS_ALL, data: { updatedFiat, updatedStock }}
        } else return STATUS_CODE.INSUFFICIENT_BALANCE
    } else if (order_type === 'SELL') {
        const newQuantity = stockWallet.quantity - quantity
        if (newQuantity > 0) {
            const newBalance = fiatWallet.balance + quantity * price;
            const updatedFiat = await Wallet.findByIdAndUpdate(fiat_wallet_id, {balance: newBalance}, {new: true})
            const updatedStock = await Wallet.findByIdAndUpdate(wallet_id, {quantity: newQuantity}, {new: true})
            return {...STATUS_CODE.SUCCESS_ALL, data: { updatedFiat, updatedStock }}
        } else return STATUS_CODE.INSUFFICIENT_BALANCE
    }
    return STATUS_CODE.FAILED_ACTION;
}