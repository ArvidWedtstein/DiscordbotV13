import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, AttachmentBuilder, ButtonInteraction, MessageComponentInteraction } from 'discord.js';
export const command: Command = {
    name: "timeplan",
    description: "shows timeplan",
    aliases: ["ukeplan"],
    run: async(client, message, args) => {

        const { guild, channel, author } = message
        const guildId = guild?.id
        const d = new Date()
        const toggle = new ButtonBuilder()
            .setLabel(`Page 1`)
            .setStyle(3)
            .setCustomId('1')
        const toggle2 = new ButtonBuilder()
            .setLabel(`Page 2`)
            .setStyle(1)
            .setCustomId('2')
        const close = new ButtonBuilder()
            .setStyle(2)
            .setEmoji('❌')
            .setCustomId('3')

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                toggle, 
                toggle2,
                close
            )
        const attachment = new AttachmentBuilder('./img/Ukeplan.PNG')
        const attachment2 = new AttachmentBuilder('./img/Ukeplan2.PNG')

            

        let msg = await channel.send({
            files: [attachment],
            components: [row]
        })

        // TODO - Replace this crap with messageComponent collector
        client.on("interactionCreate", async (button) => {
            if (!button.isButton()) return;
            button.deferUpdate();
            
            if (button.member?.user.id != author.id) return;
            if (button.customId == '1') {
                msg.edit({
                    files: [attachment2],
                    components: [row]
                })
            } else if (button.customId == '2') {
                msg.edit({
                    files: [attachment],
                    components: [row]
                })
            } else if (button.customId == '3') {
                msg.delete()
            }
        });
    }
}
