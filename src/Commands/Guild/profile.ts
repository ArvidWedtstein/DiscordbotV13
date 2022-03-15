import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import messageCountSchema from '../../schemas/messageCountSchema';
import profileSchema from '../../schemas/profileSchema';
import { addXP, getXP, getLevel } from '../../Functions/Level';
import moment from 'moment';
export const command: Command = {
    name: "profile",
    description: "Your personal profile",
    details: "You profile. contains stats about you.",
    aliases: ["p"],
    ownerOnly: false,
    ClientPermissions: ["SEND_MESSAGES", "SEND_MESSAGES_IN_THREADS", "VIEW_CHANNEL"],
    run: async(client, message, args) => {
        const { guild, mentions, author } = message;
        const u = mentions.users.first()?.id || author?.id
        const user: any = guild?.members.cache.find(r => r.id === u);
        const guildId = guild?.id
        const userId = user?.id  

        // Get roles of user 
        let rolemap: any = user?.roles.cache
            .sort((a: any, b: any) => b.position - a.position)
            .map((r: any) => r)
            .join(", \n");
        if (rolemap.length > 1024) rolemap = "Too many roles to display";
        if (!rolemap) rolemap = "No roles";

    
        let xptonextlevel: any = ''


        const result = await messageCountSchema.findOne({ 
            guildId,
            userId
        })
        let messages = '';
        if (!result) {
            messages = '0'
        } else if (!result.messageCount) {
            messages = '0'
        } else {
            messages = result.messageCount;
        }
        let birthday = '';
        let joinedDate: any = '';
        const resultsbirthday = await profileSchema.findOne({
            userId
        })
        if (!resultsbirthday) {
            birthday = 'Unknown'
            joinedDate = 'Unknown'
        } else if (resultsbirthday.birthday == '1/1') {
            birthday = 'Unknown'
        } else {
            birthday = resultsbirthday.birthday;
        }
        const results = await profileSchema.findOne({
            userId,
            guildId
        })
        joinedDate = moment(user?.joinedAt).fromNow()
        let warntxt = '';
        
        if (!results.warnings) {
            warntxt += 'No warns'
        } else {    
            //.addField(`Warned By ${author} for "${reason}"`, `on ${new Date(timestamp).toLocaleDateString()}`)
            for (const warning of results.warnings) {
                const { author, timestamp, reason } = warning
            
                let txt = `Warned By ${author} for "${reason}" on ${new Date(timestamp).toLocaleDateString()}\n`
                warntxt += txt
            }
        }
    
        // Get Animated ErlingCoin
        const erlingcoin = client.emojis.cache.get('853928115696828426');

        let presencegame: any = user?.presence.activities.length ? user?.presence.activities.filter( (x: any) => x.type === "PLAYING") : null;
        let presence = `${presencegame && presencegame.length ? presencegame[0].name : 'None'}`


        if (presence.includes('Skyrim')) {
            // presence += `${boticons(this.client, 'skyrim')}`
            presence += `Skyrim`
        }
        
        let Coins = await getCoins(guildId, userId);
        let xp: number = parseInt(await getXP(guildId, userId));
        let userlevel: any = await getLevel(guildId, userId);

        // Calculate xp to next level with some random math
        xptonextlevel = (userlevel / 10) * (userlevel / 10) * 210;
        let color = await getColor(guildId, userId);

        const badge = user.flags;
        let badges = ''
        if (badge) {
            for (let i = 0; i < badge.length; i++) {
                let badg = client.emojis.cache.find((e) => e.name === badge[i])
                
                badges += `${badg}\n`
            }
        } else {
            badges += 'None'
        }

        let description = [
            `〔Birthday: \`${birthday}\``,
            `〔Erlingcoin${Coins === 1 ? '' : 's'}${erlingcoin}: \`${Coins}\``,
            ``,
            `${userlevel ? '〔Lvl: \`' + userlevel + '\`' : ''}`,
            `${xp ? '〔XP: \`' + xp + '\`' : ''}`,
            `${xptonextlevel ? '〔XP to next Lvl: \`' + xptonextlevel + '\`' : ''}`,
            ``,
            `〔Messages Sent: \`${messages}\``,
            `${badges ? '〔Badges: \`' + badges + '\`' : ''}`,
            `${presence ? '〔Game: \`' + presence + '\`' : ''}`,
            `${warntxt ? '〔Warns: \`' + warntxt + '\`' : ''}`,
            `${joinedDate ? '〔Joined this server: \`' + joinedDate + '\`' : ''}`,
        ]
        let embed = new MessageEmbed()
            .setColor(color)
            .setAuthor({name: `${user.user.tag}'s Profile`, iconURL: `${user.displayAvatarURL({ dynamic: true})}`})
            .setDescription(description.join('\n'))
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
        
        let messageEmbed = await message.channel.send({ embeds: [embed] });
    }
}