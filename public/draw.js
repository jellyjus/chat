var canvas,
    context;

window.onload = function() {
    var mouse = {
        click: false,
        move: false,
        pos: {x:0, y:0},
        pos_prev: false
    };

    canvas = document.getElementById("drawing");
    context = canvas.getContext("2d");
    var width   = window.innerWidth - 150;
    var height  = window.innerHeight -100;
    canvas.width = width;
    canvas.height = height;

    $('#drawing').mousedown(function (e) {
        mouse.click = true;
    });

    $('#drawing').mouseup(function (e) {
        mouse.click = false;
    });

    $('#drawing').mousemove(function (e) {
        mouse.pos.x = e.offsetX==undefined?e.layerX:e.offsetX / width;
        mouse.pos.y = e.offsetY==undefined?e.layerY:e.offsetY / height;
        mouse.move = true;
    });

    socket.on('draw_line', function (data) {
        var line = data.line,
            tmp = context.strokeStyle;
        console.log(data.color);
        context.strokeStyle = data.color;
        context.beginPath();
        context.moveTo(line[0].x * width, line[0].y * height);
        context.lineTo(line[1].x * width, line[1].y * height);
        context.stroke();
        context.strokeStyle = tmp;
    });

    function mainLoop() {
        if (mouse.click && mouse.move && mouse.pos_prev) {
            context.beginPath();
            context.moveTo(mouse.pos.x * width,  mouse.pos.y * height);
            context.lineTo(mouse.pos_prev.x * width, mouse.pos_prev.y * height);
            context.stroke();
            socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev ], color: context.strokeStyle });
            mouse.move = false;
        }
        mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
        setTimeout(mainLoop, 25);
    }
    mainLoop();
};

$('#draw_clear').click(function () {
    socket.emit('draw_clear');
});

/*$('#draw_color').click(function () {
    switch (context.strokeStyle) {
        case '#000000':
            context.strokeStyle = '#0000ff';
            color('#0000ff');
            break;
        case '#0000ff':
            context.strokeStyle = '#00ff00';
            color('#00ff00');
            break;
        case '#00ff00':
            context.strokeStyle = '#ff0000';
            color('#ff0000');
            break;
        case '#ff0000':
            context.strokeStyle = '#000000';
            color('inherit');
            break;
    }
});*/

$('#draw_color').change(function () {
    context.strokeStyle = $(this.value).selector;
});

/*function color(color) {
    console.log(color)
    $('#draw_color').css({
        'background-color' : color
    });
}*/

socket.on('draw_clear', function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
});