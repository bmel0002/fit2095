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
        },
        validate: {
            validator: function (newDate) {
                return moment(newDate).format('YYYY') < 2020
                || (moment(newDate).format('YYYY') === 2020 && moment(newDate).format('MM') < 9)
                || (moment(newDate).format('YYYY') === 2020 && moment(newDate).format('MM') === 9 && moment(newDate).format('DD') < 11);
            }
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