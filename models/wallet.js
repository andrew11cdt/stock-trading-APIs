var mongoose = require("mongoose");
const Schema = mongoose.Schema;
const walletSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    wallet_type: {
        type: String,
        enum: ['fiat', 'stock']
    },
    owner_id: {
        ref: 'User',
        type: Schema.Types.ObjectId
    },
    currency: String,
    balance: Number,
    stock: {
        ref: 'Stock',
        type: Schema.Types.ObjectId
    },
    symbol: String,
    quantity: Number,
    created: Date,
    updated: Date,
});
module.exports = mongoose.model('Wallet', walletSchema);