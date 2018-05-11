

$(function () {
    var global_name = "";
    var socket = io();
    if ($.cookie('user') == null || $.cookie('user') == 'AnonNaN') {
        console.log("THERE IS NO COOKIE NIGGA");
        socket.emit('new user');
    } else {
        console.log("THERE IS A COOKIE NIGGA");
        socket.emit('existing user', JSON.parse($.cookie('user')));
    }

    // Submitting a post/chat
    $('form').submit(function() {
        //console.log(JSON.stringify($.cookie('user')));
        socket.emit('chat message', $('#m').val(), JSON.parse($.cookie('user')));
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

    socket.on('setCookie', function(user){
        console.log(JSON.stringify(user));
        $.cookie('user', JSON.stringify(user));
    })
});
