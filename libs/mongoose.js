var mongoose = require('mongoose');
console.log(mongoose.version);
//mongoose.connect('mongodb://jus37:jus1718@ds011472.mlab.com:11472/jusdb');
mongoose.connect('mongodb://jus:jus1718@ds031763.mlab.com:31763/chatdb');

module.exports = mongoose;