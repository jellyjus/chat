module.exports.logged = function (socket, ava) {
    socket.emit('logged',{
        name: socket.name,
        ava: ava
    });
};

module.exports.update_ava = function (socket, url) {
    var f = checkURL(url);
    if (f)
    {
        socket.emit('update ava', url);
        socket.ava = url;
        var User = require('../models/user').User;
        User.findOne({name: socket.name}, function (err, user) {
            if (user) {
                user.update(url);
            }
        });
    }
    else {
        socket.emit('log', {str: "Incorrect URL"});
    }

};

function checkURL(url) {
    var regURL = /^(?:(?:https?|ftp|telnet):\/\/(?:[a-z0-9_-]{1,32}(?::[a-z0-9_-]{1,32})?@)?)?(?:(?:[a-z0-9-]{1,128}\.)+(?:com|net|org|mil|edu|arpa|ru|gov|biz|info|aero|inc|name|[a-z]{2})|(?!0)(?:(?!0[^.]|255)[0-9]{1,3}\.){3}(?!0|255)[0-9]{1,3})(?:\/[a-z0-9.,_@%&?+=\~\/-]*)?(?:#[^ \'\"&<>]*)?$/i;
    return regURL.test(url);
}