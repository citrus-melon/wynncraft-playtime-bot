import { MessageEmbed } from "discord.js";
import toDurationString from "./friendlyDuration.js";
import { getUsernameById } from "./usernameCache.js";


export async function createNotificationEmbed(playerId, online, wasOnlineSince, timestamp) {
    const embed = new MessageEmbed();

    embed.setAuthor({
        name: await getUsernameById(playerId),
        iconURL: `https://crafatar.com/avatars/${playerId}`,
        url: `https://namemc.com/profile/${playerId}`
    });

    if (online) {
        embed.author.name += " is now playing Wynncraft"
        embed.setColor("#91ff8f");
    } else {
        embed.author.name += " stopped playing Wynncraft"
        embed.setColor("#ff8f8f");
        const duration = timestamp - wasOnlineSince;
        embed.addField("Duration played", toDurationString(duration));
    }

    return embed;
}