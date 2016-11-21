$('#container').outerWidth($(window).width()*2);
$('#container').outerHeight($(window).height());


$('#chat_window').outerHeight($(window).height());
$('#chat_window').outerWidth($(window).width());

$('#draw_window').outerHeight(window.innerHeight);
$('#draw_window').outerWidth(window.innerWidth);

$('#draw_content').outerHeight(window.innerHeight - 100);
$('#draw_content').outerWidth(window.innerWidth - 150);

$('#chat').outerHeight($(window).height());
$('#chat').outerWidth($(window).width()/2);

$('#messages').outerHeight($('#chat').outerHeight()-60);

$('#first').css({
    'margin-left': $(window).width()/4 - 255,
    'margin-top': 10
});

$('#log').css({
    'margin-top': 10,
    'margin-right': $(window).width()/4 - 260
});

$('#online_block').css({
    'margin-left': - $('#online_block').outerWidth(),
    'margin-top': $('#first').outerHeight() + 20
});

$('#next').css({
    'right': 10,
    'top': $(window).height()/2
});

$('#back').css({
    'top': $(window).height()/2,
    'left': 10

});