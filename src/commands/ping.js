import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders"

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Test if the bot is working');

/** @param {CommandInteraction} interaction */
export const execute = async (interaction) => await interaction.reply("Pong! :D");