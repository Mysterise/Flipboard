var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');

class Message {
	constructor(user, date, message) {
		this.user = user;
		this.date = date;
		this.message = message;
	}
}



app.use('/static', express.static(__dirname + '/static'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var users = {};
var names = [];
var messages = [];

io.on('connection', function(socket){
	socket.on('new user', function(session_id) {
		// If user has no existing cookie - i.e. new user
		var name = "Anon" + Math.floor((Math.random()*1000)+1);
		while (names.indexOf(name) >= 0) {
			name = "Anon" + Math.floor((Math.random()*1000)+1);
		}
		users[socket.id] = {
			name: name,
		};
		socket.emit('setCookie', name);
		messages.forEach(function(entry) {
			console.log(entry);
			try{socket.emit('chat message', entry.user.name + ": " + entry.message);}
			catch(err){;}
		});
		console.log('new user:' + name + 'socket.id =' + socket.id);
		io.emit('chat message', 'new user joined: ' + name);

		users[socket.id] = {
			name: name
		}; 

		socket.emit('setCookie', name);
		console.log('new user:' + name + 'socket.id =' + socket.id);
		io.emit('status', 'new user joined: ' + name);
	});
	// If user has an existing cookie - i.e. returning user
	socket.on('existing user', function(name) {
		io.emit('status', name + " has joined the chatroom");
		
	})

    socket.on('chat message', function(msg){
      console.log(users[socket.id]);
	  let m = new Message(users[socket.id], (new Date()).toISOString(), msg)
	  console.log(m);
      io.emit('chat message', m.user.name,  m.message); // Where message gets broadcast
      messages.push(m);
    });
    
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
