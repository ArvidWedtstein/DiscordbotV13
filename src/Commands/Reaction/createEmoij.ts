import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import icon from '../../Functions/icon';

export const command: Command = {
    name: "createemoji",
    description: "Create a new emoji!",
    details: "Create a new emoji!",
    aliases: ["makeemoji"],
    group: "Reaction",
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["createemoji <attachment>"],
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions, attachments } = message;
        if (!guild) return
        if (!attachments.first()) return temporaryMessage(channel, 'You need to attach an image to set as emoji', 5)
        const url = attachments.first()?.url;
        const name = attachments.first()?.name;
        if (!name || !url) return temporaryMessage(channel, 'Invalid Image', 5)

        // Create Emoji
        guild.emojis
            .create(url, name)
            .then((emoji) => {
                const embed = new MessageEmbed()
                    .setAuthor({name: `Created new emoji: ${emoji.name}`, iconURL: client.user?.displayAvatarURL()})
                    .setFooter({ text: `Executed by ${author.tag}`, iconURL: author.displayAvatarURL() })
                    .setTimestamp()
                message.channel.send({embeds: [embed]});
            });
    }
}