import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
export const command: Command = {
    name: "setbalance",
    description: "check my ping",
    details: "Check the ping of this bot.",
    aliases: ["setmoney"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS", 'ADMINISTRATOR'],
    ownerOnly: false,
    examples: ["setbalance @user <amount>"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, mentions } = message;
        const mention = mentions.users.first()
        message.delete()
        const setting = await Settings(message, 'moderation');
        if (!setting) return temporaryMessage(channel, `${language(guild, 'SETTING_OFF')} Moderation ${language(guild, 'SETTING_OFF2')}`, 10);
        

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
