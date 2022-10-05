import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import language, { insert } from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, Interaction } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import { addXP } from '../../Functions/Level';
import { ErrorEmbed } from '../../Functions/ErrorEmbed';
export const command: Command = {
    name: "daily",
    description: "get your daily xp",
    details: "get your daily xp",
    aliases: ["dailyxp"],
    hidden: false,
    UserPermissions: ["SendMessages"],
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
    examples: ["daily"],
    
    run: async(client, message, args) => {
        const { guild, channel, author } = message;
        if (!guild) return;
        const setting = await Settings(message, 'money');


        if (!setting) return ErrorEmbed(message, client, command, `${insert(guild, 'SETTING_OFF', "Economy")}`); 

        const guildId = guild?.id;
        const userId = author.id
        let xpreward = 100;

        let color = await getColor(guildId, userId)
        
        const btn = new ButtonBuilder()
            .setCustomId('daily')
            .setLabel(`Click to claim your XP`)
            .setEmoji('💸')
            .setStyle(3)
        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(btn)
        const embed = new EmbedBuilder()
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
            collect.on('collect', async (reaction) => {
                if (!reaction) return;
                reaction.deferUpdate();
                addXP(guildId, userId, xpreward, message)
                // reaction.message.embeds[0].description = `${author} ${await language(guild, "DAILY_ERLINGCOINS")}! (${xpreward}xp)`
                msg.edit({ embeds: [embed.setDescription(`${author} ${await language(guild, "DAILY_ERLINGCOINS")}! (${xpreward}xp)`)], components: [] })
            })
        })
    }
}
