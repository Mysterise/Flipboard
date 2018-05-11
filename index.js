var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');

app.use('/static', express.static(__dirname + '/static'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var users = {};
var names = [];

io.on('connection', function(socket){
	// If user has no existing cookie - i.e. new user
	socket.on('new user', function() {
		var name = "Anon" + Math.floor((Math.random()*1000)+1);
		while (names.indexOf(name) >= 0) {
			name = "Anon" + Math.floor((Math.random()*1000)+1);
		}
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
		io.emit('chat message', msg);
	});
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
