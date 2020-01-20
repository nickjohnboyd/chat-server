const net = require('net');
const fs = require('fs');

let socketList = [];
let id = 0;
let chat;

const server = net.createServer(socket => {
	socket.id = id++;
	socketList.push(socket); 

	console.log('--------------------------------------');
	console.log(`Welcome user ${socket.id} to the server!`);
	console.log('--------------------------------------\n');

	socketList.forEach(s => {
		if(s.id !== socket.id || socket.id === 0) {
			chat = `----- User ${socket.id} has joined the server! ------\n`;
		}
		if(s.id !== socket.id) s.write(chat);
	});

	chatLog(chat);

	socket.on('data', data => {
		if(data.toString() === 'disconnected') {
			chat = `----- User ${socket.id} has disconnected from the server! -----\n`;
			socketList.forEach(s => {
				if(s.id === socket.id) {
					socketList.splice(socket.id, 1);
				}
			});
		}
		else chat = `User ${socket.id}: ${data.toString()}\n`;

		chatLog(chat);
		console.log(chat);

		socketList.forEach(s => {
			if(s.id !== socket.id) {
				s.write(chat);
			}
		});
	});
});

server.listen(5000, () => {
	console.log('\n\n--------------------------------------');
	console.log('Server connected');
	console.log('--------------------------------------\n\n');

	fs.writeFile('./chat.log', `---------- New Server Established ----------\n\n`, (err) => {
		if(err) console.log(err);
	});
});

server.on('end', (err) => {
	if(err) console.log(err);
	else console.log('Server disconnected');
});

function chatLog(chat) {
	fs.appendFile('./chat.log', `${chat}\n`, (err) => {
		if(err) console.log(err);
	});
};