import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, Interaction, MessageAttachment, MessageSelectMenu } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import { addXP } from '../../Functions/Level';
import profileSchema from '../../schemas/profileSchema';
export const command: Command = {
    name: "getbrawlhallacode",
    description: "get Brawlhalla Code",
    details: "get Brawlhalla Code",
    aliases: ["getbwlcode"],
    hidden: true,
    UserPermissions: ["ADMINISTRATOR"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS", "EMBED_LINKS"],
    ownerOnly: true,
    examples: ["getbrawlhallacode"],
    run: async(client, message, args) => {
        const { guild, channel, author } = message;
        if (!guild) return

        // Get the users profile from the database
        const results = await profileSchema.findOne({
            userId: author.id,
            guildId: guild.id,
            brawlhallaCode: { $exists: true }
        })

        if (!results || !results.brawlhallacodes) return temporaryMessage(channel, `You do not have any brawlhalla codes`, 20);

        // Get only the codes that are not already redeemed.
        let codes = results.brawlhallacodes.filter((unfilteredcodes: any) => unfilteredcodes.redeemed == false);


        // MessageAttachment for the bottom border banner
        const attachment = new MessageAttachment('./img/banner.jpg', 'banner.jpg');

        // If random is selected
        if (args[0] && args[0].toLowerCase() === 'random') {
            args.shift()
            let rand = Math.floor(Math.random()*codes.length)
            let chosencode = codes[rand];

            codes[rand].redeemed = true;

            results.save()

            const embed = new MessageEmbed()
                .setTitle(`${author.tag}'s Brawlhalla Code`)
                .setDescription(`${chosencode.name} | \`${chosencode.code}\``)
                .setImage('attachment://banner.jpg')
                .setFooter({ text: `Requested by ${author.tag}` })
                .setTimestamp()
            return author.send({ embeds: [embed] })
        }
        
        let options = []
        for (let i = 0; i < codes.length; i++) {
            let option: any = {
                label: `${codes[i].name}`,
                value: `${i}`,
                description: `${codes[i].name}`,
                // emoji: {
                //     name: `FeelsGerman`,
                //     id: "885437713707331634"
                // }
            }
            // Check if name is empty.
            if (codes[i].name.length > 0 && codes[i].name != null && codes[i].redeemed == false) {
                options.push(option)
            }
        }
        let row = new MessageActionRow().addComponents(
            new MessageSelectMenu({
                customId: 'brawlhalla_code_menu',
                placeholder: "Select Item",
                options: options,
                maxValues: 1,
                minValues: 1
            })
        )

        const embed = new MessageEmbed()
            .setTitle(`${author.tag}'s Brawlhalla Codes`)
            .setImage('attachment://banner.jpg')
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
        
        author.send({ embeds: [embed], components: [row] }).then(async (msg) => {
            // Filter for checking that no one unauthorised uses the Select Menu.
            const filter = (i: Interaction) => i.user.id === author.id && 
                i.isSelectMenu() && 
                i.customId === 'brawlhalla_code_menu';

            let collect = msg.createMessageComponentCollector({
                filter, 
                max: 1,
                time: 60*1000
            });

            collect.on('collect', async (reaction) => {
                if (!reaction) return;
                if (reaction.message.id != msg.id) return;
                if (!reaction.isSelectMenu()) return;

                // The line of code under is experimental
                reaction.deferUpdate();

                // Get the name and the code
                let { name, code, redeemed } = codes[reaction.values[0]];

                // Edit the MessageEmbed and disable the Select Menu
                embed.setDescription(`${name} | \`${code}\``)
                row.components[0].setDisabled(true)

                let res = results.brawlhallacodes.find((code: any) => code.code === code)
                res.redeemed = true;
                redeemed = true;
                results.save()
                reaction.update({ embeds: [embed], components: [row] })

    

                return
            })
        })
    }
}
