import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
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
    UserPermissions: ["SEND_MESSAGES"],
    run: async(client, message, args) => {
        const { guild, mentions, author, channel } = message;

        if (!guild) return
        const u = mentions.users.first()?.id || author?.id
        const user: any = guild?.members.cache.find(r => r.id === u);

        if (!user) return 
        const guildId = guild.id
        const userId = user?.id  

        // Get roles of user 
        let rolemap: any = user?.roles.cache
            .sort((a: any, b: any) => b.position - a.position)
            .map((r: any) => r)
            .join(", \n");
        if (rolemap.length > 1024) rolemap = "Too many roles to display";
        if (!rolemap) rolemap = "No roles";
        
        let birthday = 'Unknown';

        // Get users profile
        const results = await profileSchema.findOne({
            userId,
            guildId
        })

        let messages = results.messageCount;
   
        if (results && results.birthday != '1/1') birthday = results.birthday;

        let joinedDate = moment(user?.joinedAt).fromNow();

        // Map warns
        let warns = results.warns.map(
            ({ reason, author, timestamp }: { reason: string, author: string, timestamp: any }) => (
                `Warned By ${author} for ${reason} on ${new Date(timestamp).toLocaleDateString()}`
            )
        );
        
        // Get Animated ErlingCoin
        const erlingcoin = client.emojis.cache.get('853928115696828426');

        // Get presence data
        let presence = "None";
        if (user?.presence) {   
            let presencegame = user?.presence.activities.length ? user?.presence.activities.filter( (x: any) => x.type === "PLAYING") : null;
            presence = `${presencegame && presencegame.length ? presencegame[0].name : 'None'}`
        }

        // Get XP and Level Data
        let Coins = await getCoins(guildId, userId);
        let xp: number = parseInt(await getXP(guildId, userId));
        let userlevel: any = await getLevel(guildId, userId);

        const getNeededXP = (level: number) => {
            let levle = level / 10
            return levle * levle * 210
        }
        // Calculate xp to next level with some random math
        let xptonextlevel = getNeededXP(userlevel)
        let color = await getColor(guildId, userId);

        const badge = user.flags;
        let badges = 'None'
        if (badge) {
            badges = ''
            badge.forEach((bad: any) => {
                let badg = client.emojis.cache.find((e) => e.name === bad)
                
                badges += `${badg}\n`
            });
        }
        function getAge(dateString: string) {
            let today = new Date();
            let birthDate = new Date(dateString);
            let age: any = today.getFullYear() - birthDate.getFullYear();

            let m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        }
        function toCodeBlock(str: any) {
            return `\`${str}\``
        }
        
        let b = birthday.split('/');
        let description = [
            `〔Birthday: ${toCodeBlock(birthday)}`,
            `〔Age: ${toCodeBlock(getAge(`${b[2]}-${b[1]}-${b[0]}`))}`,
            `〔Erlingcoin${Coins === 1 ? '' : 's'}${erlingcoin}: ${toCodeBlock(Coins)}\n`,
            `〔Lvl: ${toCodeBlock(userlevel)}`,
            `${xp ? `〔XP: ${toCodeBlock(xp)}` : ''}`,
            `${xptonextlevel ? `〔XP to next Lvl: ${toCodeBlock(xptonextlevel - xp)}` : ''}\n`,
            `〔Messages Sent: ${toCodeBlock(messages)}`,
            `〔Badges: ${toCodeBlock(badges)}`,
            `${presence ? `〔Game: ${toCodeBlock(presence)}` : ''}`,
            `${results.brawlhalla ? `〔Brawlhalla fan: ${toCodeBlock("yes, absolutely")}` : ''}`,
            `${warns.length > 0 ? `〔Warns: ${toCodeBlock(warns.join('\n'))}` : ''}`,
            `${joinedDate ? `〔Joined this server: ${toCodeBlock(joinedDate)}` : ''}`,
        ]

        const attachment = new MessageAttachment('./img/banner.jpg', 'banner.jpg');
        let embed = new MessageEmbed()
            .setColor(color)
            .setAuthor({name: `${user.user.tag}'s Profile`, iconURL: `${user.displayAvatarURL({ dynamic: true})}`})
            .setDescription(description.join('\n'))
            .setImage('attachment://banner.jpg')
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
        
        await channel.send({ embeds: [embed], files: [attachment] });
    }
}