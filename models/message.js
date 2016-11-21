var mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String
    },
    msg: {
        type: String
    },
    ava: {
        type :String
    },
    type: {
      type: String
    },
    hour : {
        type: String
    },
    minute: {
        type: String
    }
});

exports.Message = mongoose.model('Message', schema);