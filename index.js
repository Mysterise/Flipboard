var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');


var messageID = 0;
class Message {
	constructor(name, date, message, messageID) {
		this.name = name;
		this.date = date;
		this.message = message;
		this.messageID = messageID;
	}
}

    class User {
        constructor(name) {
            this.name = name;
            this.clipboard = [];
            // this.addClipping = function addClipping(clip) {
            //     clipboard.push(clip);
            // }
        }

       

        removeClipping(clippingID) {
            for (var i = 0; i < clipboard.length; i++) {
                if (clipboard[i].clippingID == clippingID) {
                    clipboard.splice(i, 1);
                    break;
                }
            }
        }
     }


app.use('/static', express.static(__dirname + '/static'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//var users = {};
var names = [];
var messages = [];

io.on('connection', function(socket){
	socket.on('new user', function(name) {
		let userData = new User(name);

		// Puts the user information into cookie
		socket.emit('setCookie', userData);
		messages.forEach(function(entry) {
			socket.emit('chat message', entry);
		});
		socket.emit('status', "You have joined the chatroom");
		socket.broadcast.emit('status', userData.name + "has joined the chatroom\n");
	});

	// If user has an existing cookie - i.e. returning user
	socket.on('existing user', function(userData) {
		messages.forEach(function(entry) {
			socket.emit('chat message', entry);
		});
		socket.emit('status', "You have joined the chatroom");
		socket.broadcast.emit('status', userData.name + "has joined the chatroom\n");
	});

    socket.on('chat message', function(msg, userData) {
    	console.log(userData);

	  let m = new Message(userData.name, (new Date()).toISOString(), msg, messageID++)
      io.emit('chat message', m); // Where message gets broadcast
      messages.push(m);
    });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
