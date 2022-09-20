import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import profileSchema from '../../schemas/profileSchema';
import APIcacheSchema from '../../schemas/BrawlhallaAPIcacheSchema';
import { addXP, getXP, getLevel } from '../../Functions/Level';
import moment from 'moment';
import sharp from 'sharp';
import axios from 'axios';
export const command: Command = {
    name: "profile",
    description: "Your personal profile",
    details: "Your profile. Contains stats about you.",
    aliases: ["p"],
    ownerOnly: false,
    ClientPermissions: ["SEND_MESSAGES", "SEND_MESSAGES_IN_THREADS", "VIEW_CHANNEL"],
    UserPermissions: ["SEND_MESSAGES"],
    examples: ["-profile <username?>"],

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

        // Test

        // new APIcacheSchema({
        //     guildId: guildId,
        //     deletedAt: new Date()
        // }).save()
        if (!results) {
            new profileSchema({
                userId,
                guildId
            })
        }


        let messages = results.messageCount;
   
        if (results && results.birthday != '1/1') birthday = results.birthday;
        if (!results.birthday || results.birthday == '1/1') {
            let res2 = await profileSchema.findOne({
                userId,
                birthday: {
                    $exists: true,
                    $ne: null || '1/1'
                }
            })
            if (res2) birthday = res2.birthday;
        }

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
            `〔Words Solved: ${toCodeBlock(results.guessedWords.length)}`,
            `${presence ? `〔Game: ${toCodeBlock(presence)}` : ''}`,
            `${results.brawlhalla ? `〔Brawlhalla fan: ${toCodeBlock("yes, absolutely")}` : ''}`,
            `${warns.length > 0 ? `〔Warns: ${toCodeBlock(warns.join('\n'))}` : ''}`,
            `${joinedDate ? `〔Joined this server: ${toCodeBlock(joinedDate)}` : ''}`,
        ]

        // let svg = await axios.get('https://arvidgithubembed.herokuapp.com/line?values=00,20,30&backgroundcolor=ff0000')

        // const img = await sharp(Buffer.from(svg.data))
        //     .png()
        //     .toBuffer()


        // let a = new AttachmentBuilder(img, 'weather.jpg')

        const attachment = new AttachmentBuilder('./img/banner.jpg', 'banner.jpg');
        let embed = new EmbedBuilder()
            .setColor(color)
            .setAuthor({name: `${user.user.tag}'s Profile`, iconURL: `${user.displayAvatarURL({ dynamic: true })}`})
            .setDescription(description.join('\n'))
            .setImage('attachment://banner.jpg')
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })

        
        
        await channel.send({ embeds: [embed], files: [attachment] });
    }
}