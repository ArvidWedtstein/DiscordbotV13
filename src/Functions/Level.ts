import { Message, MessageEmbed, RoleResolvable } from 'discord.js';
import fs from 'fs';
import profileSchema from '../schemas/profileSchema';
import settingsSchema from '../schemas/settingsSchema';
import { getCoins, addCoins } from './economy';
import language from './language';
//let xps = 0;


/*const addEveryMinute = () => {
    client.guilds.cache.forEach((guild) => {
        guild.members.cache.forEach((member) => {
            addXP(guild.id, member.id, 1)
        })
    })
    setTimeout(addEveryMinute, 1000 * 60)
}
addEveryMinute()*/

const getNeededXP = (level: number) => {
    let levle = level / 10
    return levle * levle * 210
}

export const addXP = (async (guildId: any, userId: any, xpToAdd: number, message: Message) => {
    const { guild, member } = message

    if (!guild) return
    const result = await profileSchema.findOneAndUpdate(
        {
            guildId, 
            userId,
        },
        {
            guildId,
            userId,
            $inc: {
                xp: xpToAdd
            },
        }, 
        {
            upsert: true,
            new: true,
        }
    )
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

    const levels = await settingsSchema.findOne({
        guildId
    })
    let userlevels = sortObj(levels.levels, 'level')
    
    let { xp, level } = result
    let needed = getNeededXP(level)
    let checklevel = level + 10;
    if (!userlevels.find((lvl: any) => lvl.level == checklevel)) return;

    // If xp is more or equal then Level Up
    if (xp >= needed) {
        if (userlevels) {
            let oldlvl = userlevels.find((lvl: any) => lvl.level == level)
            let indexLevel = userlevels.indexOf(oldlvl)
            let oldrole = guild.roles.cache.find(r => r.id === oldlvl.role) || guild.roles.cache.get(oldlvl.role)
            
            if (oldrole) member?.roles.remove(oldrole);
    
            let newlvl = userlevels[indexLevel+1]
            
            level = newlvl.level;

            let newrole = guild.roles.cache.find(r => r.id === newlvl.role)
            
            if (newrole) member?.roles.add(newrole);
        } else {
            level += 10
        }
        
        let moneyresult = needed / 100
        const moneyReward = (Math.round(moneyresult)); 
        await addCoins(guildId, userId, moneyReward)

        const embed = new MessageEmbed()
            .setDescription(`${await language(guild, 'LEVEL_UP')} ${level} (${xp}xp)!\n${await language(guild, 'LEVEL_UP2')} ${moneyReward} ErlingCoins!\n${await language(guild, 'LEVEL_UP3')} ${getNeededXP(level)} XP ${await language(guild, 'LEVEL_UP4')}.`)
            .setFooter({ text: `${member?.user.tag}`, iconURL: member?.displayAvatarURL() })
            .setTimestamp()
        message.reply({embeds: [embed]}).then((msg) => {
            setTimeout(() => {
                msg.delete()
            }, 20000)
        })
        await profileSchema.findOneAndUpdate({
            guildId,
            userId,
        }, {
            level,
            xp
        })

    }
})

export const getLevel = (async (guildId: any, userId: any) => {
    const result = await profileSchema.findOne({
        guildId,
        userId
    })

    let level = '';
    if (result) {
        level = result.level
    } else {
        await new profileSchema({
            guildId,
            userId,
            level
        }).save()
    }

    return level
})

export const getXP = (async (guildId: any, userId: any) => {
    const result = await profileSchema.findOne({
        guildId,
        userId
    })

    let xp = '';
    if (result) {
        xp = result.xp
    } else {
        await new profileSchema({
            guildId,
            userId,
            xp
        }).save()
    }

    return xp
})