import { CommandInteraction, Permissions } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders"
import database from "../database/database.js";

export const data = new SlashCommandBuilder()
    .setName('clearnotificationchannel')
    .setDescription("Pause notifications in this server (this will not unfollow players)")
    .setDMPermission(false)
    .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_WEBHOOKS)

/** @param {CommandInteraction} interaction */
export async function execute (interaction) {
    const discordGuild = await database.models.DiscordGuild.findByPk(interaction.guildId);
    if (!discordGuild?.notificationChannel) return await interaction.reply("This server already has no notification channel set!");

    const oldChannelId = discordGuild.notificationChannel;
    
    discordGuild.notificationChannel = null;
    await discordGuild.save();

    await interaction.reply(`This server will no longer receieve notifications in <#${oldChannelId}>.`);
}