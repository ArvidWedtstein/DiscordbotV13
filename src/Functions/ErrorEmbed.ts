import ExtendedClient from "Client";
import { Message, EmbedBuilder } from "discord.js";
import { Command } from "../Interfaces";
import temporaryMessage from '../Functions/temporary-message';

export type ErrorType = "command" | "permission" | "client" | "unknown";

export const ErrorEmbed = (async (message: Message, client: ExtendedClient, command: Command, errorMessage?: string[] | string) => {
    const embed = new EmbedBuilder()
        .setTitle(`Error`)
        .setColor('DARK_RED')
        .setDescription(`Please use the following syntax: \`${command.examples ? `${client.config.prefix}${command.examples[0]}` : `${client.config.prefix}${command.name}`}\`\n\n${Array.isArray(errorMessage) ? errorMessage.join("\n") : errorMessage}`)
        .setTimestamp()
        .setFooter({ text: `${message.client.user?.username} User Mistake Handler`})

    return temporaryMessage(message.channel, { embeds: [embed] }, 30)
});