

$(function () {

    var socket = io();
    if ($.cookie('name') == null || $.cookie('name') == 'AnonNaN') {
        socket.emit('new user');
    } else {
        socket.emit('existing user', $.cookie('name'));
    }
    console.log($.cookie('name'));

    // Submitting a post/chat
    $('form').submit(function() {
        socket.emit('chat message', $('#m').val(), $.cookie('name'));
        $('#m').val('');
        return false;
    }); 

    

    socket.on('chat message', function(msg, name){
        $('#messages').append(`
            <div>
                <li>` + name + `</li>
                <li>` + msg + `</li>
            </div>
        `);
    });

    socket.on('status', function(msg){
        $('#messages').append(`<li>` + msg + `</li>`);
    });

    socket.on('setCookie', function(name){
        $.cookie('name', name);
    })
});
