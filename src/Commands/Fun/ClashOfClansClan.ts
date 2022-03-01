import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();
interface Clan {
    tag: string;
    name: string;
    type: string;
    description: string;
    location: {
        id: number;
        name: string;
        isCountry: boolean;
        countryCode: string;
    }
    badgeUrls: {
        small: string;
        medium: string;
        large: string;
    }
    clanLevel: number;
    clanPoints: number;
    clanVerusPoints: number;
    requiredTrophies: number;
    warWinStreak: number;
    warWins: number;
    isWarLogPublic: boolean;
    warLeague: {
        id: number;
        name: string;
    }
    members: number;
    memberList: [{
        tag: string;
        name: string;
        role: string;
        expLevel: number;
        league: {
            name: string;
            id: number;
        }
    }];
}
export const command: Command = {
    name: "clan",
    description: "get clash of clans info",
    details: "get clash of clans clan info",
    aliases: ["clashofclansclan"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["clashofclansclan <tag>"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions } = message;
        
        let tag = args[0];
        if (!tag || tag.includes('#')) return message.reply('invalid tag');
        try {
            axios.get(`https://api.clashofclans.com/v1/clans/%23${tag}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.CLASH_OF_CLANS_API_KEY}`
                }
            }).then((res) => {
                if (res.status === 500) return
                let clandata: Clan = res.data;

                const embed = new MessageEmbed()
                    .setThumbnail(clandata.badgeUrls.small)
                    .setTitle(`${clandata.name}`)
                    .setDescription(clandata.description)
                    .addFields(
                        {name: "Clan Points:", value: `${clandata.clanPoints}`, inline: true},
                        {name: "Members:", value: `${clandata.members}`, inline: true},
                        {name: "Leader:", value: `${clandata.memberList.find((l) => l.role === "leader")?.name}`, inline: true},
                        {name: "Wins:", value: `${clandata.warWins}`, inline: true},
                        {name: "League:", value: `${clandata.warLeague.name}`, inline: true},
                        {name: "Required Trophies:", value: `${clandata.requiredTrophies}`, inline: true},
                        {name: "Location:", value: `:flag_${clandata.location.countryCode.toLowerCase()}:`}
                    )
                    .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
                message.channel.send({ embeds: [embed] })
            })
        } catch (err) {
            console.log(err)
        }
        
    }
}
