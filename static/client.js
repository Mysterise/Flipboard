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
<<<<<<< HEAD

    socket.on('setCookie', function(name){
        $.cookie('name', name);
    })
});
=======
});
>>>>>>> 53704ad67da8b922f8b7532995016bd4669b7ef7
