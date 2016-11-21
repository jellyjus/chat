module.exports.chat_messages = function (socket){
    var Message = require('../models/message').Message;
    Message.find(function (err, data) {
        for (var i=0; i<data.length; i++)
        {
            if (data[i].type != 'log')
            {
                socket.emit('chat message', {
                    name: data[i].name,
                    msg : data[i].msg,
                    type: data[i].type,
                    ava: data[i].ava,
                    hour: data[i].hour,
                    minute: data[i].minute
                });
            }
            else
            {
                socket.emit('chat_log', {
                    name: data[i].name,
                    msg : data[i].msg,
                    hour: data[i].hour,
                    minute: data[i].minute
                });
            }
        }
    });
};

module.exports.online = function (connected, socket) {
    for (var p in connected)
    {
        if (connected[p].online)
        {
            var user = {name: connected[p].name,
                        ava: connected[p].ava,
                        status: 'online'}
            socket.emit('update online', user);
        }

    }
};

module.exports.check_cookie = function (socket, io) {
    var User = require('../models/user').User;
    for (var p in socket.request.headers.cookie)
    {
        User.findOne({cookie: socket.request.headers.cookie[p]}, function (err, user) {
            if (user) {
                var m = require('./add_user');
                m.user_logged(user, user, socket, io);
            }
        });
    }
}