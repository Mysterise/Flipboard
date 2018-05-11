

$(function () {

    var socket = io();
    if ($.cookie('user') == null || $.cookie('user') == 'AnonNaN') {
        console.log("THERE IS NO COOKIE NIGGA");
        socket.emit('new user');
    } else {
        console.log("THERE IS A COOKIE NIGGA");
        socket.emit('existing user', $.cookie('user'));
    }


    // Submitting a post/chat
    $('form').submit(function() {
        socket.emit('chat message', $('#m').val(), $.cookie('user'));
        $('#m').val('');
        return false;
    }); 

    

    socket.on('chat message', function(name, message){
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

    socket.on('setCookie', function(user){
        $.cookie('user', user);
    })
});
