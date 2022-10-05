import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import profileSchema from '../../schemas/profileSchema';
import { addXP, getXP, getLevel } from '../../Functions/Level';
import moment from 'moment';
import axios from 'axios';
import { ErrorEmbed } from '../../Functions/ErrorEmbed';
export const command: Command = {
    name: "connectbrawlhalla",
    description: "Connect your personal profile to brawlhalla",
    details: "Connect your personal profile to brawlhalla. Your brawlhalla id can be found under the inventory tab in brawlhalla",
    aliases: ["cntbwl"],
    ownerOnly: false,
    ClientPermissions: ["SendMessages", "SendMessagesInThreads", "ViewChannel"],
    UserPermissions: ["SendMessages"],
    run: async(client, message, args) => {
        const { guild, mentions, author, channel, content } = message;
        

        if (!guild) return;
        
        let userId = author.id
        let m = mentions.users.first();
        if (m) {
            userId = m.id;
            args.shift();
        }
        
        profileSchema.findOne({
            userId: userId,
            guildId: guild.id
        }).then(async(results) => {
            if (!results) return ErrorEmbed(message, client, command, 'You do not have a profile. Please create one with -profile');
            const { brawlhallaId, steamId } = results;
            

            if (!steamId && !args[0]) return ErrorEmbed(message, client, command, 'Please provide a steam id or connect to steam with -connectsteam');
            try {
                // if (args[0].match(/^\d+$/)) return temporaryMessage(channel, 'Please provide a valid steam id', 50);

                axios.get(`https://api.brawlhalla.com/search?steamid=${steamId || args[0]}&api_key=${process.env.BRAWLHALLA_API_KEY}`).then(async(res) => {
                    if (!res.data.brawlhalla_id) return ErrorEmbed(message, client, command, 'No results found 😑');
                    if (res.data.brawlhalla_id) {
                        results.brawlhallaId = res.data.brawlhalla_id;
                        results.save();
                        
                    }
                });
            } catch (err) {
                console.log(err);
            }
            
            if (args[0]) results.steamId = args[0];
            results.save();
            return temporaryMessage(channel, `Successfully connected your profile to Brawlhalla 😎`, 50);
        })
    }
}