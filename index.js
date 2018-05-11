var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');

app.use('/static', express.static(__dirname + '/static'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var users = {};

io.on('connection', function(socket){
		socket.on('new user', function(name) {
			users[socket.id] = {
				name: name
			};
			io.emit('status', name+" has joined the chatroom");
		});
    socket.on('chat message', function(msg){
      io.emit('chat message', {
      	//name: users[socket.id].name,
      	message: msg
      });
    });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
