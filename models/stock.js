const mongoose = require("mongoose");
const stockSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    symbol: String,
    
    company_name: String,
    refreshed_time: String,
    time_zone: String,
    interval: String,
    currency: String,
    o: Number,
    c: Number,
    h: Number,
    l: Number,
    created: Date,
    updated: Date
})

module.exports = mongoose.model('Stock', stockSchema) ;
