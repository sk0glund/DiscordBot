module.exports = {
	name: 'user',
	description: 'Shows information about the user',
	execute(message, args) {
		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
	},
};
