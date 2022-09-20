import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, AttachmentBuilder } from 'discord.js';
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
        if (!u) return temporaryMessage(channel, `Please mention a user to compare stats to`, 50);

        let usr1 = author;
        let usr2 = u;

        // Remove the user mention from the arguments
        args.shift();
        
        // Check if there is muliple mentions
        let u2 = mentions.users.size > 1 ? mentions.users.last() : null;
        if (u2) {
            args.shift();
            usr1 = u2;
        }

        // Get the character name
        let character = args[0];

        // TODO - Add functionallity to just compare the users stats if no character is specified
        if (!character) return temporaryMessage(channel, `Please specify a brawlhalla character to compare your stats to`, 50);

        const getProfile = (async(userId: any, guildId: any) => {
            let profile = await profileSchema.findOne({
                userId,
                guildId
            });
            if (!profile) return temporaryMessage(channel, `${guild.members.cache.get(userId)?.user.username} does not have a profile. Please create one with -profile`, 50);
            if (!profile.steamId) return temporaryMessage(channel, `${guild.members.cache.get(userId)?.user.username} does not have a steam id. Please connect with -connectsteam {steamid}`, 50);
            
            return profile;
        })
        
        let user1Profile: any = await getProfile(usr1.id, guild.id);
        let user2Profile: any = await getProfile(usr2.id, guild.id);

        const checkBrawlhallaId = (async (userProfile: any) => {
            if (!userProfile.brawlhallaId && userProfile.steamId) {
                try {
                    axios.get(`https://api.brawlhalla.com/search?steamid=${userProfile.steamId}&api_key=${process.env.BRAWLHALLA_API_KEY}`).then(async(res) => {
                        if (!res.data.brawlhalla_id) return temporaryMessage(channel, `${guild.members.cache.get(userProfile.userId)?.user.username} does not have a brawlhalla id`, 20);
    
                        userProfile.brawlhallaId = res.data.brawlhalla_id;
                        userProfile.save();
                    });
                } catch (err) {
                    console.log(err);
                }
                if (!userProfile.brawlhallaId) return temporaryMessage(channel, `${guild.members.cache.get(userProfile.userId)?.user.username} does not have a brawlhalla id`, 20);
                return userProfile
            }
            return userProfile
        });

        // Check if user1 do not have a brawlhalla id
        user1Profile = await checkBrawlhallaId(user1Profile);

        // Check if user2 do not have a brawlhalla id
        user2Profile = await checkBrawlhallaId(user2Profile);


        const getStats = (async (userProfile: any, character: string) => {
            const userStats: any = await axios.get(`https://api.brawlhalla.com/player/${userProfile.brawlhallaId}/stats?api_key=${process.env.BRAWLHALLA_API_KEY}`);
            let userLegend = userStats.data.legends.find((legend: any) => legend.legend_name_key === character.toLowerCase());

            if (!userLegend) return temporaryMessage(channel, 'No legend with this name found', 20);

            function toCodeBlock(str: any) {
                return `\`${str}\``
            }

            return [
                `〔Level: ${toCodeBlock(userLegend.level)}〕`,
                `〔XP: ${toCodeBlock(userLegend.xp)}〕`,
                `〔Wins: ${toCodeBlock(userLegend.wins)}〕`,
                `〔Games: ${toCodeBlock(userLegend.games)}〕`,
                `〔KOs: ${toCodeBlock(userLegend.kos)}〕`,
                `〔Damage Dealt: ${toCodeBlock(userLegend.damagedealt)}〕\n`,
            ].join('\n');
        });


        let description = [
            `**${usr1.username}'s Stats for ${character}**`,
            await getStats(user1Profile, character),
            `**${usr2.username}'s Stats for ${character}**`,
            await getStats(user2Profile, character)
        ]

        const attachment = new AttachmentBuilder('./img/banner.jpg', 'banner.jpg');
        let embed = new EmbedBuilder()
            .setColor(client.config.botEmbedHex)
            .setAuthor({ name: `${usr1.username}'s & ${usr2.username}'s Stats for ${character}` })
            .setDescription(description.join('\n'))
            .setThumbnail(`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrLB1letx0NtgkR-wgqOHCsYsISHHfsXepQzjMb3drZA&s`)
            .setImage('attachment://banner.jpg')
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
        return channel.send({ embeds: [embed], files: [attachment] })
    }
}


