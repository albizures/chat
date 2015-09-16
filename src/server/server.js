const express = require('express');
const app = express();
const http = require('http').Server(app);

const io = require('socket.io')(http);
const ioRouter = require('./ioRouter')(io);
const config = require('./config.json');

console.log(ioRouter);

app.use(express.static(__dirname + '/../client'));

io.on('connection',ioRouter);

http.listen(config.port,() => {
	console.log(`Server is listening on port ${config.port}`);
})
