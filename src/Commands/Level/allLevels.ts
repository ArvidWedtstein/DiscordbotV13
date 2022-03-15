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
            guildId
        })

        const sortObj = (list: any[], key: string) => {
            const compare = (a: any, b: any) => {
                a = a[key];
                b = b[key];
                var type = (typeof(a) === 'string' ||
                            typeof(b) === 'string') ? 'string' : 'number';
                var result;
                if (type === 'string') result = a.localeCompare(b);
                else result = a - b;
                return result;
            }
            return list.sort(compare);
        }
        let sortedLevels = sortObj(result.levels, 'level')
        let desc: any = []
        sortedLevels.forEach((level: any) => {
            desc.push(`${level.name} (Lvl ${level.level})`)
        });
        const embed = new MessageEmbed()
            .setDescription(desc.join('\n'))
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
            .setTimestamp()
        message.channel.send({ embeds: [embed] });
    }
}