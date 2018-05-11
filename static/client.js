$(function () {
    $('form').submit(function() {
    var socket = io();

        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(msg){
        $('#messages').append('<li>' + msg + '</li>');
    });

    socket.on('status', function(msg){
        $('#messages').append($('<li>').text(msg));
    });
});