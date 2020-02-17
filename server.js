const net = require('net');
const fs = require('fs');

let socketList = [];
let id = 0;
let chat;
let logVar = true;

const server = net.createServer(socket => {
	socket.id = id++;
	socket.username = `User${socket.id}`;
	socketList.push(socket); 

	console.log('--------------------------------------');
	console.log(`Welcome ${socket.username} to the server!`);
	console.log('--------------------------------------\n');

	socketList.forEach(s => {
		if(s.id !== socket.id || socket.id === 0) {
			chat = `----- ${socket.username} has joined the server! -----\n`;
		}
		if(s.id !== socket.id) s.write(chat);
	});

	chatLog(chat);

	socket.on('data', data => {
		let input = data.toString();
		
		if(input === 'disconnected') {
			chat = `----- ${socket.username} has disconnected from the server! -----\n`;
			removeUser(socket);
		}
		else if(input === 'kicked') {
			chat = `----- ${socket.username} has been kicked from the server! -----\n`;
			chatLog(chat);
			console.log(chat);
			removeUser(socket);
		}
		else if(input.startsWith('/')) {
			let inArr = input.split(' ');

			if(inArr[0] === '/w') whisper(socket, inArr);
			else if(inArr[0] === '/username') resetUsername(socket, inArr);
			else if(inArr[0] === '/kick') kickUser(socket, inArr);
			else if(inArr[0] === '/clientlist') listClients(socket);
			else {
				chat = 'Error: Incorrect command. Try again.\n';
				socket.write(chat);
			}
		}
		else {
			chat = `${socket.username}: ${input}\n`;
			socketList.forEach(s => {
				if(s.id !== socket.id) {
					s.write(chat);
				}
			});
		}
		if(logVar) {
			chatLog(chat);
			console.log(chat);
		}	
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



function listClients(socket) {
	chat = '--- Client List ---\n';
	socketList.forEach(s => {
		chat += `${s.username}\n`;
	});
	socket.write(chat);
}

function kickUser(socket, inArr) {
	let adminPassword = 'supersecretpass';
	if(inArr[2] === adminPassword) {
		socketList.forEach(s => {
			if(s.username === inArr[1]) {
				s.write('kick');
				logVar = false;
			}
		});
	}
	else {
		let chat = 'Error: Incorrect admin password\n';
		socket.write(chat);
	}
}

function resetUsername(socket, inArr) {
	let nameTaken = false;
	socketList.forEach(s => {
		if(inArr[1] === s.username) {
			nameTaken = true;
		}
	});
	if(inArr[1] === socket.username) {
		chat = 'Error: New username can\'t be the same as current one\n';
		socket.write(chat);
	}
	else if (nameTaken) {
		chat = 'Error: Username already taken by another user\n';
		socket.write(chat);
	}
	else {
		chat = `----- ${socket.username} reset username to ${inArr[1]} -----\n`;
		socket.username = inArr[1];
		socket.write(`--- Username is now ${socket.username} ---\n`);

		socketList.forEach(s => {
			if(s.id !== socket.id) {
				s.write(chat);
			}
		});					
	}
}

function whisper(socket, inArr) {
	let username = inArr[1];
	chat = `${socket.username} (/w): `;

	for(let i = 2; i < inArr.length; i++) {
		chat += inArr[i];
		chat += ' ';
	}
	chat += '\n';
	socketList.forEach(s => {
		if(username == s.username) {
			s.write(chat);
		}
	});
}

function removeUser(socket) {
	socketList.forEach(s => {
		if(s.id === socket.id) {
			socketList.splice(socket.id, 1);
		}
	});
}

function chatLog(chat) {
	fs.appendFile('./chat.log', `${chat}\n`, (err) => {
		if(err) console.log(err);
	});
}