import { CommandInteraction, Permissions } from "discord.js";
import { SlashCommandBuilder, SlashCommandChannelOption } from "@discordjs/builders"
import database from "../database/database.js";
import { ChannelType } from "discord-api-types/v10";

export const data = new SlashCommandBuilder()
    .setName('setnotificationchannel')
    .setDescription("Choose where notifications should be sent in this server")
    .setDMPermission(false)
    .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_WEBHOOKS)
    .addChannelOption(new SlashCommandChannelOption().setName('channel').setDescription('The new notification channel')
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildNews).setRequired(true))

/** @param {CommandInteraction} interaction */
export async function execute (interaction) {
    const discordGuild = (await database.models.DiscordGuild.findOrBuild({ where: { id: interaction.guildId } }))[0];
    
    const oldChannelId = discordGuild.notificationChannel;
    const newChannel = interaction.options.getChannel('channel', true);
    
    discordGuild.notificationChannel = newChannel.id;
    await discordGuild.save();

    if (oldChannelId) await interaction.reply(`Notification channel successfully changed from <#${oldChannelId}> to ${newChannel.toString()}.`);
    else await interaction.reply(`Notification channel sucessfully set to ${newChannel.toString()}.`);
}