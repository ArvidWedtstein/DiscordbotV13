import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language, { setLanguage } from '../../Functions/language';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, Interaction } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import settingsSchema from '../../schemas/settingsSchema';
export const command: Command = {
    name: "setlanguage",
    description: "check my ping",
    details: "Check the ping of this bot.",
    aliases: ["setlang"],
    hidden: false,
    UserPermissions: [
        "SEND_MESSAGES", 
        'ADMINISTRATOR'
    ],
    ClientPermissions: [
        "SEND_MESSAGES", 
        "ADD_REACTIONS"
    ],
    ownerOnly: false,
    examples: ["setlanguage <language>"],
    
    run: async(client, message, args) => {
        const { guild, channel, author } = message;

        const language = ['🇩🇪', '🇳🇴', '🇬🇧', '❌']
        const getEmoji = (emojiName: any) => client.emojis.cache.find((emoji) => emoji.name === emojiName)
        const guildId = guild?.id;

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setEmoji('🇬🇧')
                    .setStyle(3)
                    .setCustomId('lang_gb'),
                new MessageButton()
                    .setEmoji('🇩🇪')
                    .setStyle(3)
                    .setCustomId('lang_de'),
                new MessageButton()
                    .setEmoji('🇳🇴')
                    .setStyle(3)
                    .setCustomId('lang_no'),
                new MessageButton()
                    .setEmoji('❌')
                    .setStyle(3)
                    .setCustomId('lang_close')
            )
        let embed = new MessageEmbed()
            .setColor("DARKER_GREY")
            .setTitle(`Language`)
            .setDescription(`Select Language\nNot all translations may be correct`)
            /*.addFields(
                {name: language[0], value: 'German'},
                {name: language[1], value: `Norwegian`},
                {name: language[2], value: `English`},
            )*/
        let messageEmbed = await channel.send({
            embeds: [embed],
            components: [row]
        })

        const filter = (i: Interaction) => i.user.id === author.id;
        let collect = messageEmbed.createMessageComponentCollector({
            filter, 
            max: 1,
            time: 60000
        });
        collect.on('collect', async (reaction) => {
            if (!reaction) return;
            if (!reaction.isButton()) return;

            switch (reaction.customId) {
                case "lang_de":
                    let embedDE = new MessageEmbed()
                        .setTitle(`Language`)
                        .setDescription(`Language set to German${language[0]}`)
                        .addFields(
                            {name: language[3], value: 'back'}
                        )
                    reaction.reply({ embeds: [embedDE], components: [row] })

                    setLanguage(guild, 'german')

                    await settingsSchema.findOneAndUpdate({
                        guildId: guildId
                    }, {
                        language: 'german'
                    }, {
                        upsert: true
                    })
                    break;
                case "lang_no":
                    let embedNO = new MessageEmbed()
                        .setTitle(`Language`)
                        .setDescription(`Language set to Norwegian${language[1]}`)
                        .addFields(
                            {name: language[3], value: 'back'}
                        )
                    reaction.reply({ embeds: [embedNO], components: [row] })

                    setLanguage(guild, 'norwegian')

                    await settingsSchema.findOneAndUpdate({
                        guildId: guildId
                    }, {
                        language: 'norwegian'
                    }, {
                        upsert: true
                    })
                    break;
                case "lang_gb":
                    let embedeng = new MessageEmbed()
                        .setTitle(`Language`)
                        .setDescription(`Language set to English${language[2]}`)
                        .addFields(
                            {name: language[3], value: 'Close'}
                        )
                    reaction.reply({ embeds: [embedeng], components: [row] })


                    setLanguage(guild, 'english')

                    await settingsSchema.findOneAndUpdate({
                        guildId: guildId
                    }, {
                        language: 'english'
                    }, {
                        upsert: true
                    })
                    break;
                case "lang_close":
                    reaction.message.embeds = []
            }
        })
    }
}
