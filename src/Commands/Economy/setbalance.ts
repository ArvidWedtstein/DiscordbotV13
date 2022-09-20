import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language, { insert } from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
export const command: Command = {
    name: "setbalance",
    description: "set the balance of a user",
    details: "set the balance of a user",
    aliases: ["setmoney"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES", "ADMINISTRATOR", "MODERATE_MEMBERS"],
    ClientPermissions: [
        'SEND_MESSAGES',
        'ADD_REACTIONS',
        'ATTACH_FILES',
        'EMBED_LINKS',
        'MANAGE_MESSAGES',
        'READ_MESSAGE_HISTORY',
        'VIEW_CHANNEL'
    ],
    ownerOnly: false,
    examples: ["setbalance @user <amount>"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, mentions } = message;
        if (!guild) return;
        const mention = mentions.users.first()

        const setting = await Settings(message, 'moderation');
        if (!setting) return temporaryMessage(channel, `${insert(guild, 'SETTING_OFF', "Economy")}`, 10);
        

        const coins: any = args[1]
        if (isNaN(coins) || !mention) return temporaryMessage(channel, `${language(guild, 'ECONOMY_VALID')}`, 10)
        
        const guildId = guild?.id
        const userId = mention.id

        const newCoins = await setCoins(
            guildId,
            userId,
            coins
        )

        message.reply(`${language(guild, 'ECONOMY_SETBAL')} <@${userId}>'s ${language(guild, 'ECONOMY_SETBAL2')} ${newCoins} ErlingCoins!`)
    }
}
