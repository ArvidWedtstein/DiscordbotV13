import { Message, RoleResolvable } from 'discord.js';
import fs from 'fs';
import profileSchema from '../schemas/profileSchema';
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

//const getNeededXP = (level) => level * level * 100
const getNeededXP = (level: number) => {
    let levle = level / 10
    return levle * levle * 210
}



export const addXP = (async (guildId: any, userId: any, xpToAdd: number, message: Message) => {
    const { guild, member } = message
    //console.log('added xp')
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
    let userlevels = []
    if (guildId == '524951977243836417') {
        const levels = fs.readFileSync(`../userlevels.json`).toString();
        userlevels = JSON.parse(levels); //now it an object
    }
    
    

    let { xp, level } = result
    let needed = getNeededXP(level)
    let checklevel = level + 10;
    //console.log(userlevels[Object.keys(userlevels)[Object.keys(userlevels).length - 1]])
    if (checklevel >= userlevels[Object.keys(userlevels)[Object.keys(userlevels).length - 1]]) return;

    // If xp is more or equal then Level Up
    if (xp >= needed) {
        if (guildId == '524951977243836417') {
            let roleId = userlevels[level];
            if (!roleId) return
            let role: any = guild?.roles.cache.find(r => r.id === roleId);
            member?.roles.remove(role);
            // for (const [key, value] of Object.entries(userlevels)) {
            //     const role = guild?.roles.cache.find(r => r.id === value);
            //     if (!role) {
            //         return;
            //     }
            //     //console.log(key)
            //     if (key == level) {
            //         member?.roles.remove(role);
            //     } 
                
            // }

            // add 10 level
            level += 10;

            roleId = userlevels[level];
            if (!roleId) return
            role = guild?.roles.cache.find(r => r.id === roleId);
            member?.roles.add(role);


            // Old crappy code
            // for (const [key, value] of Object.entries(userlevels)) {
            //     const role: any = guild?.roles.cache.find(r => r.id === value);
            //     if (key == level) {
            //         member?.roles.add(role);
            //     }
            // }
        } else {
            level += 10;
        }
        
        let moneyresult = needed / 100
        const moneyReward = (Math.round(moneyresult)); 
        await addCoins(guildId, userId, moneyReward)
        message.reply(`${await language(guild, 'LEVEL_UP')} ${level} (${xp}xp)!\n${await language(guild, 'LEVEL_UP2')} ${moneyReward} ErlingCoins!\n${await language(guild, 'LEVEL_UP3')} ${getNeededXP(level)} XP ${await language(guild, 'LEVEL_UP4')}.`).then(msg => {
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
    //console.log(result)

    let level = '';
    if (result) {
        level = result.level
    } else {
        console.log('Adding new user to database')
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
    //console.log(result)

    let xp = '';
    if (result) {
        xp = result.xp
    } else {
        console.log('Adding new user to database')
        await new profileSchema({
            guildId,
            userId,
            xp
        }).save()
    }

    return xp
})

//module.exports.levels = userlevels;