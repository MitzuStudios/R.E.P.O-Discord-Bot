const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

const fs = require('node:fs');
const path = require('node:path');
const { client_ID, guild_ID, TOKEN } = require('./config.json');

client.commands = new Collection();

const slashCommandsPath = path.join(__dirname, 'commands');
const slashCommandFolders = fs.readdirSync(slashCommandsPath);
  
console.log('[INFO] Cargando comandos slash...');
for (const folder of slashCommandFolders) {
  const commandsPath = path.join(slashCommandsPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      console.log(`[INFO] Comando slash cargado: ${command.data.name}`);
    } else {
      console.log(`[WARNING] El comando en ${filePath} no tiene una propiedad "data" o "execute".`);
    }
  }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

console.log('[INFO] Cargando eventos...');
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
  console.log(`[INFO] Evento cargado: ${event.name}`);
}

client.login(TOKEN).catch((error) => {
  console.error("[ERROR] Error al iniciar sesión:", error);
});