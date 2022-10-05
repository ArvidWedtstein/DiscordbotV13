import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, SelectMenuOptionBuilder, MessageSelectOption, Interaction, SelectMenuBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import icon from '../../Functions/icon';
import boticons from '../../Functions/boticons';
import emojiCharacters from '../../Functions/emojiCharacters';
import { PageEmbed, PageEmbedOptions } from '../../Functions/PageEmbed';
import { ErrorEmbed } from '../../Functions/ErrorEmbed';
export const command: Command = {
    name: "help",
    description: "get some help",
    aliases: ["plzhelp", 'h'],
    hidden: false,
    UserPermissions: ["SendMessages"],
    ClientPermissions: ["SendMessages", "AddReactions"],
    ownerOnly: false,
    examples: ["help <cmd>"],
    
    run: async(client, message, args) => {
        const { guild, author, channel, member } = message
        const guildId = guild?.id
        const userId = author.id;

        const getEmoji = (emojiName: any) => {
            let d: any = icon(client, guild, emojiName)
            return d
        }


        let embedcolor: any = await getColor(guildId, userId);

        // if user specified a specific command
        if (args[0]) {
            let chosencmd = client.registry.commands.find((c: any) => c.name === args[0])

            if (!chosencmd) return ErrorEmbed(message, client, command, `Command could not be found`);
            
            const { name, description, details, UserPermissions, aliases, group } = chosencmd;

            let embed = new EmbedBuilder({
                title: `${getEmoji("help")} ${language(guild, 'HELP_TITLE')} - ${name}`,
                description: `${details ? details : description}`,
                fields: [
                    {name: `**Usage**`, value: `\`${name}\``},
                    {name: `**Aliases**`, value: `\`${aliases ? aliases : 'None'}\``},
                    {name: `**Permissions Needed**`, value: `\`${UserPermissions ? UserPermissions.join(',') : 'None'}\``}
                ],
                footer: {"text": `Requested By ${author.tag}`, iconURL: author.displayAvatarURL()}
            })
            let msgembed = channel.send({ embeds: [embed] });
            return
        }

        function capitalizeFirstLetter(string: String) {
            return string.toString().charAt(0).toUpperCase() + string.toString().slice(1);
        }

        const categories: any = client.registry.groups.map((f) => f.name)

        // const pages: PageEmbedOptions[] = [
        //     {
        //         color: client.config.botEmbedHex,
        //         title: `${language(guild, 'HELP_TITLE')}`,
        //         description: `${categories.join('\n')}`,
        //     }
        // ]

        // const t = new PageEmbed({
        //     pages: pages
        // })

        // await t.post(message)

        let options: any[] = [{
            label: 'Home',
            description: 'Overview over the categories',
            value: `${0}`,
            default: false,
            emoji: {
                name: "erlingcoinitem",
                id: "858325886637834240"
            }
        }]

        let embed = new EmbedBuilder({
            // type: "image",
            color: embedcolor,
            title: `${getEmoji("help")}${emojiCharacters.squareleft}${language(guild, 'HELP_TITLE')}${emojiCharacters.squareright}`,
            description: `${boticons(client, 'ticket')}${language(guild, 'HELP_TICKET')}\n[Invite](https://discord.gg/ysfgqV7QFM)`,
            footer: { text: `${client.config.prefix}help <cmd> to see more details - 0/${categories.length}` },
            fields: [{name: `__**Home - ${0}**__`, value: 'This page', inline: true}]
        })

        categories.map((f: any, i: any) => {
            embed.addFields({name: `__**${capitalizeFirstLetter(f)} - ${i + 1}**__`, value: `${language(guild, 'HELP_LIST')} ${f.name} commands`, inline: true})
            
            let option = {
                label: `${capitalizeFirstLetter(f)}`,
                value: `${i + 1}`,
                description: `${language(guild, 'HELP_LIST')} ${f} commands`,
                emoji: {
                    name: `${getEmoji("chevronright").name}`,
                    id: getEmoji("chevronright").id
                }
            }
            options.push(option)
            return option
        })

        const row = new ActionRowBuilder<SelectMenuBuilder>()
            .addComponents(
                new SelectMenuBuilder({
                    customId: 'Menu',
                    placeholder: "Select Category",
                    options: options,
                    maxValues: 1,
                    minValues: 1
                })
            )
        const rowbtn = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder({
                    customId: 'helpleft',
                    disabled: false,
                    label: "",
                    emoji: getEmoji("chevronleft"),
                    style: 1
                }),
                new ButtonBuilder({
                    customId: 'helpright',
                    disabled: false,
                    label: "",
                    emoji: getEmoji("chevronright"),
                    style: 1
                })
            )
        let msgembed = await channel.send({
            embeds: [embed], 
            components: [row, rowbtn]
        }).then((msg) => {
            let page: number = 0;
            const filter = (i: Interaction) => i.user.id === author.id;

            let collect = msg.createMessageComponentCollector({
                filter, 
                max: 1000,
                time: 60*1000
            });
            
            // Function for updating help embed as page changes
            const helpembed = (async (description: any, page: any, content: any) => {
                let embedMain = new EmbedBuilder()
                    .setTitle(`${await getEmoji("help")} ${await language(guild, 'HELP_TITLE')} - ${await capitalizeFirstLetter(description)}`)
                    .setColor(embedcolor)
                    .setFooter({ text: `${await language(guild, 'HELP_PAGE')} ${page}/${categories.length}`})
    
                    if (content) {
                        content.forEach((command: any) => {
                            embedMain.addFields({name: '> ' + command.name, value: `${command.description}`, inline: true})
                        });
                    }
                await msg.edit({ embeds: [embedMain] });
            })

            // Check for button interaction
            collect.on('collect', async (reaction: any) => {
                if (!reaction) return;
                if (reaction.message.partial) await reaction.message.fetch();
                if (reaction.partial) await reaction.fetch();
                if (!reaction.message.guild) return;
                if (reaction.message.id != msg.id) return
                reaction.deferUpdate();
                // If SelectMenu is used. Then jump directly to selected page
                if (reaction.isSelectMenu()) {

                    page = parseInt(reaction.values[0]);
                    if (page === 0) {
                        await msg.edit({ embeds: [embed] })
                    } else {
                        // let filteredCmds = await client.registry.commands.sweep(el => el.group.name !== categories[page - 1] && !member!.permissions.has(el!.UserPermissions || "SendMessages"));
                        let filteredCmds = client.registry.commands.filter(el => el.group.name == categories[page - 1])
                        helpembed(`${categories[page - 1]}`, page, filteredCmds)
                    }
                } else {


                    page = Number(page)
                    if (reaction.customId === 'helpleft') {
                        if (page == 0) {     
                            page = categories.length
                        } else {
                            page -= 1
                        }
                    } else if (reaction.customId === 'helpright') {
                        // Checks if page is at end of pages
                        if (page > categories.length - 1) {
                            page = 0
                        } else {
                            page += 1
                        }
                    }
                    
                    if (page == 0) {
                        await msg.edit({ embeds: [embed] });
                        return
                    } else {
                        // let filteredCmds: any = client.registry.commands.sweep(el => el.group.name !== categories[page - 1] && !member!.permissions.has(el!.UserPermissions || "SendMessages"));
                        let filteredCmds = client.registry.commands.filter(el => el.group.name == categories[page - 1])
                        helpembed(`${categories[page - 1]}`, page, filteredCmds)
                    }
                }
            })
        })
    }
}
