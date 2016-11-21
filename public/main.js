var socket = io();

$('#messages').scrollTop($('#messages').prop('scrollHeight'));


function onytplayerStateChange(newState) {
        console.log(newState.data);
}


$('.button8').click(function () {
    socket.emit('new user',{
        name: $('#login').val(),
        pass : $('#pass').val()
    });
    return false;
});

$('#message').keydown(function (e) {
    if (e.which == 13)
    {
        socket.emit('chat message', {
            msg: $('#message').val(),
            type: input_type
        });
        $('#message').val('');
        if (input_type != 'text')
        {
            input_type = 'text';
            $('#message').attr('placeholder', "Сообщение");
        }
        return false;
    }
});


socket.on('chat message', function(data){
    if (data.type == 'text')
    {
        $('#messages').append($('<div>')
            .addClass('chat_message')
            .append($('<img>')
                .attr('src', data.ava)
                .addClass('inchatava')
            )
            .append(data.name + ":<br> " + data.msg)
            .append($('<span>')
                .addClass('time')
                .text(data.hour + ":" + data.minute)
            )
        ).scrollTop($('#messages').prop('scrollHeight'));
    }
    else if (data.type == 'img')
    {
        $('#messages').append($('<div>')
            .addClass('chat_message')
            .append($('<img>')
                .attr('src', data.ava)
                .addClass('inchatava')
            )
            .append(data.name + ":<br> ")
            .append($('<img>')
                .attr('src', data.msg)
            )
            .append($('<span>')
                .addClass('time')
                .text(data.hour + ":" + data.minute)
            )
        ).scrollTop($('#messages').prop('scrollHeight'));
    }
    else if (data.type == 'video')
    {

        $('#messages').append($('<div>')
            .addClass('chat_message')
            .append($('<img>')
                .attr('src', data.ava)
                .addClass('inchatava')
            )
            .append(data.name + ":<br> ")
            .append($('<iframe frameborder="0" allowfullscreen ></iframe>')
                .attr('src', data.msg)
                .addClass('video')
            )
            .append($('<span>')
                .addClass('time')
                .text(data.hour + ":" + data.minute)
            )
        ).scrollTop($('#messages').prop('scrollHeight'));
    }
});

socket.on ('chat_log', function(data){
    $('#messages').append($('<div>')
        .addClass('chat_log')
        .text(data.name + " " + data.msg)
        .append($('<span>')
            .addClass('time')
            .text(data.hour + ":" + data.minute))
    )
    .scrollTop($('#messages').prop('scrollHeight'));
});

socket.on('log', function(data){
    $('#log').append($('<div>').addClass('chat_message').text(data.str));
});

socket.on('logged', function (data) {
    $("#first").in(data);
    oSpP.push("Online","true");
});

socket.on('update ava', function (url) {
    $('#ava').find('img').attr('src', url);
});

online = [];
input_type = 'text';

socket.on('update online', function (user) {
    if (user.status == 'online')
    {
        online.push(user);
        $('.online').remove();
        online.forEach(function (item, i, arr) {
            $('#online_block')
                .append($('<div>')
                    .addClass('online')
                    .append($('<img>').attr('src', item.ava))
                    .append("  " + item.name)
                );
        });
    }
    else {
       online.forEach(function (item, i , arr) {
           if (item.name == user.name)
           {
               online.splice(i,1);
           }
       });
        $('.online').remove();
        online.forEach(function (item, i, arr) {
            $('#online_block')
                .append($('<div>')
                    .addClass('online')
                    .append($('<img>').attr('src', item.ava))
                    .append("  " + item.name)
                );
        });
    }

});

socket.on ('offline', function (data) {
    $('.online:contains(data.name)').remove();
});

socket.on('set cookie', function (data) {
    document.cookie=data.key + "=" + data.value + "; path=/; expires=Mon, 01-Jan-2017 00:00:00 GMT";
});

document.addEventListener('pushkin_init', function (e) {
    alert(Pushkin.getSubsId());
});

$('#add_img').click(function () {
    if (input_type != 'img')
    {
        input_type = 'img';
        $('#message').attr('placeholder', "Ссылка на картинку");
    }
    else
    {
        input_type = 'text';
        $('#message').attr('placeholder', "Сообщение");
    }

});

$('#add_video').click(function () {
    if (input_type != 'video')
    {
        input_type = 'video';
        $('#message').attr('placeholder', "Ссылка на видео YouTube");
    }
    else
    {
        input_type = 'text';
        $('#message').attr('placeholder', "Сообщение");
    }

});

$('#ava').find('img').click(function (e) {
    var visible =true;
    $('#ava').find('div').fadeToggle();
});

$('#ava').find('div').keydown(function (e) {
    if (e.which == 13)
    {
        socket.emit('update ava', $(e.delegateTarget).find('input').val());
        $(e.delegateTarget).fadeOut();
        $(e.delegateTarget).find('input').val('');
    }
});

$('#next').click(function (e) {
    $('body').animate({scrollLeft: window.innerWidth}, '500', 'swing' , function () {
        $('#back').fadeIn();
    });
    $(this).fadeOut();
    return false;
});

$('#back').click(function (e) {
    $('body').animate({scrollLeft: 0}, '500', 'swing', function () {
        $('#next').fadeIn();
    });
    $(this).fadeOut();
    return false;
});

$('#logout_but').click(function () {
    socket.emit('logout');
    $("#first").out();
    return false;
});

$.fn.in = function(data){
    this.find('form').animate({
        opacity: "hide"
    },800, function () {
        $('#profile').fadeIn();
        $('#nick').text(data.name);
        $('#ava').find('img').attr('src', data.ava);
    });

};

$.fn.out = function(){
    this.find('#profile').animate({
        opacity: "hide"
    },800, function () {
        $('form').fadeIn();
    });

};