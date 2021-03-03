module.exports = {
	name: 'kick',
	description: 'Kicks a user.',
	execute(message, args) {
        const taggedUser = message.mentions.users.first();

		if (!message.mentions.users.size) {
			return message.reply(`If you would like to kick someone, please tag them :).`);
		}
		message.channel.send(`You wanted to kick: ${taggedUser.username} \nBut for that you will have to contact the god (or devil)`);
	},
};
