const net = require('net');

let client = net.createConnection({port: 5000}, () => {
	console.log('\n\n--------------------------------------');
	console.log('Welcome to the server!');
	console.log('--------------------------------------\n\n');

	process.stdin.on('data', data => {
		console.log();
		let input = data.toString().trim();
		if(input.toLowerCase() === 'quit') {
			console.log('--- Thanks for being on the server! Come again! ---\n');
			client.write('disconnected');
			process.exit();
		} else {
			client.write(input);
		}
	});
});

client.on('data', data => {
	console.log(data.toString());
});

client.on('end', (err) => {
	if(err) console.log(err);
	else {
		console.log('--- Thanks for being on the server! Come again! ---\n');
		process.exit();
	}
});