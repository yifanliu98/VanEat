// Define schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dishModelSchema = new Schema({
    _id: Schema.Types.ObjectId,
    dishName: { type: String, required: true },
    img: { type: String, required: true},
    restaurant: {type: Schema.Types.ObjectId, ref: "Restaurant"}
});

dishModelSchema
    .virtual("url")
    .get(function() {
        return '/dishes/' + this._id
    })


// Compile model from schema
module.exports = mongoose.model('Dish', dishModelSchema);