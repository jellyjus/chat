module.exports.setup = function (port) {
    console.log('Server listening at port %d', port);
    var User = require('../models/user').User;
    User.find({}, function (err, user) {
        if (user) {
            user.forEach(function (item, i ,arr) {
                item.set_online(false);
            });

        }
    });
};
