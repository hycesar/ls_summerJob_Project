/* Estructure of data of database */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Report = new Schema({
    done: {
        type: Number,
        default: 0
    },
    fileName: {
        type: String,
        required: true,
    },
    originalname: {
        type: String,
        required: true
    },
    reportList: {
        type: [String],
        required: true
    },
    percent: {
        type: Number,
        default: 0,
    },
    updated: {
        type: Date,
        default: Date.now()
    }, 
});

mongoose.model('report', Report);