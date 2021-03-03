module.exports = {
	name: 'beep',
	description: 'Beeps and Boops!',
	execute(message, args) {
		message.channel.send('Boop');
	},
};
