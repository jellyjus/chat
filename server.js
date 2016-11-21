var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;
var cookieParser = require('socket.io-cookie');

server.listen(port, function () {
    var m = require('./modules/setup').setup(port);
});
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
app.use('/aclr', function (req,res) {
    var Message = require('./models/message').Message;
     Message.remove(function () {
         console.log("removed");
         res.sendFile(__dirname + '/index.html');
     });
});
io.use(cookieParser);

io.on('connection', function (socket) {
    var load = require('./modules/loading');
    load.online (io.sockets.connected ,socket);
    load.chat_messages(socket);
    load.check_cookie(socket, io);

    var draw = require('./modules/drawing');
    draw.draw(socket,io);


    socket.on('new user', function (data) {
        var m = require('./modules/add_user');
        m.add_user(data, socket, io);

    });

    socket.on('chat message', function(data){
        var sendpulse = require("./libs/sendpulse");
        var API_USER_ID="14e7db7f85a8ebeed67cd4a7aead292d";
        var API_SECRET="8a3aae3ca6a7b72c7470321750751075";
        var TOKEN_STORAGE="/tmp/";
        sendpulse.init(API_USER_ID,API_SECRET,TOKEN_STORAGE);
        var answerGetter = function answerGetter(data){
            console.log(data);
        };

        /*sendpulse.createPush(answerGetter,"Jus",9994,data.msg,10);*/
        sendpulse.variables(answerGetter);


        var m = require('./modules/chat_message');
        m.chat_message(data, socket, io);
    });

    socket.on('disconnect', function(){
        var m = require ('./modules/disconnect');
        m.disconnect(socket, io);
    });

    socket.on('logout', function () {
        var m = require ('./modules/disconnect');
        m.disconnect(socket, io);
    });
    
    socket.on ('update ava', function (url) {
        var t = require('./modules/logged');
        t.update_ava(socket, url);
    });
    
});

