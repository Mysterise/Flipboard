

$(function () {
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
        var toAppend = `<div class="chat">`;
        if (JSON.parse($.cookie('user')).name == name) {
            toAppend += `<div class="mine messages">`;
<<<<<<< Updated upstream
            toAppend += `<div class="message">` + msg + `</div>
            </div>
        </div>`;
        } else {
            toAppend += `<div class="yours messages">`;
            toAppend += `<span style="font-size:10px;text-indent:15px;color:grey">` + name + `</span>
=======
        }
        toAppend += `<div class="span" style="size:20">` + name + `</div>
>>>>>>> Stashed changes
                <div class="message">` + msg + `</div>
            </div>
        </div>`;
        }

        $('#messages').append(toAppend);
    });

    socket.on('status', function(msg){
        $('#messages').append(`<p><span style="font-size:12px;color:grey">` + msg + `</span></p>`);
    });

    socket.on('setCookie', function(user){
        console.log(JSON.stringify(user));
        $.cookie('user', JSON.stringify(user));
    })
});
