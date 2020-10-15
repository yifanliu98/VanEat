// Define schema
const mongoose = require('mongoose');


var Schema = mongoose.Schema;

var usersModelSchema = new Schema({
    _id: Schema.Types.ObjectId,
    username: {
        type: String,
        default:'',
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        default:'',
        trim: true,
        unique: true,
        lowercase: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true,
        default:'',
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isThirdParty: {
        type: Boolean,
        default: false
    },
    reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}],
    favorites: [{type: Schema.Types.ObjectId, ref: 'Restaurant'}]
});
// Compile model from schema
module.exports = mongoose.model('User', usersModelSchema);