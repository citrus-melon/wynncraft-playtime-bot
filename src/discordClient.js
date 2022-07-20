import { Client } from "discord.js";

const discordClient = new Client({ intents: [ "GUILDS" ] });

export default discordClient;