var mongoose = require('mongoose');
console.log(mongoose.version);
mongoose.connect('mongodb://***');

module.exports = mongoose;
