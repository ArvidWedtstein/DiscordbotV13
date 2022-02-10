import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import profileSchema from '../../schemas/profileSchema';
export const command: Command = {
    name: "brawlhalla",
    description: "get brawlhalla stream notifications",
    aliases: ["brawlhalla"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["brawlhalla"],
    
    run: async(client, message, args) => {

        const userId = message.author.id;
        const guildId = message.guild?.id;
        const results = await profileSchema.findOne({
            userId,
            guildId
        })
        if (!results.brawlhalla) {
            await new profileSchema({
                guildId,
                userId
            }).save()
        }

        const btnoff = new MessageButton() 
            .setCustomId('brawlhallabuttonoff')
            .setEmoji('885437713707331634')
            .setLabel('I want brawlhalla notification plz')
            .setStyle("DANGER")
        const rowoff = new MessageActionRow().addComponents(btnoff);

        const btnon = new MessageButton() 
            .setCustomId('brawlhallabuttonon')
            .setEmoji('885437713707331634')
            .setLabel('I do not wish brawlhalla notification plz')
            .setStyle("SUCCESS")
        const rowon = new MessageActionRow().addComponents(btnon);


        const embedoff = new MessageEmbed()
            .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
            .setTitle(`is not registered to recieve brawlhalla notifications`)
            .setFooter({ text: `Requested by ${message.author.tag}`})
            .setTimestamp()
        const embedon = new MessageEmbed()
            .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL()})
            .setTitle(`is now registered to recieve brawlhalla notifications`)
            .setFooter({ text: `Requested by ${message.author.tag}`})
            .setTimestamp()

        if (results.brawlhalla)  message.channel.send({embeds: [embedon], components: [rowon]});
        else  message.channel.send({embeds: [embedoff], components: [rowoff]});


        client.on("interactionCreate", async (button) => {
            if (!button.isButton()) return;
            console.log(button.customId)
            if ((button.customId !== 'brawlhallabuttonon') && (button.customId !== 'brawlhallabuttonoff')) return console.log('aaaaaaaaa');

            // button.deferUpdate();
            if (results.brawlhalla) {
                button.update({embeds: [embedoff], components: [rowoff]});
                const res = await profileSchema.findOneAndUpdate({
                    userId,
                    guildId
                }, {
                    brawlhalla: false
                })
                
                rowoff.components[0].setDisabled(true);
                return
            } else {
                button.update({embeds: [embedon], components: [rowon]});
                const res = await profileSchema.findOneAndUpdate({
                    userId,
                    guildId
                }, {
                    brawlhalla: true
                })
                rowon.components[0].setDisabled(true);
                return
            }
        });
    }
}