import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js';
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
    UserPermissions: ["SendMessages", "BAN_MEMBERS"],
    ClientPermissions: ["SendMessages", "AddReactions", "MANAGE_ROLES"],
    ownerOnly: false,
    examples: ["deletelevel <name> <level>"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions, attachments } = message;
        if (!guild) return
        
        const guildId = guild.id;
        
        let levelInt = args[args.length-1];
        if (!levelInt || Number.isNaN(levelInt)) return message.channel.send(`Please provide a level number after the name.`);
        args.pop();
        let level = args.join(' ')

        let result = await settingsSchema.findOneAndUpdate({
            guildId
        }, {
            $pull: { levels: { name: level, level: levelInt } }
        })

        const embed = new EmbedBuilder()
            .setTitle(`Removed level: ${level}`)
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
            .setTimestamp()
        message.channel.send({embeds: [embed]});
    }
}