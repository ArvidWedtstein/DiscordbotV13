import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, EmbedBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import profileSchema from '../../schemas/profileSchema';
import { addXP, getXP, getLevel } from '../../Functions/Level';
import moment from 'moment';
import axios from 'axios';
export const command: Command = {
    name: "connectclashroyale",
    description: "Connect your personal profile to clash royale",
    details: "Connect your personal profile to clash royale. Your clash royale id can be found under the profile tab in clash royale",
    aliases: ["cntcr", "cntclashroyale"],
    ownerOnly: false,
    ClientPermissions: ["SendMessages", "SEND_MESSAGES_IN_THREADS", "ViewChannel"],
    UserPermissions: ["SendMessages", "ViewChannel", "ATTACH_FILES", "EmbedLinks"],
    run: async(client, message, args) => {
        const { guild, mentions, author, channel, content } = message;
        

        if (!guild) return;
        
        let userId = author.id
        let m = mentions.users.first();
        if (m) {
            userId = m.id;
            args.shift();
        }

        await profileSchema.findOne({
            userId: userId,
            guildId: guild.id
        }).then(async(results) => {
            if (!results) return temporaryMessage(channel, 'You do not have a profile. Please create one with -profile', 15);
            
            const regex = /(#{1})[0-9A-Z]{8}/g;
            if (!args[0] || !regex.test(args[0])) return temporaryMessage(channel, 'Please provide a valid clash royale id', 15);
            
            results.clashRoyaleId = args[0];
            results.save();
            
            return temporaryMessage(channel, `Successfully connected your profile to Clash Royale 😎`, 30);
        })
    }
}