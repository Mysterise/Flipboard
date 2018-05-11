$(function () {
    var socket = io();
    $('form').submit(function() {
        socket.emit('chat message', $('#m').val());
        socket.emit('chat message',"5");
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(msg){
        $('#messages').append('<li>' + msg + '</li>' );
    });

    socket.on('status', function(msg){
        $('#messages').append($('<li>').text(msg));
    });
});
