module.exports.chat_message = function (data, socket, io) {
    var date = new Date();
    if(Math.abs(socket.date - date)<500)
    {
        var User = require('../models/user').User;
        User.findOne({name: socket.name}, function (err, user) {
            if (user) {
                user.set_online(false);
            }
        });
        socket.online = false;
        socket.emit('log',{
            str: "Disconnected"
        });
        console.log("disconnected " + socket.name);
    }
    else {
        if (socket.online != true)
        {
            socket.emit('log',{
                str: "Вы не вошли!"
            });
        }
        else{
            if (data.type == 'text')
            {
                save_emit(data, socket, io, date);
            }
            else if (data.type == 'img')
            {
                var f = checkURL(data.msg);
                if (f)
                {
                    save_emit(data, socket, io, date);
                }
                else{
                    socket.emit('log', {
                        str: "Input Error"
                    });
                }
            }
            else if (data.type == 'video')
            {
                var f = checkURL(data.msg);
                if (f)
                {
                    var tmp = data.msg.split('=');
                    data.msg = "https://www.youtube.com/embed/" + tmp.pop() + "?enablejsapi=1";
                    save_emit(data, socket, io, date);
                }
            }

        }
    }

};

function checkURL(url) {
    var regURL = /^(?:(?:https?|ftp|telnet):\/\/(?:[a-z0-9_-]{1,32}(?::[a-z0-9_-]{1,32})?@)?)?(?:(?:[a-z0-9-]{1,128}\.)+(?:com|net|org|mil|edu|arpa|ru|gov|biz|info|aero|inc|name|[a-z]{2})|(?!0)(?:(?!0[^.]|255)[0-9]{1,3}\.){3}(?!0|255)[0-9]{1,3})(?:\/[a-z0-9.,_@%&?+=\~\/-]*)?(?:#[^ \'\"&<>]*)?$/i;
    return regURL.test(url);
}

function save_emit(data, socket, io, date)
{
    var msg = data.msg.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/script/g, "sсript").replace(/>/g, "&gt;");
    socket.date = date;
    io.emit('chat message', {
        name: socket.name,
        msg : msg,
        ava: socket.ava,
        type: data.type,
        hour: date.getHours()+3,
        minute: (date.getMinutes()<10?'0':'') + date.getMinutes()
    });

    var Message = require('../models/message').Message;
    var message = new Message ({
        name : socket.name,
        msg: msg,
        ava: socket.ava,
        type: data.type,
        hour: date.getHours()+3,
        minute: (date.getMinutes()<10?'0':'') + date.getMinutes()
    });
    message.save(function (err, message) {
    });
}