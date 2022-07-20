import { CommandInteraction, Permissions } from "discord.js";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders"
import { fetch as fetchPlayerInfo } from "../usernameCache.js";
import database from "../database/database.js";

export const data = new SlashCommandBuilder()
    .setName('unfollow')
    .setDescription("Unfollow a player for this server")
    .setDMPermission(false)
    .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_WEBHOOKS)
    .addStringOption(new SlashCommandStringOption().setName('player').setDescription("Player username or UUID").setRequired(true));

/** @param {CommandInteraction} interaction */
export async function execute (interaction) {
    const discordGuild = await database.models.DiscordGuild.findByPk(interaction.guildId);
    if (!discordGuild) return await interaction.reply("This server already isn't following anyone!");
    
    await interaction.deferReply(); // Fetching player info can take time
    const playerInfo = await fetchPlayerInfo(interaction.options.getString('player', true));
    if (!playerInfo) return await interaction.editReply("Unable to find a player with that username or UUID!");

    const removedCount = await discordGuild.removePlayer(playerInfo.id);
    if (!removedCount) return await interaction.editReply(`This server already isn't following ${playerInfo.username}!`);

    await interaction.editReply(`This server is no longer following ${playerInfo.username}.`);
}