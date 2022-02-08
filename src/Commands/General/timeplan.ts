import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageAttachment, ButtonInteraction, MessageComponentInteraction } from 'discord.js';
export const command: Command = {
    name: "timeplan",
    description: "shows timeplan",
    aliases: ["ukeplan"],
    run: async(client, message, args) => {
        //message.delete();
        const { guild } = message
        const guildId = guild?.id
        const d = new Date()
        const dateformat = (d: any) => {
            let dformat = [
                d.getDate(),
                d.getMonth()+1,
                d.getFullYear()
            ].join('/');
            return dformat
        }

        const monthdays: any = {
            1: '31',
            2: '28',
            3: '31',
            4: '30',
            5: '31',
            6: '30',
            7: '31',
            8: '31',
            9: '30',
            10: '31',
            11: '30',
            12: '31'
        }

        const days = monthdays[d.getMonth()+1]
        let monthtxt = ''
        for (let i = 1; i < days; i++) {
            monthtxt += i;
            monthtxt += '-'
            if (i == 7) {
                monthtxt += '\n'
            } else if (i == 14) {
                monthtxt += '\n'
            } else if (i == 21) {
                monthtxt += '\n'
            } else if (i == 28) {
                monthtxt += '\n'
            }
        }





        
        const toggle = new MessageButton()
            .setLabel(`${await language(guild, 'TIMEPLAN_SWITCH')}`)
            .setStyle(3)
            .setCustomId('1')
        const toggle2 = new MessageButton()
            .setLabel(`${await language(guild, 'TIMEPLAN_SWITCH')}`)
            .setStyle(1)
            .setCustomId('2')
        const close = new MessageButton()
            .setStyle(2)
            .setEmoji('❌')
            .setCustomId('3')

        const row = new MessageActionRow()
            .addComponents(
                toggle, 
                toggle2,
                close
            )
        const attachment = new MessageAttachment('./img/Ukeplan.PNG', 'Ukeplan.PNG')
        const attachment2 = new MessageAttachment('./img/Ukeplan2.PNG', 'Ukeplan2.PNG')

            

        let msg = await message.channel.send({
            files: [attachment],
            components: [row]
        })
        client.on("interactionCreate", async (button) => {
            if (!button.isButton()) return;
            
            console.log(`ID: `, button.customId)
            if (button.member?.user.id != message.author.id) return;
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
            }
            else if (button.customId == '3') {
                msg.delete()
                
            }
            
        });
    }
}
