import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, Interaction } from 'discord.js';
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

        const setting = await Settings(message, 'money');

        if (!setting) return temporaryMessage(channel, `${language(guild, 'SETTING_OFF')} Economy ${language(guild, 'SETTING_OFF2')}`, 10);

        const guildId = guild?.id;
        const userId = author.id
        let xpreward = 100;
        addXP(guildId, userId, xpreward, message)

        let color = await getColor(guildId, userId)
        
        const btn = new MessageButton()
            .setCustomId('daily')
            .setLabel(`Click to claim your XP`)
            .setEmoji('💸')
        const row = new MessageActionRow()
            .addComponents(btn)
        const embed = new MessageEmbed()
            .setColor(color)
            .setDescription(`Click here to get your daily ${xpreward} XP reward!`)
            .setFooter({ text: `Requested By ${author.tag}`, iconURL: author.displayAvatarURL() })

        message.reply({ embeds: [embed], components: [row] }).then(async msg => {
            const filter = (i: Interaction) => i.user.id === author.id;
            let collect = msg.createMessageComponentCollector({
                filter, 
                max: 1,
                time: 60*1000
            });
            collect.on('collect', async (reaction: any) => {
                if (!reaction) return;
                
                msg.edit({ embeds: [embed.setDescription(`${author} ${await language(guild, "DAILY_ERLINGCOINS")}! (${xpreward}xp)`)] })
            })
        })
    }
}
