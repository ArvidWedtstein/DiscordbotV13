import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import icon from '../../Functions/icon';
import settingsSchema from '../../schemas/settingsSchema';

export const command: Command = {
    name: "deletelevel",
    description: "add/create a new level",
    details: "add/create a new level",
    aliases: ["removelevel"],
    group: "Level",
    hidden: false,
    UserPermissions: ["SEND_MESSAGES", "BAN_MEMBERS"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS", "MANAGE_ROLES"],
    ownerOnly: false,
    examples: ["deletelevel <name>"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions, attachments } = message;
        if (!guild) return
        
        const guildId = guild.id;
        
        let level = args.join(' ')

        let result = await settingsSchema.findOneAndUpdate({
            guildId
        }, {
            $pull: { levels: { name: level } }
        })

        
        const embed = new MessageEmbed()
            .setTitle(`Removed level: ${level}`)
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
            .setTimestamp()
        message.channel.send({embeds: [embed]});
    }
}