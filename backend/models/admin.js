// Define schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminModelSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true}
});

// Compile model from schema
module.exports = mongoose.model('admin', adminModelSchema );