import { Client } from "discord.js";

const discordClient = new Client({ intents: [ "GUILDS" ] });
await discordClient.login(process.env.BOT_TOKEN);

export default discordClient;