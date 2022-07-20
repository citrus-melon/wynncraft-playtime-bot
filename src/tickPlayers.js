import {default as axios} from "axios";
import { sendNotifications } from "./notifications.js";
import database from "./database/database.js";
import { getUsernameById } from "./usernameCache.js";


export default async function tickPlayers() {
    const response = await axios.get("https://api.wynncraft.com/public_api.php?action=onlinePlayers");
    const allOnlinePlayers = [];
    for (const serverPlayers of Object.values(response.data)) { // flatten into single array of all online players
        if (!Array.isArray(serverPlayers)) continue;
        allOnlinePlayers.push(...serverPlayers);
    }

    const trackedPlayers = await database.models.Player.findAll();
    for (const player of trackedPlayers) {
        tickPlayer(player, allOnlinePlayers, new Date(response.data.request.timestamp * 1000))
            .catch((error) => console.error(error));
    }
}

async function tickPlayer(player, allOnlinePlayers, timestamp) {
    const username = await getUsernameById(player.id);
    const online = allOnlinePlayers.includes(username);
    const wasOnlineSince = player.onlineSince;
    if (online === (wasOnlineSince !== null)) return; // player online status has not changed

    // update the player with their new state
    if (online) {
        player.onlineSince = timestamp;
    } else {
        await player.createSession({start: player.onlineSince, end: timestamp});
        player.onlineSince = null;
    }
    await player.save();

    // send notification in each server the player is a part of
    const discordGuilds = await player.getDiscordGuilds();
    await sendNotifications(player.id, online, discordGuilds, wasOnlineSince, timestamp);
}