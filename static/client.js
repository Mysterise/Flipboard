
$(function () {

    var socket = io();
    var clippingID = 0;
    class Clipping {
        constructor(messageID, left, top, clippingID, message, name) {
           this.messageID = messageID;
            this.left = left;
            this.top = top;
            this.clippingID = clippingID;
            this.message = message;
            this.name = name;
        }

        setPosition(left, top) {
            this.left = left;
            this.top = top;
        }
    }

    class User {
        constructor(name) {
            this.name = name;
            this.clipboard = [];
        }
     }

    class Message {
        constructor(name, date, message, messageID) {
            this.name = name;
            this.date = date;
            this.message = message;
            this.message = messageID;
    }
}
    var name;
    $("#sign_in").click(function() {
        name = $('#login_name').val();

        if ($.cookie(name) == null) {
            socket.emit('new user', name);
        } else {            
            var userData = JSON.parse($.cookie(name));
            socket.emit('existing user', userData);
            userData.clipboard.forEach(function(data) {
                var toAppend = $("<div></div>");
                //console.log(messageData);
                $(toAppend).addClass("chat draggable noselect cloneable");

                var message_box = $("<div></div>");
                var message = $("<div></div>").html(data.message);
                var name_span = $("<span></span>").html(data.name);

                if (JSON.parse($.cookie(name)).name == data.name) {
                    $(message_box).addClass("mine messages");
                    $(message).addClass("message");
                } else {
                    $(message_box).addClass("yours messages");
                    $(message).addClass("message");
                }
                
                $(message_box).append(name_span);
                $(message_box).append(message);
                $(toAppend).append(message_box);
                $(toAppend).css({"left":data.left, "top":data.top})
                $('#clipboard').append(toAppend);
            }); 
        }
        $("#login_screen").fadeOut(300);
        setTimeout(function() {
            $("#messenger").fadeIn(300);
        }, 300);
    });

    // Submitting a post/chat
    $('form').submit(function() {
        //console.log(JSON.stringify($.cookie('user')));
        socket.emit('chat message', $('#m').val(), JSON.parse($.cookie(name)));
        $('#m').val('');
        return false;
    }); 

    $(".change-chat").on("click", function(){
        var chat = $(this).attr("target-chat");
        var chat_name = $(this).children(".chat-name").text();
        $("#messages").empty();
        $("#current_chat").text(chat_name);
        $("#current_chat").attr("target-chat", chat);
    });

    socket.on('chat message', function(messageData){
        var toAppend = $("<div></div>");
        //console.log(messageData);
        $(toAppend).addClass("chat draggable noselect cloneable");
        $(toAppend).attr("messageID", messageData.messageID);

        var message_box = $("<div></div>");
        var message = $("<div></div>").html(messageData.message);
        var name_span = $("<span></span>").addClass("name").html(messageData.name);

        if (JSON.parse($.cookie(name)).name == messageData.name) {
            $(message_box).addClass("mine messages");
            $(message).addClass("message");
        } else {
            $(message_box).addClass("yours messages");
            $(message).addClass("message");
        }
        
        $(message_box).append(name_span);
        $(message_box).append(message);
        $(toAppend).append(message_box);

        $('#messages').append(toAppend);
        $("#messages").stop();
        $("#messages").animate({ scrollTop: $('#messages').prop("scrollHeight")}, 300);
    });

    socket.on('status', function(msg){
        $('#messages').append(`<p><span style="font-size:12px;color:grey">` + msg + `</span></p>`);
    });

    socket.on('setCookie', function(user){
        //console.log(JSON.stringify(user));
        $.cookie(name, JSON.stringify(user));
    });

    $("#btn_add_open").on("click", function() {
        if ($("#btn_add_open").attr("opened") == "false") {
            $(".btn_add_extra").fadeIn(300);
            $("#btn_add_open").attr("opened", "true"); 
        } else {
            $(".btn_add_extra").fadeOut(300);
            $("#btn_add_open").attr("opened", "false");
        }
    });

    $("#btn_add_label").on("click", function() {
        $("#clipboard").append(
            $("<div></div>")
                .attr("contenteditable", "true")
                .css({"left":"10px","top":"40px"})
                .html("Label")
                .addClass("label draggable dropped")
        )
    });

    $("#clipboard").dblclick(function(e) {
        if(!$(e.target).hasClass("label")) {
            //console.log("dblclicked");
            //console.log(e);
            $("#clipboard").append(
                $("<div></div>")
                    .attr("contenteditable", "true")
                    .css({"left":e.offsetX,"top":e.offsetY})
                    .html("Label")
                    .addClass("label draggable dropped")
            );
        }
    });

    interact('.draggable').draggable({
      'manualStart' : true,      
      'onmove' : function (event) {

        var target = event.target;

        var x = $(target).offset().left + event.dx;
        var y = $(target).offset().top + event.dy;

        // translate the element
        $(target).offset({left: x, top: y});
        //console.log(x, y);
        // update the posiion attributes

      },
      'onend' : function (event) {
        $('#clipboard').append(event.target);
        if ($(event.target).hasClass("dropped")) {
            $(event.target).offset({top: $(event.target).offset().top - $(window).scrollTop(), left: $(event.target).offset().left});
        } else {
            $(event.target).offset({top: $(event.target).offset().top - $(window).scrollTop(), left: $(event.target).offset().left - $("#clipboard").width()});
            $(event.target).addClass("dropped");
            console.log($.cookie(name));
            let userData = JSON.parse($.cookie(name))
            userData.clipboard.push((new Clipping($(event.target).attr("messageID"), $(event.target).offset().left, $(event.target).offset().top, clippingID, $(event.target).children().children(".message").text(),$(event.target).children().children(".name").text())));
            $(event.target).attr("clippingID", clippingID++);
            $.cookie(name, JSON.stringify(userData));
            console.log($.cookie(name));
        }
        if ($(event.target).offset().left < $("#clipboard").offset().left) {
            $(event.target).remove();
            let userData = JSON.parse($.cookie(name))
            for (var i = 0; i < userData.clipboard.length; i++) {
                console.log(i)
                if (userData.clipboard[i].clippingID == $(event.target).attr("clippingID")) {
                    userData.clipboard.splice(i, 1);
                    break;
                }
            }
            $.cookie(name, JSON.stringify(userData));
            console.log($.cookie(name));

            //let userData = JSON.parse($.cookie('user'))
            //userData.remove();
           // $.cookie('user', JSON.stringify(userData));
        }
        //$("#clipboard").animate({left: "80vw"});
        //console.log('Draggable: ', event);

      }
    }).on('move', function (event) {
      var interaction = event.interaction;

      // if the pointer was moved while being held down
      // and an interaction hasn't started yet
      if (interaction.pointerIsDown && !interaction.interacting() && event.currentTarget.classList.contains('cloneable')) {

        //console.log("MOVING");
        var original = event.currentTarget;
        //console.log("original", original);

        var x = $(original).offset().left;//(parseFloat(original.getAttribute('data-x')) || 0) + event.dx;
        var y = $(original).offset().top;//(parseFloat(original.getAttribute('data-y')) || 0) + event.dy;

        
        // create a clone of the currentTarget element
        var clone = event.currentTarget.cloneNode(true);
        $(clone).removeClass("cloneable");
        //console.log(clone);
        clone.setAttribute('style', 'position: absolute');
          
        // insert the clone to the page
        // TODO: position the clone appropriately
        $("body").append(clone);

        // update the posiion attributes
        //clone.setAttribute('data-x', x);
        //clone.setAttribute('data-y', y);
        $(clone).offset({top: y, left: x});

        // start a drag interaction targeting the clone
        interaction.start({ name: 'drag' }, event.interactable, clone);

        //$("#clipboard").animate({left: "50vw"});
      } else {
        interaction.start({ name: 'drag' }, event.interactable, event.currentTarget);
      }

    });

});
