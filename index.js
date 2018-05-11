var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');

class Message {
	constructor(name, date, message) {
		this.name = name;
		this.date = date;
		this.message = message;
	}
}

class User {
	constructor(name) {
		this.name = name;
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
	socket.on('new user', function(session_id) {
		// If user has no existing cookie - i.e. new user
		console.log("we did niggas first");
		var name = "Anon" + Math.floor((Math.random()*1000)+1);
		while (names.indexOf(name) >= 0) {
			name = "Anon" + Math.floor((Math.random()*1000)+1);
		}
		let userData = new User(name);

		// Puts the user information into cookie
		socket.emit('setCookie', userData);
		messages.forEach(function(entry) {
			console.log(entry);
			try{socket.emit('chat message', entry.user.name + ": " + entry.message);}
			catch(err){;}
		});
		io.emit('status', 'new user joined: ' + userData.name);
	});
	// If user has an existing cookie - i.e. returning user
	socket.on('existing user', function(userData) {

		messages.forEach(function(entry) {
			try{socket.emit('chat message', entry.user.name + ": " + entry.message);}
			catch(err){;}
		});
		io.emit('status', userData.name + " has joined the chatroom");
	})

    socket.on('chat message', function(msg, userData) {

	  let m = new Message(userData.name, (new Date()).toISOString(), msg)
      io.emit('chat message', m.name, m.message); // Where message gets broadcast
      messages.push(m);
    });
    
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
