import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import icon from '../../Functions/icon';
import messageCountSchema from '../../schemas/messageCountSchema';
import emojiCharacters from '../../Functions/emojiCharacters';

export const command: Command = {
    name: "messageleaderboard",
    description: "Check top 10 message senders of this server!",
    details: "Check top 10 message senders of this server!",
    aliases: ["msgleaderboard", "mlb"],
    group: "Random",
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["messageleaderboard"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions, attachments } = message;
        if (!guild) return

        const guildId = guild.id
        const result = await messageCountSchema.find({
            guildId: guildId,
        }).sort({
            messageCount: -1,
        }).limit(10)

        let text = ''
        for (let counter = 0; counter < result.length; ++counter) {
            const { userId, messageCount } = result[counter]
            const user = guild.members.cache.get(userId)
            text += `#${counter + 1} **${user?.displayName}** with ${messageCount} messages sent!\n`
        }

        const embed = new MessageEmbed()
            .setTitle(`**Here are the 10 most active members, boss**`)
            .setDescription(text)
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
            .setTimestamp()
        message.channel.send({embeds: [embed]});
        
    }
}