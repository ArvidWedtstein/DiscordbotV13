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
    name: "allevels",
    description: "get all levels of this server",
    details: "get all levels of this server",
    aliases: ["levels"],
    group: "Level",
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["levels"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions, attachments } = message;
        if (!guild) return
        
        const guildId = guild.id;
    
        let result = await settingsSchema.findOne({
            guildId,
            levels: { $exists: true }
        })

        let sortedLevels = result.levels.sort((obj1: any, obj2: any) => { return obj1?.level - obj2?.level; })

        let desc: any = sortedLevels.map((level: any) => {
            return `${level.name} (Lvl ${level.level})`
        });
        
        const embed = new MessageEmbed()
            .setTitle(`${guild.name}'s Levels`)
            .setDescription(desc.join('\n'))
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
            .setTimestamp()
        channel.send({ embeds: [embed] });
    }
}