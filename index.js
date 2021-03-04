// cd /D J:\Dokument\Bot

//Set variables for discord and import modules
const fs = require(`fs`);
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const commandFolders = fs.readdirSync(`./commands`);

//Go over the array of folders and files to make sure only JS files are selected.
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

// Print Ready after start.
client.once('ready', () => {
	console.log('Ready!');
});

//Log all messages in cmd.
client.on(`message`, message => {
    console.log(message.content);
});

//Check if the message sent was a command and gets the approporiate module which
//is executed.
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	//changes the command into lowercase letters and trims it.
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	//Fetches the correct command
	if (!client.commands.has(commandName)) return;
	const command = client.commands.get(commandName);

	//Check if the command needs an argument to work.
	if (command.args && !command.lengt) {
		return message.channel.send(`You have to give an argument, ${message.author}`);
	}

	//Check if the command is useable in DM's
	if (command.guildOnly && message.channel.type === `dm`) {
		return message.reply(`This command is only useful in a server`)
	}

	//Check so there are no entries in the collection for the command and otherwise create one.
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	//Define now, timestamp and the cooldownAmount which defaults to 3 seconds if not specified.
	const now = Date.now();
	const timestamp = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 0.5) * 1000

	//Check if the timestamp collection has the user id, otherwise sett that and define an expirationtime.
	if(timestamp.has(message.author.id)) {
		const expirationtime = timestamp.get(message.author.id) + cooldownAmount;

		//If there is time left reply that the cooldown isn't finished.
		if (now < expirationtime) {
			const timeLeft = (expirationtime - now) / 1000;
			return message.reply(`There is ${timeLeft.toFixed(1)} seconds left until you can use the ${command.name} command.`)
		}
	}
	//Set the timestamp if that hasn't already been done.
	timestamp.set(message.author.id, now);
	//Delete the timestamp after a set time.
	setTimeout(() => timestamp.delete(message.author.id), cooldownAmount);

	try {
	    command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply(`An error occured while trying to execute that command!`);
	}
});

client.login(token);
