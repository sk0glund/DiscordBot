// cd /D J:\Dokument\Bot 

//Set variables for discord and import modules
const fs = require(`fs`);
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

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

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;
	const command = client.commands.get(commandName);

	if (command.args && !command.lengty) {
		return message.channel.send("You have to give an argument, ${message.author}");
	}

	try {
	    command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply(`An error occured while trying to execute that command!`);
	}
});

client.login(token);
