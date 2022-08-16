import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, Interaction, MessageAttachment, MessageSelectMenu } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import { addXP } from '../../Functions/Level';
import profileSchema from '../../schemas/profileSchema';
import { ErrorEmbed } from '../../Functions/ErrorEmbed';
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
        if (!guild || !guild.id) return ErrorEmbed(message, client, command, `Command cannot be used outside of a guild.`);

        // Get the users profile from the database
        let results = await profileSchema.findOne({
            userId: author.id,
            guildId: guild.id,
            brawlhallacodes: { $exists: true, $ne: [] }
        });

    
        
        if (!results || !results.brawlhallacodes) return ErrorEmbed(message, client, command, `You do not have any brawlhalla codes`);
        
        const groupData = (d: any) => {
            let g = Object.entries(d.reduce((r: any, c: any) => (r[c.name]=[...r[c.name]||[], c],r), {}))
            return g.reduce((r: any, c: any) => (
                r.push({name: c[0], items: c[1]}), r), []);
        }


        // Get only the codes that are not already redeemed.
        let codes = results.brawlhallacodes.filter((unfilteredcodes: any) => unfilteredcodes.redeemed == false);

        let groupedCodes = groupData(codes);

        
        // MessageAttachment for the bottom border banner
        const attachment = new MessageAttachment('./img/banner.jpg', 'banner.jpg');

        // If random is selected
        if (args[0] && args[0].toLowerCase() === 'random') {
            args.shift()
            let rand = Math.floor(Math.random() * groupedCodes.length)
            // let rand = Math.floor(Math.random()*codes.length)
            let chosencode = groupedCodes[rand].items.pop();

            groupedCodes[rand].items.find((item: any) => item.code === chosencode.code).redeemed = true;
            // codes[rand].redeemed = true;

            results.save()

            const embed = new MessageEmbed()
                .setTitle(`${author.tag}'s Brawlhalla Code`)
                .setDescription(`${chosencode.name} | \`${chosencode.code}\``)
                .setImage('attachment://banner.jpg')
                .setFooter({ text: `Requested by ${author.tag}` })
                .setTimestamp()
            return author.send({ embeds: [embed], files: [attachment] })
        }
        
        let options: any = []

        groupedCodes.map((code: any, i: any) => {
            options.push({
                label: `${code.name}`,
                description: `${code.items.length}x left`,
                value: `${i}`
            })
        });


        /* let last25Codes = codes.slice(-25);
        last25Codes.forEach((code: any, i: any) => {
            if (i < 25 && code.name && code.name != null && code.redeemed == false) {
                options.push({
                    label: `${code.name}`,
                    value: `${i}`,
                    description: `${code.name}`
                })
            }
        }) */

        let row = await new MessageActionRow().addComponents(
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
        
        author.send({ embeds: [embed], components: [row], files: [attachment] }).then(async (msg) => {
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

                reaction.deferUpdate();

                // Get the name and the code
                let { name, code, redeemed } = groupedCodes[reaction.values[0]].items.pop();
                // let { name, code, redeemed } = last25Codes[reaction.values[0]];


                // Edit the MessageEmbed and disable the Select Menu
                embed.setDescription(`${name} | \`${code}\``)
                row.components[0].setDisabled(true)

                await profileSchema.findOneAndUpdate({
                    userId: author.id,
                    guildId: guild.id,
                    brawlhallacodes: { $elemMatch: { code: code } }
                }, {
                    $set: {
                        'brawlhallacodes.$.redeemed': true
                    }
                })

                msg.edit({ embeds: [embed], components: [row] })
                return
            })
            collect.on('end', async (collected) => {
                row.components[0].setDisabled(true)
                msg.edit({ embeds: [embed], components: [row] })
                return
            })
        })
    }
}
