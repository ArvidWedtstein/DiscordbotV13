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
    name: "brawlhallastatstracker",
    description: "Connect your personal profile to brawlhalla",
    details: "Connect your personal profile to brawlhalla. Your brawlhalla id can be found under the inventory tab in brawlhalla",
    aliases: ["bwltracker"],
    ownerOnly: false,
    ClientPermissions: ["SendMessages", "SendMessagesInThreads", "ViewChannel"],
    UserPermissions: ["SendMessages"],
    run: async(client, message, args) => {
        const { guild, mentions, author, channel, content } = message;

        if (!guild) return;
        
        
        profileSchema.findOne({
            userId: author.id,
            guildId: guild.id
        }).then(async(results) => {

            if (!results) return ErrorEmbed(message, client, command, 'You do not have a profile. Please create one with -profile');
            let { brawlhallaId, steamId, brawlhallaStats } = results;
            if (!brawlhallaId) return ErrorEmbed(message, client, command, 'You do not have a brawlhalla id. Please connect your profile to brawlhalla with -connectbrawlhalla {steam id}');
            brawlhallaStats = !brawlhallaStats;

            results.save();
            return temporaryMessage(channel, `Your brawlhalla progress is now being tracked 😎`, 50);
        })
    }
}