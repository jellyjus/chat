module.exports.add_user = function (data, socket, io){
    if (data.name == null
        || data.name == undefined
        || data.name.length > 10
        || data.name.length < 3
        || data.pass == null
        || data.pass == undefined
        || data.pass.length > 10
        || data.pass.length < 3
        || /[^\wа-яё]/gi.test(data.name) == true
        || /[^\wа-яё]/gi.test(data.pass) == true
        || socket.online == true
    )
    {
        socket.emit('log', {str: "Incorect login!"});
    }
    else {

        var User = require('../models/user').User,
            re = new RegExp(data.name, 'i');
        User.findOne({name: re}, function (err, user) {
            if (user) {
                if (user.pass == data.pass) {
                    user_logged(data, user, socket, io);
                    set_cookie(socket, user);
                }
                else
                {
                    socket.emit('log', {
                        str: "Неправильный пароль"
                    });
                }
            }
            else {
                var user = new User({
                    name: data.name,
                    pass: data.pass,
                    socket: socket.id,
                });
                user.save(function (err, user) {
                    user_logged(data, user, socket, io);
                    set_cookie(socket, user);
                });
            }
        });
    }
};

var user_logged = function user_logged(data, user, socket, io) {
    if (!user.online)
    {
        var date = new Date();
        socket.name = data.name;
        socket.online = true;
        socket.ava = user.ava;
        socket.date = date;
        user.set_online(true);

        var user = {name: socket.name,
            ava: socket.ava,
            status: 'online'};
        socket.broadcast.emit('update online', user);

        io.emit('chat_log',{
            name: socket.name,
            msg: "вошел",
            hour: date.getHours()+3,
            minute: (date.getMinutes()<10?'0':'') + date.getMinutes()
        });
        var Message = require('../models/message').Message;
        var message = new Message ({
            name : socket.name,
            msg: "вошел",
            type: 'log',
            hour: date.getHours()+3,
            minute: (date.getMinutes()<10?'0':'') + date.getMinutes()
        });
        message.save(function (err, message) {
        });
        var l = require('./logged');
        l.logged(socket, user.ava);
    }
    else
    {
        socket.emit('log',{str: "Already login"});
    }

};
module.exports.user_logged = user_logged;


function set_cookie(socket, user)
{
    console.log("user: "+ user.name);
    var data = user.pass + Math.random();
    var crypto = require('crypto');
    var value = crypto.createHash('md5').update(data).digest("hex");
    socket.emit('set cookie', {
        key: "login",
        value: value
    });
    user.set_cookie(value);
}