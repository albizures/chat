'use strict';

let users = {};

module.exports = (io) =>{
	return (socket) => {
		socket.on('login', (newUser) => {
			console.log('login',newUser);
			users[socket.id] = newUser;
			socket.emit('welcome',{name : newUser, id : socket.id});
			updateUsers();
		});

		socket.on('disconnect', function () {
			delete users[socket.id];
			updateUsers();
		});

		function updateUsers(){
			io.sockets.emit('updateUsers',users);
		}
	}
}
