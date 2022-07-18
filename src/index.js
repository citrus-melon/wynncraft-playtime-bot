import config from "../config.js";
import discordClient from "./discordClient.js";
import tickPlayers from "./tickPlayers.js";

console.log(`Successfully logged in as ${discordClient.user.tag}!`);

tickPlayers();
setInterval(tickPlayers, config.tickInterval);