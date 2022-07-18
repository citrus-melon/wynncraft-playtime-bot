import { MessageEmbed } from "discord.js";
import discordClient from "./discordClient.js";
import toDurationString from "./friendlyDuration.js";
import { getUsernameById } from "./usernameCache.js";


export async function sendNotifications(playerId, online, discordGuilds, wasOnlineSince, timestamp) {
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
    
    for (const discordGuild of discordGuilds) {
        try {
            const channel = await discordClient.channels.fetch(discordGuild.notificationChannel);
            if (channel.isText()) await channel.send({ embeds: [embed] });
        } catch (error) { console.error(error) }
    }
}