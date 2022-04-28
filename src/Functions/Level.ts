import { Message, MessageAttachment, MessageEmbed, RoleResolvable } from 'discord.js';
import fs from 'fs';
import profileSchema from '../schemas/profileSchema';
import settingsSchema from '../schemas/settingsSchema';
import { getCoins, addCoins } from './economy';
import language, { insert } from './language';
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
    if (!member || member.user.bot) return
    
    const result = await profileSchema.findOneAndUpdate(
        {
            guildId, 
            userId,
        },
        {
            $inc: {
                xp: xpToAdd
            },
        }, 
        {
            upsert: true,
        }
    )
    const sortObj = (list: any[], key: string) => {
        const compare = (a: any, b: any) => {
            a = a[key];
            b = b[key];
            let type = (typeof(a) === 'string' ||
                        typeof(b) === 'string') ? 'string' : 'number';
            let result;
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
        // If there are levels specified for the guild
        if (userlevels) {
            let oldlvl = userlevels.find((lvl: any) => lvl.level == level)
            let indexLevel = userlevels.indexOf(oldlvl)
            let oldrole = guild.roles.cache.find(r => r.id === oldlvl.role) || guild.roles.cache.get(oldlvl.role)
            
            if (oldrole) member?.roles.remove(oldrole);
    
            let newlvl = userlevels[indexLevel+1]
            
            // Set level to next level
            level = newlvl.level;

            let newrole = guild.roles.cache.find(r => r.id === newlvl.role)
            
            if (newrole) member?.roles.add(newrole);
        } else {
            level += 10
        }
        // If guild has economy/money system enabled in settings
        let moneyReward;
        if (levels.money) {
            let moneyresult = needed / 100
            moneyReward = (Math.round(moneyresult)); 
            await addCoins(guildId, userId, moneyReward)
        }
        let description = [
            `${insert(guild, 'LEVEL_UP', level)} (${xp}xp)!`,
            `${levels.money ? `${insert(guild, 'LEVEL_YOU_EARNED', moneyReward)}` : ""}`,
            `${insert(guild, 'LEVEL_YOU_NOW_NEED', getNeededXP(level))}.`
        ].join('\n')

        const attachment = new MessageAttachment('./img/banner.jpg', 'banner.jpg');

        const embed = new MessageEmbed()
            .setDescription(description)
            .setImage('attachment://banner.jpg')
            .setFooter({ text: `${member?.user.tag}`, iconURL: member?.displayAvatarURL() })
            .setTimestamp()

        message.reply({ embeds: [embed], files: [attachment] }).then((msg) => {
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