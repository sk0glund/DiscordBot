module.exports = {
	name: 'ping',
	description: 'Pings and Pongs!',
	execute(message, args) {
		message.channel.send('Pong.');
	},
};
