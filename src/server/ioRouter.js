'use strict';

let users = {};
let rooms = {};
module.exports = (io) =>{
	return (socket) => {
		socket.on('login', (newUser) => {
			console.log('login',newUser);
			users[socket.id] = newUser;
			socket.emit('welcome',{name : newUser, id : socket.id});
			updateUsers();
			//console.log(io.sockets.connected,"------------------------",io.sockets.sockets);
		});

		socket.on('disconnect', function () {
			delete users[socket.id];
			updateUsers();
		});
		socket.on('joinChat',function (user) {
			if(!rooms[user+socket.id]){
				rooms[user+socket.id] = {
					msgs : [],
					users : [user,socket.id]
				};
			}
			socket.join(user+socket.id);
			io.sockets.connected[user].join(user+socket.id);
			socket.to(user+socket.id).emit('joined',rooms[user+socket.id]);
		})
		function updateUsers(){
			console.log(socket.room);
			io.sockets.emit('updateUsers',users);
		}
	}
}
