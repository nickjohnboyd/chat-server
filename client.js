const net = require('net');

let client = net.createConnection({port: 5000}, () => {
	console.log('\n\n--------------------------------------');
	console.log('Welcome to the server!');
	console.log('--------------------------------------\n\n\n');

	console.log('-------------- COMMANDS --------------\n');
	console.log('"<message>" - send message to server\n');
	console.log('"/w <receivingUser> <message>" - send message only to specific user\n');
	console.log('"/username <newUsername>" - change username\n');
	console.log('"/kick <kickedUser> <adminPassword>" - kick specified user from server using admin password\n');
	console.log('"/clientlist" - list all clients on server\n');
	console.log('"/quit" - leave server\n');
	console.log('--------------------------------------\n\n\n');

	process.stdin.on('data', data => {
		console.log();
		let input = data.toString().trim();

		if(input.toLowerCase() === '/quit') {
			console.log('--- Thanks for being on the server! Come again! ---\n');
			client.write('disconnected');
			process.exit();
		} 
		else client.write(input);
	});
});

client.on('data', data => {
	if(data.toString() === 'kick') {
		console.log('--- You have been kicked from the server! ---\n');
		client.write('kicked');
		process.exit();
	}
	else console.log(data.toString());
});

client.on('end', (err) => {
	if(err) console.log(err);
	else {
		console.log('--- Thanks for being on the server! Come again! ---\n');
		process.exit();
	}
});