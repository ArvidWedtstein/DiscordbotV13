import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, MessageSelectMenuOptions, MessageSelectOption, MessageSelectOptionData } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import icon from '../../Functions/icon';
import boticons from '../../Functions/boticons';
import emojiCharacters from '../../Functions/emojiCharacters';
import { APISelectMenuOption } from 'discord.js/node_modules/discord-api-types';
export const command: Command = {
    name: "help",
    description: "get some help",
    aliases: ["heeeeeeeeeelp"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["help <cmd>"],
    
    run: async(client, message, args) => {
        const cmd: any = []
        const { guild, author, channel, member } = message
        const guildId = guild?.id
        const userId = author.id;


        const getEmoji = (emojiName: any) => {
            return icon(client, guild, emojiName)
        }
        let embedcolor: any = await getColor(guildId, userId);

        // Get commands
        client.registry.commands.forEach((c) => {
            cmd.push(c);
        })
        // if user specified a specific command
        if (args[0]) {
            let chosencmd = cmd.find((c: any) => c.name === args[0])
            if (!chosencmd) return temporaryMessage(channel, `command could not be found`, 5);
            let embed = new MessageEmbed({
                title: `${getEmoji("help")} ${await language(guild, 'HELP_TITLE')} - ${chosencmd.name}`,
                description: `${chosencmd.details ? chosencmd.details : chosencmd.description}`,
                fields: [
                    {name: `**Usage**`, value: `\`${chosencmd.name}\``},
                    {name: `**Aliases**`, value: `\`${chosencmd.aliases ? chosencmd.aliases : 'None'}\``},
                    {name: `**Permissions Needed**`, value: `\`${chosencmd.UserPermissions ? chosencmd.UserPermissions : 'None'}\``}
                ]
            })
            let messageEmbed = channel.send({ embeds: [embed] });
            return
        }

        function capitalizeFirstLetter(string: String) {
            return string.toString().charAt(0).toUpperCase() + string.toString().slice(1);
        }

        /* Function for removing duplicate groups in categories */
        const removeDuplicates = (async (originalArray: any, prop: any) => {
            var newArray: any = [];
            var lookupObject:any = {};
       
            for (var i in originalArray) {
               lookupObject[originalArray[i][prop]] = originalArray[i];
            }
            
            for (i in lookupObject) {
                newArray.push(lookupObject[i].group);
            }
            console.log(newArray)
            return newArray;
        })
        const categories: any = await removeDuplicates(cmd, 'group');
        const options: any[] = [{
            label: 'Home',
            description: 'Overview over the categories',
            value: `${0}`,
            default: false,
            emoji: {
                name: "erlingcoinitem",
                id: "858325886637834240"
            }
        }]
        let embed = new MessageEmbed({
            color: embedcolor,
            title: `${getEmoji("help")}${emojiCharacters.squareleft}${await language(guild, 'HELP_TITLE')}${emojiCharacters.squareright}`,
            description: `${boticons(client, 'ticket')}${await language(guild, 'HELP_TICKET')}\n[Invite](https://discord.com/api/oauth2/authorize?client_id=787324889634963486&permissions=0&redirect_uri=https%3A%2F%2Fdiscordapp.com%2Foauth2%2Fauthorize%3F%26client_id%3D787324889634963486%26scope%3Dbot&response_type=code&scope=identify%20email%20connections%20guilds%20guilds.join%20gdm.join%20rpc%20rpc.notifications.read%20applications.builds.upload%20messages.read%20webhook.incoming%20bot%20rpc.activities.write%20rpc.voice.write%20rpc.voice.read%20applications.builds.read%20applications.commands%20applications.store.update%20applications.entitlements%20activities.read%20activities.write%20relationships.read)`,
            footer: { text: `-help <cmd> to see more details - 0/${categories.length}` },
            fields: [{name: `__**Home - ${0}**__`, value: 'This page', inline: true}]
        })
        for (let i = 0; i < categories.length; i++) {
            let roleoption: any = {
                label: `${await capitalizeFirstLetter(categories[i])}`,
                value: `${i + 1}`,
                description: `${await language(guild, 'HELP_LIST')} ${categories[i]} commands`,
                emoji: {
                    name: `${getEmoji("chevronright").name}`,
                    id: getEmoji("chevronright").id
                }
            }
            options.push(roleoption)
            embed.addField(`__**${capitalizeFirstLetter(categories[i])} - ${i + 1}**__`, `${await language(guild, 'HELP_LIST')} ${categories[i]} commands`, true)
        }
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu({
                    customId: 'Menu',
                    placeholder: "Select Category",
                    options: options,
                    maxValues: 1,
                    minValues: 1
                })
            )
    
        let messageEmbed = await channel.send({
            //buttons: [prev, next], 
            components: [row],
            embeds: [embed] 
        });
        const helpembed = (async (description: any, page: any, content: any) => {
            let embedMain = new MessageEmbed()
                .setTitle(`${await getEmoji("help")} ${await language(guild, 'HELP_TITLE')} - ${await capitalizeFirstLetter(description)}`)
                .setColor(embedcolor)
                .setFooter({ text: `${await language(guild, 'HELP_PAGE')} ${page}/${categories.length}`})

                content.forEach((command: any) => {
                    embedMain.addField('> ' + command.name, `${command.description}`, true)
                });
            await messageEmbed.edit({ embeds: [embedMain] });
        })

        
        let page: number = 0;

        client.on("interactionCreate", async (m) => {
            if (!m.isSelectMenu()) return;
            m.deferUpdate();
            page = parseInt(m.values[0]);
            if (page === 0) {
                await messageEmbed.edit({ embeds: [embed]})
            } else {
                var filteredCmds = cmd.filter(function (el: any) {
                    return el.group === categories[page - 1] && member?.permissions.has(el.UserPermissions);
                });
                helpembed(`${categories[page - 1]}`, page, filteredCmds)
            }
        })
        messageEmbed.react(getEmoji('chevronleft'));
        messageEmbed.react(getEmoji('chevronright'));

        client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;
            if (reaction.message.id != messageEmbed.id) return
            if (reaction.message.channel.id == message.channel.id) {
                await reaction.users.remove(user.id);
                page = Number(page)
                if (reaction.emoji == getEmoji('chevronleft')) {
                    if (page == 0) {     
                        page = categories.length
                    } else {
                        page -= 1
                    }
                } else if (reaction.emoji == getEmoji('chevronright')) {
                    if (page > categories.length - 1) {
                        page = 0
                    } else {
                        page += 1
                    }
                }
                
                if (page == 0) {
                    await messageEmbed.edit({ embeds: [embed] });
                    return
                } else {
                    var filteredCmds = cmd.filter(function (el: any) {
                        return el.group === categories[page - 1] && member?.permissions.has(el.UserPermissions);
                    });
                    helpembed(`${categories[page - 1]}`, page, filteredCmds)
                }
                await reaction.users.remove(user.id);
                return
            } else {
                return;
            }
        });
    }
}