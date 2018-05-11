

$(function () {

    var socket = io();
    $('form').submit(function() {
    
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    }); 

    if ($.cookie('name') == null || $.cookie('name') == 'AnonNaN') {
        socket.emit('new user', "");
    } else {
        socket.emit('existing user', $.cookie('name'));
    }
    console.log($.cookie('name'));

    socket.on('chat message', function(msg){
        $('#messages').append('<li>' + msg + '</li>');
    });

    socket.on('status', function(msg){
        $('#messages').append($('<li>').text(msg));
    });

    socket.on('setCookie', function(name){
        $.cookie('name', name);
    })
});
