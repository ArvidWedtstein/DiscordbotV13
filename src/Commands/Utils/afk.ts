import { Command } from '../../Interfaces';
import { Settings } from '../../settings';
import * as gradient from 'gradient-string';
import language from '../../language';
import { addCoins, setCoins, getCoins, getColor } from '../../economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import afk from '../../Collection'
export const command: Command = {
    name: "afk",
    run: async(client, message, args) => {
        const reason = args.join(' ') || "No Reason";
        setTimeout(() => {
            afk.set(message.author.id, [Date.now(), reason])
        }, 1000)
        

        message.reply(`You are now afk \`${reason}\``)
    }
}