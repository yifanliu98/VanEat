// Define schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var ObjectId = require('mongodb').ObjectID;


var restaurantsModelSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone_number: { type: String },
    category: { type: String },
    average_price: { type: Number, default: 0 },
    rate: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    image: { type: String },
    // review: [reviewSchema],
    createAt: {
        type: Date
    },
    hours: { 
        Mon: { type: String, default: "closed" },
        Tue: { type: String, default: "closed" },
        Wed: { type: String, default: "closed" },
        Thu: { type: String, default: "closed" },
        Fri: { type: String, default: "closed" },
        Sat: { type: String, default: "closed" },
        Sun: { type: String, default: "closed" },
    },
    // Mon: { type: String, default: "closed" },
    // Tue: { type: String, default: "closed" },
    // Wed: { type: String, default: "closed" },
    // Thu: { type: String, default: "closed" },
    // Fri: { type: String, default: "closed" },
    // Sat: { type: String, default: "closed" },
    // Sun: { type: String, default: "closed" },

    dishes: [{ type: String }],
    banner: { type: String }
});

restaurantsModelSchema
    .virtual('url')
    .get(function() {
        return '/restaurants/' + this._id;
    });

// Compile model from schema
module.exports = mongoose.model('Restaurant', restaurantsModelSchema);