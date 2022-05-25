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
import axios from 'axios';
export const command: Command = {
    name: "connectbrawlhalla",
    description: "Connect your personal profile to brawlhalla",
    details: "Connect your personal profile to brawlhalla. Your brawlhalla id can be found under the inventory tab in brawlhalla",
    aliases: ["cntbwl"],
    ownerOnly: false,
    ClientPermissions: ["SEND_MESSAGES", "SEND_MESSAGES_IN_THREADS", "VIEW_CHANNEL"],
    UserPermissions: ["SEND_MESSAGES"],
    run: async(client, message, args) => {
        const { guild, mentions, author, channel, content } = message;

        if (!guild) return;
        
        
        profileSchema.findOne({
            userId: author.id,
            guildId: guild.id
        }).then(async(results) => {
            if (!results) return temporaryMessage(channel, 'You do not have a profile. Please create one with -profile', 50);
            let { brawlhallaId, steamId, brawlhallaStats } = results;
            if (!brawlhallaId) return temporaryMessage(channel, 'You do not have a brawlhalla id. Please connect your profile to brawlhalla with -connectbrawlhalla {steam id}', 50);
            brawlhallaStats = !brawlhallaStats;

            results.save();
            return temporaryMessage(channel, `Your brawlhalla progress is now being tracked 😎`, 50);
        })
    }
}