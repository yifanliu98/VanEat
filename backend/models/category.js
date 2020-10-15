// Define schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categoryModelSchema = new Schema({
    //in frontend, they use CatName
    category_name: { type: String, required: true },
    image: { type: String, required: true },
});

categoryModelSchema
    .virtual('url')
    .get(function () {
        return '/category/' + this._id;
    });

// Compile model from schema
module.exports = mongoose.model('Category', categoryModelSchema);