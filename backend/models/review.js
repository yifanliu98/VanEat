var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewModelSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    username: {type: String, required: true},
    restaurantId: {type: Schema.Types.ObjectId, required: true, ref: 'Restaurant'},
    review: {type: String, required: true},
    rate: {type: String},
    price: {type: String},
    favoriteDish: {type: String},
    image: [{type: String}],
}, {
    timestamps: true
});

module.exports = mongoose.model('Reviews', reviewModelSchema);