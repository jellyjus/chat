module.exports.disconnect = function (socket, io) {
    if (socket.online == true)
    {
        var User = require('../models/user').User,
            re = new RegExp(socket  .name, 'i');
        User.findOne({name: re}, function (err, user) {
            if (user) {
                user.set_online(false);
            }
        });
        socket.online = false;
        var date = new Date();
        io.emit('chat_log', {
            name: socket.name,
            msg: "вышел",
            hour: date.getHours()+3,
            minute: (date.getMinutes()<10?'0':'') + date.getMinutes()
        });

        var user = {name: socket.name,
            ava: socket.ava,
            status: 'offline'};
        socket.broadcast.emit('update online', user);

        var Message = require('../models/message').Message;
        var message = new Message ({
            name : socket.name,
            msg: "вышел",
            type: "log",
            hour: date.getHours()+3,
            minute: (date.getMinutes()<10?'0':'') + date.getMinutes()
        });
        message.save(function (err, message) {
        });
    }
};
