import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, GuildMember, EmbedFieldData, AttachmentBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import axios from 'axios';
export const command: Command = {
    name: "me",
    description: "me",
    details: "info bout me",
    aliases: ["meg"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["-me"],
    run: async(client, message, args) => {
        const { guild, mentions, author, member, channel } = message;
        
        const embed = new EmbedBuilder()
            .setAuthor({ name: `Hei der. ${author.username}` })
            .setImage(author.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
            .setTimestamp(Date.now())

        channel.send( {embeds: [embed] });
    }
}


