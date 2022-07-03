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
    name: "addlevel2",
    description: "add/create a new level",
    details: "add/create a new level. I will automatically create a role for your level. You can customize the role as you want.",
    aliases: ["leveladd"],
    group: "Level",
    hidden: false,
    UserPermissions: ["SEND_MESSAGES", "ADD_REACTIONS", "BAN_MEMBERS", "MANAGE_CHANNELS"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["addlevel <name> | <level>"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions, attachments } = message;
        if (!guild) return
        
        const guildId = guild.id;
        let delimiter = '|'
        let start = 1
        let tokens = args.join(' ').split(delimiter).slice(start)
        let level = tokens.join(delimiter).trim(); 
             
        if (level.slice(-1) != "0") return temporaryMessage(channel, `Level must be tenable (10,20,30...) | Syntax: *${command.examples}*`, 10)

        let tokens2 = args.join(' ').split(delimiter).slice(0, start);
        let levelname = tokens2.join(delimiter).trim(); 

        // Function for automatically adding level 
        // let { levels } = await settingsSchema.findOne({
        //     guildId,
        //     levels: { $exists: true, $ne: [] }
        // });
        // let sortedLevels = levels.sort((obj1: any, obj2: any) => { return obj1?.level - obj2?.level; })
        // let s = sortedLevels[sortedLevels.length - 1].level + 10

        const role = guild.roles.create({ name: `${levelname} (Lvl ${level})`, color: '#ff0000', hoist: true, position: 1 });

        let levelsobj = {name: `${levelname}`, level: `${level}`, role: (await role).id}
    

        let result = await settingsSchema.updateOne({
            guildId
        }, {
            $addToSet: {
                levels: levelsobj
            }
        })


        if (!result) {
            result = await new settingsSchema({
                guildId,
                levels: [{name: `${levelname}`, level: `${level}`, role: (await role).id}]
            }).save()
        }
        
        const embed = new MessageEmbed()
            .setTitle(`Created new level: ${levelname} (${level})`)
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
            .setTimestamp()
        return channel.send({embeds: [embed]});
    }
}