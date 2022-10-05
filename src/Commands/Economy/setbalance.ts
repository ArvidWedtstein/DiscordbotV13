import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';

import language, { insert } from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import { ErrorEmbed } from '../../Functions/ErrorEmbed';
export const command: Command = {
    name: "setbalance",
    description: "set the balance of a user",
    details: "set the balance of a user",
    aliases: ["setmoney"],
    hidden: false,
    UserPermissions: ["SendMessages", "Administrator", "ModerateMembers"],
    ClientPermissions: [
        'SendMessages',
        'AddReactions',
        'AttachFiles',
        'EmbedLinks',
        'ManageMessages',
        'ReadMessageHistory',
        'ViewChannel'
    ],
    ownerOnly: false,
    examples: ["setbalance @user <amount>"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, mentions } = message;
        if (!guild) return;
        const mention = mentions.users.first()

        const setting = await Settings(message, 'moderation');
        if (!setting) return ErrorEmbed(message, client, command, `${insert(guild, 'SETTING_OFF', "Economy")}`); 
        

        const coins: any = args[1]
        if (isNaN(coins) || !mention) return ErrorEmbed(message, client, command, `${language(guild, 'ECONOMY_VALID')}`);
        
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
