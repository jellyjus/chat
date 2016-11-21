var mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
   name: {
       type: String,
       unique : true
   },
    pass: {
        type: String
    },
    ava: {
        type: String,
        default: "https://pp.vk.me/c633121/v633121441/210d6/z0Iw6Y3YvMI.jpg"
    },
    created : {
        type: Date,
        default :Date.now
    },
    socket: {
        type: String
    },
    cookie:
    {
        type: String
    },
    online: {
        type: Boolean,
        default: false
    }
});

schema.methods.update = function (src) {
    this.ava = src;
    this.save(function (err, user) {
    });
    return this;
};

schema.methods.set_cookie = function (value) {
    this.cookie = value;
    this.save(function (err, user) {
    });
    return this;
};

schema.methods.set_online = function (value) {
    this.online = value;
    this.save(function (err, user) {
        console.log(user.name + ": " + user.online);
    });
    return this;
};

module.exports.User = mongoose.model('User', schema);