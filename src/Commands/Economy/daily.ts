import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import { addXP } from '../../Functions/Level';
export const command: Command = {
    name: "daily",
    description: "get your daily xp",
    details: "get your daily xp",
    aliases: ["dailyxp"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["daily"],
    
    run: async(client, message, args) => {
        const { guild, channel, author } = message;
        message.delete();
        const setting = await Settings(message, 'money');

        if (setting == false) return temporaryMessage(channel, `${language(guild, 'SETTING_OFF')} Economy ${language(guild, 'SETTING_OFF2')}`, 10);

        const guildId = guild?.id;
        const userId = author.id
        let xpreward = 100;
        addXP(guildId, userId, xpreward, message)
        channel.send(`${author} ${language(guild, "DAILY_ERLINGCOINS")}! (${xpreward}xp)`)
    }
}
