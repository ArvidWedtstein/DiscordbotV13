import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, Interaction, MessageAttachment } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import { addXP } from '../../Functions/Level';
import { now } from 'mongoose';
export const command: Command = {
    name: "testreactiontime",
    description: "testreactiontime",
    details: "testreactiontime",
    aliases: ["testreactiontiming"],
    hidden: true,
    UserPermissions: ["ADMINISTRATOR"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS", "EMBED_LINKS"],
    ownerOnly: true,
    examples: ["testembed"],
    
    run: async(client, message, args) => {
        const { guild, channel, author } = message;

        const guildId = guild?.id;
        const userId = author.id

        // list 10 random emojis in a array
        const emojis = ['🍎', '🍌', '🍒', '🍓', '🍑', '🍋', '🍉', '🍇', '🍊', '🍈'];

        const date1 = Date.now();
        message.reply({ content: `REACTING...` }).then(async msg => {
            for (const emoji of emojis) {
                await msg.react(emoji);
            }
            msg.edit({ content: `It took me: ${(Date.now() - date1) / 1000} Seconds to react with ${emojis.length} emojis` })
        })
    }
}
