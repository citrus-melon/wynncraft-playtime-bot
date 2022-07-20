import { readdir } from 'fs/promises';
import { REST } from '@discordjs/rest';
const { Routes } = await import('discord-api-types/v9');

const commandDir = new URL('../src/commands/', import.meta.url);
const commandFiles = (await readdir(commandDir)).filter(file => file.endsWith('.js'));
const commands = [];

for (const file of commandFiles) {
    const command = await import(new URL(file, commandDir));
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

if (process.argv[3]) await rest.put(Routes.applicationGuildCommands(process.argv[2], process.argv[3]), { body: commands });
else await rest.put(Routes.applicationCommands(process.argv[2]), { body: commands });

console.log('Successfully registered application commands.');