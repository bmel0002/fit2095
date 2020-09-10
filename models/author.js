const mongoose = require('mongoose');
const moment = require('moment');

let authorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    dob: {
        type: Date,
        get: function (newDate) {
            return moment(newDate).format('DD-MM-YYYY');
        }
    },
    address: {
        state: {
            type:String,
            validate: {
                validator: function (newString) {
                    return newString.length >=2 && newString.length <= 3;
                }
            }
        },
        suburb: String,
        street: String,
        unit: String
    },
    numBooks: {
        type: Number,
        min: 1,
        max: 150
    }
});
module.exports = mongoose.model('Author', authorSchema);