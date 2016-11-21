line_history = [];

module.exports.draw = function (socket, io) {
    //console.log(line_history);
    for (var i in line_history) {
        socket.emit('draw_line', { line: line_history[i].line, color: line_history[i].color } );
    }

    socket.on('draw_line', function (data) {
        line_history.push(data);
        socket.broadcast.emit('draw_line', { line: data.line, color: data.color });
    });

    socket.on('draw_clear', function () {
        io.emit('draw_clear');
        line_history = [];
    });
};
