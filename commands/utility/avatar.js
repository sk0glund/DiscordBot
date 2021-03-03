module.exports = {
	name: 'avatar',
	description: 'Shows the user avatar.',
	execute(message, args) {
		if (!message.mentions.users.size) {
			return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({format: "png", dynamic: true})}>`);
		}
		//Display avatars of tagged users
		const avatarList = message.mentions.users.map(user => {
			return `${user.username}'s avatar: <${user.displayAvatarURL({ format: "png", dynamic: true})}>`;
		});
		//Send the entire array of tagged users as a string.
		message.channel.send(avatarList);
	},
};
