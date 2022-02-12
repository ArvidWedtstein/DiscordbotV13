import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import icon from '../../Functions/icon';
import boticons from '../../Functions/boticons';
import emojiCharacters from '../../Functions/emojiCharacters';
export const command: Command = {
    name: "help",
    description: "get some help",
    aliases: ["heeeeeeeeeelp"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["help"],
    
    run: async(client, message, args) => {
        const cmd: any = []
        const cmddetails: any = []
        const cmddescription: any = []
        const cmdexamples = [];
        const { guild, author, channel, member } = message
        const guildId = guild?.id
        const userId = author.id;


        const getEmoji = (emojiName: any) => {
            return icon(client, guild, emojiName)
        }
        let color = await getColor(guildId, userId);

        // if user specified a specific command
        if (args[0]) {
            client.commands.forEach((c) => {
                if (!c.hidden) {
                    cmd.push({ 
                        name: c.name, 
                        description: c.description,
                        examples: c.examples
                    });
                }
            })
            if (!cmd.find((cd: any) => cd.name === args[0])) return
            let embed = new MessageEmbed()
                .setTitle(`${getEmoji("help")} ${language(guild, 'HELP_TITLE')} - ${cmd[cmd.indexOf(args[0])]}`)
                if (!cmddetails[cmd.indexOf(args[0])]) {
                    embed.setDescription(`${cmddescription[cmd.indexOf(args[0])]}`)
                } else {
                    embed.setDescription(`${cmddetails[cmd.indexOf(args[0])]}`)
                }
                
            let messageEmbed = channel.send({ embeds: [embed] });
            return
        }
        const emptyarray = (arr: any) => arr.length = 0;
        
    


      
        const categorie: any = []
        client.commands.forEach((cmd) => {
            categorie.push(cmd.group);
        })
        function capitalizeFirstLetter(string: any) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        //const ticket = this.client.registry.findCommands('ticket')
        const remove = ['test', 'prefix']
        const categories = categorie.filter((item: any) => !remove.includes(item)).sort()
        //const getEmoji = emojiName => this.client.emojis.cache.find((emoji) => emoji.id === emojiName)
        const options = []
        let catoption = {
            label: 'Home',
            description: 'Overview over the categories',
            value: 'help_home',
        }
        options.push(catoption)
        let embed = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle(`${getEmoji("help")} ${emojiCharacters.squareleft}${language(guild, 'HELP_TITLE')}${emojiCharacters.squareright}`)
            .setDescription(`${boticons(client, 'ticket')}${language(guild, 'HELP_TICKET')}\n[Invite](https://discord.com/api/oauth2/authorize?client_id=787324889634963486&permissions=0&redirect_uri=https%3A%2F%2Fdiscordapp.com%2Foauth2%2Fauthorize%3F%26client_id%3D787324889634963486%26scope%3Dbot&response_type=code&scope=identify%20email%20connections%20guilds%20guilds.join%20gdm.join%20rpc%20rpc.notifications.read%20applications.builds.upload%20messages.read%20webhook.incoming%20bot%20rpc.activities.write%20rpc.voice.write%20rpc.voice.read%20applications.builds.read%20applications.commands%20applications.store.update%20applications.entitlements%20activities.read%20activities.write%20relationships.read)`)
            .setFooter({ text: `${language(guild, 'HELP_PAGE')} - 0/${categories.length}` })
            .addFields(
                {name: '__**' + 0 + '**__', value: 'This page', inline: true},
            )
            for (let i = 0; i < categories.length; i++) {
                let roleoption = {
                    label: capitalizeFirstLetter(categories[i]),
                    value: `help_${i + 1}`,
                    description: `${language(guild, 'HELP_LIST')} ${categories[i]} commands`
                }
                options.push(roleoption)
                embed.addField('__**' + `${capitalizeFirstLetter(categories[i])}` + ` - ${i + 1}` + '**__', `${language(guild, 'HELP_LIST')} ${categories[i]} commands`, true)
            }
        //let messageEmbed = await channel.send(embed);
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                .setCustomId('Menu')
                .setPlaceholder('Select Category')
                .addOptions(options)
                .setMaxValues(1)
                .setMinValues(1)
            )
        

        let messageEmbed = await channel.send({
            //buttons: [prev, next], 
            components: [row],
            embeds: [embed] 
        });
        async function helpembed (title: any, description: any, page: any, contentname: any, contentvalue: any, contentalias: any, contentexample?: any) {
            let embedMain = new Discord.MessageEmbed()
                .setTitle(`${getEmoji("help")} ${title} - ${capitalizeFirstLetter(description)}`)
                .setColor(color)
                .setFooter({ text: `${language(guild, 'HELP_PAGE')} ${page}/${categories.length}`})
            
                for (let i = 0; i < contentname.length; i++) {
                    //embedMain.addField('> ' + contentname[i], `${contentvalue[i]} ${contentexample[i]}`, true)
                    embedMain.addField('> ' + contentname[i], `${contentvalue[i]}`, true)
                }
                //embedMain.setDescription(`${cmds}`)
            await messageEmbed.edit({ embeds: [embedMain] });
        }
        let page: number = 0;
        client.on('clickButton', async (btn) => {
            if (btn.id == 1) {
                if (page == 0) {     
                    page = categories.length
                } else {
                    page -= 1
                }
            } else if (btn.id == 2) {
                if (page > categories.length - 1) {
                    page = 0
                } else {
                    page += 1
                }
            }
            if (page === 0) {
                let embed2 = new Discord.MessageEmbed()
                .setColor(color)
                .setTitle(`${getEmoji("help")} ${language(guild, 'HELP_TITLE')}`)
                .setDescription(`${language(guild, 'HELP_TICKET')}`)
                .setFooter(`${language(guild, 'HELP_PAGE')} 0/${categories.length}`)
                .addFields(
                    {name: `${0}`, value: 'This page'},
                )
                for (let i = 0; i < categories.length; i++) {
                    embed.addField(`${i + 1}`, `${language(guild, 'HELP_LIST')} ${categories[i]} commands`)
                }
                await messageEmbed.edit({ embeds: [embed2] });
            } else {
                emptyarray(contentname);
                emptyarray(contentvalue);
                emptyarray(contentalias);
                client.commands.forEach((e) => {
                    if (e.name === categories[page - 1]) {
                        let requiredperms: any = e.UserPermissions;
                        if (e.ownerOnly) return;
                        if (e.UserPermissions) {
                            if (member?.permissions.has(requiredperms)) {
                                contentname.push(e.name)
                                contentvalue.push(e.description)
                                contentalias.push(e.aliases)
                            }
                        } else {
                            contentname.push(e.name)
                            contentvalue.push(e.description)
                            contentalias.push(e.aliases)
                        }
                        helpembed(language(guild, 'HELP_TITLE'), `${categories[page - 1]}`, page, contentname, contentvalue, contentalias)
                    }
                })
            }
        })

        client.on("interactionCreate", async (m) => {
            if (!m.isSelectMenu()) return;
            //m.reply.defer();
            page = parseInt(m.values[0]);
            // console.log(page)
            if (page == 0) {
                // console.log('home page')
                let embedhom = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(`${getEmoji("help")} ${emojiCharacters.squareleft}${language(guild, 'HELP_TITLE')}${emojiCharacters.squareright}`)
                    .setDescription(`${language(guild, 'HELP_TICKET')} `)
                    .setFooter({ text: `${language(guild, 'HELP_PAGE')} - 0/${categories.length}` })
                    .addFields(
                        {name: '__**' + 0 + 'Home' + '**__', value: 'This page', inline: true},
                    )
                    for (let i = 0; i < categories.length; i++) {
                        embedhom.addField('__**' + `${capitalizeFirstLetter(categories[i])}` + ` - ${i + 1}` + '**__', `${language(guild, 'HELP_LIST')} ${categories[i]} commands`, true)
                    }

                await messageEmbed.edit({ embeds: [embedhom]})
                
            } else {
                emptyarray(contentname);
                emptyarray(contentvalue);
                emptyarray(contentalias);
                emptyarray(contentexample);
                // client.registry.groups.forEach((e) => {
                //     if (e.id === categories[page - 1]) {
                //         e.commands.forEach((c) => {
                //             let requiredperms = c.userPermissions;
                //             if (c.ownerOnly) {
                //                 return;
                //             }
                //             if (c.userPermissions) {

                //                 //console.log(message.member.user.username, requiredperms, message.member.permissions.has(requiredperms))
                //                 if (m.clicker.member.permissions.has(requiredperms)) {
                //                     if (!c.hidden) {
                //                         contentname.push(c.name)
                //                         contentvalue.push(c.description)
                //                         contentalias.push(c.aliases)
                //                         contentexample.push(c.examples);
                //                     }
                //                 }
                //             }
                //         })
                //         helpembed(language(guild, 'HELP_TITLE'), `${categories[page - 1]}`, page, contentname, contentvalue, contentalias, contentexample)
                //     }
                // })
            }
        })
        messageEmbed.react(getEmoji('chevronleft'));
        messageEmbed.react(getEmoji('chevronright'));
        let contentname: any = []
        let contentvalue: any = []
        let contentalias: any = []
        let contentexample: any = []
        
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
                    emptyarray(contentname);
                    emptyarray(contentvalue);
                    emptyarray(contentalias);
                    emptyarray(contentexample);
                    let embed2 = new Discord.MessageEmbed()
                        .setColor(color)
                        .setTitle(`${getEmoji("help")} ${emojiCharacters.squareleft}${language(guild, 'HELP_TITLE')}${emojiCharacters.squareright}`)
                        .setDescription(`${language(guild, 'HELP_TICKET')}`)
                        .setFooter({ text: `${language(guild, 'HELP_PAGE')} - ${page}/${categories.length}` })
                        .addFields(
                            {name: '__**' + 0 + '**__', value: 'This page', inline: true},
                        )
                        for (let i = 0; i < categories.length; i++) {
                            embed2.addField('__**' + `${capitalizeFirstLetter(categories[i])}` + ` - ${i + 1}` + '**__', `${language(guild, 'HELP_LIST')} ${categories[i]} commands`, true)
                        }
                    await messageEmbed.edit({ embeds: [embed2] });
                    return
                } else {
                    emptyarray(contentname);
                    emptyarray(contentvalue);
                    emptyarray(contentalias);
                    emptyarray(contentexample);
                    client.commands.forEach((e) => {
                        if (e.name === categories[page - 1]) {
                            let requiredperms: any = e.UserPermissions;
                            if (e.ownerOnly) return;
                            if (e.UserPermissions) {
                                if (member?.permissions.has(requiredperms)) {
                                    contentname.push(e.name)
                                    contentvalue.push(e.description)
                                    contentalias.push(e.aliases)
                                }
                            } else {
                                contentname.push(e.name)
                                contentvalue.push(e.description)
                                contentalias.push(e.aliases)
                            }
                            helpembed(language(guild, 'HELP_TITLE'), `${categories[page - 1]}`, page, contentname, contentvalue, contentalias)
                        }
                    })
                }
                await reaction.users.remove(user.id);
                return
            } else {
                return;
            }
        });
    }
}