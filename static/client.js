

$(function () {
    var global_name = "";
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

    

    socket.on('chat message', function(name, msg){
        var toAppend = `
            <div>
                <div class="message_bubble white">` + name + `</div>
                <div class="message_bubble`;
        if (global_name == name) {
            toAppend += " right";
        } 
        toAppend += `">` + msg + `</div>
            </div>
        `;

        $('#messages').append(toAppend);
    });

    socket.on('status', function(msg){
        $('#messages').append(msg);
    });

    socket.on('setCookie', function(name){
        $.cookie('name', name);
    })
});
