import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import icon from '../../Functions/icon';
import profileSchema from '../../schemas/profileSchema';
import axios from 'axios';

export const command: Command = {
    name: "comparebrawlhallastats",
    description: "compare your brawlhalla stats to another user",
    details: "compare your brawlhalla stats to another user",
    aliases: ["cmpbwlstats"],
    group: "Fun",
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["comparebrawlhallastats @user character"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions, attachments } = message;
        if (!guild) return

        let u = mentions.users.first();
        if (!u) return temporaryMessage(channel, `Please mention a user to compare your stats to`, 50);
        args.shift();

        let character = args[0];
        if (!character) return temporaryMessage(channel, `Please specify a character to compare your stats to`, 50);
        const user1: any = await profileSchema.findOne({
            userId: author.id,
            guildId: guild.id
        });
        const user2: any = await profileSchema.findOne({
            userId: u.id,
            guildId: guild.id
        });

        if (!user1) return temporaryMessage(channel, 'You do not have a profile. Please create one with -profile', 50);
        if (!user2) return temporaryMessage(channel, `${u.username} does not have a profile`, 50);
        if (!user1.steamId) return temporaryMessage(channel, 'You do not have a steam id. Please connect your profile to steam with -connectsteam {steamid}', 50);
        if (!user2.steamId) return temporaryMessage(channel, `${u.username} does not have a steam id.`, 50);
        if (!user1.brawlhallaId) return temporaryMessage(channel, 'You do not have a brawlhalla id. Please connect your profile to brawlhalla with -connectbrawlhalla {steamid}', 50);
        if (!user2.brawlhallaId) return temporaryMessage(channel, `${u.username} do not have a brawlhalla id.`, 50);


        function toCodeBlock(str: any) {
            return `\`${str}\``
        }

        let user1Stats: any = await axios.get(`https://api.brawlhalla.com/player/${user1.brawlhallaId}/stats?api_key=${process.env.BRAWLHALLA_API_KEY}`);
        let user2Stats: any = await axios.get(`https://api.brawlhalla.com/player/${user2.brawlhallaId}/stats?api_key=${process.env.BRAWLHALLA_API_KEY}`);
        const user1Legends = user1Stats.data.legends;
        const user2Legends = user2Stats.data.legends;
            
        let user1Legend = user1Legends.find((legend: any) => legend.legend_name_key === character.toLowerCase());
        let user2Legend = user2Legends.find((legend: any) => legend.legend_name_key === character.toLowerCase());
        if (!user1Legend) return temporaryMessage(channel, 'No legend with this name found', 50);

        let description = [
            `**${author.username}'s Stats for ${character}**`,
            `〔Level: ${toCodeBlock(user1Legend.level)}〕`,
            `〔XP: ${toCodeBlock(user1Legend.xp)}〕`,
            `〔Wins: ${toCodeBlock(user1Legend.wins)}〕`,
            `〔Games: ${toCodeBlock(user1Legend.games)}〕`,
            `〔KOs: ${toCodeBlock(user1Legend.kos)}〕`,
            `〔Damage Dealt: ${toCodeBlock(user1Legend.damagedealt)}〕\n`,
            `**${u.username}'s Stats for ${character}**`,
            `〔Level: ${toCodeBlock(user2Legend.level)}〕`,
            `〔XP: ${toCodeBlock(user2Legend.xp)}〕`,
            `〔Wins: ${toCodeBlock(user2Legend.wins)}〕`,
            `〔Games: ${toCodeBlock(user2Legend.games)}〕`,
            `〔KOs: ${toCodeBlock(user2Legend.kos)}〕`,
            `〔Damage Dealt: ${toCodeBlock(user2Legend.damagedealt)}〕`
        ]

        const attachment = new MessageAttachment('./img/banner.jpg', 'banner.jpg');
        let embed = new MessageEmbed()
            .setColor(client.config.botEmbedHex)
            .setAuthor({ name: `${u.username}'s & ${author.username}'s Stats for ${character}`, iconURL: u.displayAvatarURL() })
            .setDescription(description.join('\n'))
            .setThumbnail(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrLB1letx0NtgkR-wgqOHCsYsISHHfsXepQzjMb3drZA&s`)
            .setImage('attachment://banner.jpg')
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
        return channel.send({ embeds: [embed], files: [attachment] })
    }
}


