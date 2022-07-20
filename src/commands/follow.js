import { CommandInteraction, Permissions } from "discord.js";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders"
import { fetch as fetchPlayerInfo } from "../usernameCache.js";
import database from "../database/database.js";

export const data = new SlashCommandBuilder()
    .setName('follow')
    .setDescription("Notify this server when a player starts/stops playing Wynncraft")
    .setDMPermission(false)
    .setDefaultMemberPermissions(Permissions.FLAGS.MANAGE_WEBHOOKS)
    .addStringOption(new SlashCommandStringOption().setName('player').setDescription("Player username or UUID").setRequired(true));

/** @param {CommandInteraction} interaction */
export async function execute (interaction) {
    const discordGuild = await database.models.DiscordGuild.findByPk(interaction.guildId);
    if (!discordGuild?.notificationChannel) return await interaction.reply("Please set a notification channel before following players!");
    
    await interaction.deferReply(); // Fetching player info can take time
    const playerInfo = await fetchPlayerInfo(interaction.options.getString('player', true));
    if (!playerInfo) return await interaction.editReply("Unable to find a player with that username or UUID!");
    await database.models.Player.create({ id: playerInfo.id }, { ignoreDuplicates: true });

    const addedPlayer = await discordGuild.addPlayer(playerInfo.id);
    if (!addedPlayer) return await interaction.editReply(`This server is already following ${playerInfo.username}!`);

    await interaction.editReply(`This server is now following ${playerInfo.username}.`);
}