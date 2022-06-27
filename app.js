require('dotenv').config();

const discord = require('discord.js');
const { Client, Intents } = discord;
const client = new Client({
    intents:[ 'GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES', 'GUILD_MEMBERS', 'GUILD_VOICE_STATES']
})

//CODIGO

client.commands = new discord.Collection();
client.events = new discord.Collection();
client.slash = new discord.Collection();

["commandHandler", "eventHandler", "slashHandler"].forEach((file) => {
    require(`./handlers/${file}`)(client, discord);
});


//-------

client.login(process.env.TOKEN)