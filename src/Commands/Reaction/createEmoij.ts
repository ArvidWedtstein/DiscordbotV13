import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import icon from '../../Functions/icon';
import { ErrorEmbed } from '../../Functions/ErrorEmbed';

export const command: Command = {
    name: "createemoji",
    description: "Create a new emoji!",
    details: "Create a new emoji!",
    aliases: ["makeemoji"],
    group: "Reaction",
    hidden: false,
    UserPermissions: ["SendMessages"],
    ClientPermissions: ["SendMessages", "AddReactions"],
    ownerOnly: false,
    examples: ["createemoji <attachment>"],
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions, attachments } = message;
        if (!guild) return
        if (!attachments.first()) return ErrorEmbed(message, client, command, `You need to attach an image to set as emoji`);
        const url = attachments.first()?.url;
        const name = attachments.first()?.name;
        if (!name || !url) return ErrorEmbed(message, client, command, `Invalid Image.`);

        // Create Emoji
        guild.emojis
            .create({ name: name, attachment: url, reason: `😈` })
            .then((emoji) => {
                const embed = new EmbedBuilder()
                    .setAuthor({name: `Created new emoji: ${emoji.name}`, iconURL: client.user?.displayAvatarURL()})
                    .setFooter({ text: `Executed by ${author.tag}`, iconURL: author.displayAvatarURL() })
                    .setTimestamp()
                channel.send({embeds: [embed]});
            });
    }
}