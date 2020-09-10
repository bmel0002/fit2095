const mongoose = require('mongoose');
const moment = require('moment');

let bookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    isbn: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    relDate: {
        type: Date,
        default: Date.now,
        get: function (newDate) {
            return moment(newDate).format('DD-MM-YYYY');
        }
    },
    summary: String
});
module.exports = mongoose.model('Book', bookSchema);