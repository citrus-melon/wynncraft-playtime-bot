import config from "../config.js";
import commandHandler from "./commandHandler.js";
import discordClient from "./discordClient.js";
import tickPlayers from "./tickPlayers.js";


commandHandler(discordClient);

await discordClient.login(process.env.BOT_TOKEN);
console.log(`Successfully logged in as ${discordClient.user.tag}!`);

tickPlayers();
setInterval(tickPlayers, config.tickInterval);