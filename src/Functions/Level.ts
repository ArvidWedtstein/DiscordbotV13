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
    try {
        let { guild, member } = message

        const result = await profileSchema.findOneAndUpdate({
            guildId, 
            userId,
        },{
            $inc: {
                xp: xpToAdd
            },
        }, {
            upsert: true,
        })
    
        if (!guild) return
        if (!member || member.user.bot) member = await guild.members.fetch(userId);
        if (!member || member.user.bot) return
        
        
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
    
        const guildSettings = await settingsSchema.findOne({
            guildId
        })
    
        if (!guildSettings) return
        
        
        let { xp, level } = result
        let needed = getNeededXP(level)
    
    
        // If xp is more or equal then Level Up
        if (xp >= needed) {
            // If there are levels specified for the guild and check if the next level exists
            if (guildSettings && guildSettings.levels && guildSettings.levels.length > 0) {
                let userlevels = sortObj(guildSettings.levels, 'level')
                let oldlvl = userlevels.find((lvl: any) => lvl.level == level)
                let indexLevel = userlevels.indexOf(oldlvl)
                let oldrole = guild.roles.cache.find(r => r.id === oldlvl.role) || guild.roles.cache.get(oldlvl.role)
                
                if (oldrole) member.roles.remove(oldrole);
        
                let newlvl = userlevels[indexLevel+1]
                
                // Set level to next level
                level = newlvl.level;
    
                let newrole = guild.roles.cache.find(r => r.id === newlvl.role)
                
                if (newrole) member.roles.add(newrole);
            } else {
                level += 10
            }
    
            // If guild has economy/money system enabled in settings
            let moneyReward;
            if (guildSettings.money) {
                let moneyresult = needed / 100
                moneyReward = (Math.round(moneyresult)); 
                await addCoins(guildId, userId, moneyReward);
            }
            let description = [
                `${insert(guild, 'LEVEL_UP', level)} (${xp}xp)!`,
                `${guildSettings.money ? `${insert(guild, 'LEVEL_YOU_EARNED', moneyReward)}` : ""}`,
                `${insert(guild, 'LEVEL_YOU_NOW_NEED', getNeededXP(level))}.`
            ]
    
            const attachment = new MessageAttachment('./img/banner.jpg', 'banner.jpg');
    
            const embed = new MessageEmbed()
                .setDescription(description.join('\n'))
                .setImage('attachment://banner.jpg')
                .setFooter({ text: `${member.user.tag}`, iconURL: member.displayAvatarURL() })
                .setTimestamp()
    
            if (!message) {
                member.send({ embeds: [embed], files: [attachment] })
            } else {
                message.channel.send({ embeds: [embed], files: [attachment] }).then((msg) => {
                    setTimeout(() => {
                        if (msg.deletable) msg.delete();
                    }, 30000);
                })
            }
            
    
            // Update level
            await profileSchema.findOneAndUpdate({
                guildId,
                userId,
            }, {
                level,
                xp
            })
        }
    } catch (err) {
        console.log(err)
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