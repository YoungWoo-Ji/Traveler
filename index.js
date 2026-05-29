const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Partials, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers
	],
	partials: [
		Partials.Channel,
		Partials.Message
	]
});

//오류 무시
process.on('uncaughtException', (err) => {
	console.error(String(err.stack));
});

//Slash commands
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
			console.log(`[slash command] ${file} loaded`)
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

//Interactions
client.interactions = new Collection();
const foldersPath2 = path.join(__dirname,'interactions');
const interactionFolders = fs.readdirSync(foldersPath2);

for(const folder of interactionFolders){
	const interactionsPath = path.join(foldersPath2,folder)
	const interactionsFiles = fs.readdirSync(interactionsPath).filter(file => file.endsWith('.js'));
	//interaction 종류 별로 분리 
	client.interactions[folder] = new Collection();
	for (const file of interactionsFiles){
		const filePath = path.join(interactionsPath,file);
		const interaction = require(filePath);
		if('name' in interaction && 'execute' in interaction){
			client.interactions[folder].set(interaction.name,interaction);
			console.log(`[${folder}] ${file} loaded`)
		} else {
			console.log(`[WARNING] The interaction at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

//Events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
	console.log(`[event] ${file} loaded`)
}

client.login(token);
