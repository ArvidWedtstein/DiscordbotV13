//#8RP8QLCUG
//clantag #23QLVQY28G
//https://api.clashofclans.com/v1/clans/%23QLVQY28G/members
import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import axios from 'axios';
export const command: Command = {
    name: "clashofclans",
    description: "get clash of clans info",
    details: "get clash of clans clan info",
    aliases: ["coc"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["clashofclans <tag>"],
    
    run: async(client, message, args) => {
        
        let tag = args[0]
        if (!tag) return message.reply('invalid tag');
        axios.get(`https://api.clashofclans.com/v1/clans/%${tag}/members`, {
            headers: {
                'Authorization': `Bearer ${process.env.CLASH_OF_CLANS_API_KEY}`
            }
        }).then((res) => {
            let data = res.data.items.slice(0, 10);
            let userdata: any = [];
            data.forEach((user: any) => {
                userdata.push({name: `${user.name}`, value: `${user.league.name}`})
            });
            let thumbnail = res.data.items[0].league.iconUrls.medium
            const embed = new MessageEmbed({
                title: `Clash Of Clans`,
                fields: userdata,
                thumbnail: thumbnail,
                image: thumbnail,
                author: {name: "test", iconURL: thumbnail}
            })
            message.channel.send({ embeds: [embed] })
            message.channel.send({ content: thumbnail })
        })
    }
}