import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
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
    name: "connectsteam",
    description: "Connect your personal profile to steam",
    details: "Connect your personal profile to steam",
    aliases: ["steam"],
    ownerOnly: false,
    ClientPermissions: ["SendMessages", "SendMessagesInThreads", "ViewChannel"],
    UserPermissions: ["SendMessages"],
    run: async(client, message, args) => {
        const { guild, mentions, author, channel, content } = message;

        if (!guild) return;

        let steamId = args[0];
        if (!steamId) return ErrorEmbed(message, client, command, `Please provide a steam id`);
        profileSchema.find({
            userId: author.id
        }).then(async(results) => {
            if (results.length < 1) return ErrorEmbed(message, client, command, 'You do not have a profile. Please create one with -profile');
            
            results.forEach(async(result) => {
                // if (result.steamId) return temporaryMessage(channel, 'You already have a steam id connected', 50);

                try {
                    axios.get(`https://api.brawlhalla.com/search?steamid=${steamId}&api_key=${process.env.BRAWLHALLA_API_KEY}`).then(async(res) => {
                        if (!res.data.length || !res.data) return
    
                        if (res.data.brawlhalla_id) {
                            result.brawlhallaId = res.data.brawlhalla_id;
                        }
                    });
                } catch (e) {
                    console.log(e);
                }
                result.steamId = steamId;
                result.save();
            });
            return temporaryMessage(channel, 'Your steam id has been linked to your profile 😁', 50);
        })
    }
}