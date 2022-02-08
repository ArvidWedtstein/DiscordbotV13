import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import settingsSchema from '../../schemas/settingsSchema';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
export const command: Command = {
    name: "settings",
    description: "settings",
    run: async(client, message, args) => {
        const { guild } =  message
        function capitalizeFirstLetter(string: string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        
        const guildId = guild?.id
        message.delete()
        
        
        const desc: any = {
            1: `${await language(guild, 'EMOTE_SYSTEM')}`,
            2: `${await language(guild, 'ECONOMY_SYSTEM')}`,
            3: `${await language(guild, 'SWEARFILTER_SYSTEM')}`,
            4: `${await language(guild, 'TICKET_SYSTEM')}`,
            5: `${await language(guild, 'MODERATION_SYSTEM')}`,
            6: `${await language(guild, 'ANTIJOIN_SYSTEM')}`,
            7: `${await language(guild, 'WELCOME_SYSTEM')}`
        }
        let page = 0;
        // const settingicon = icons(guild, 'settings');
        const settingicon = "🤣";
        // const off = boticons(this.client, 'off');
        const off = "🤣";
        // const on = boticons(this.client, 'on');
        const on = "🤣";
        // const sign = boticons(this.client, 'sign')
        const sign = "🤣"
        // let msg = `${emojicharacters['0-3']} ${sign} This page\n
        // ${emojicharacters['1-3']} ${sign} Emote ${language(guild, 'SETTINGS')}\n
        // ${emojicharacters['2-3']} ${sign} Economy ${language(guild, 'SETTINGS')}\n
        // ${emojicharacters['3-3']} ${sign} Swearfilter ${language(guild, 'SETTINGS')}\n
        // ${emojicharacters['4-3']} ${sign} Ticket ${language(guild, 'SETTINGS')}\n
        // ${emojicharacters['5-3']} ${sign} Moderation ${language(guild, 'SETTINGS')}\n
        // ${emojicharacters['6-3']} ${sign} Antijoin ${language(guild, 'SETTINGS')}\n
        // ${emojicharacters['7-3']} ${sign} Welcome Message ${language(guild, 'SETTINGS')}`
        let msg = `🤣 ${sign} This page\n
        🤣 ${sign} Emote ${await language(guild, 'SETTINGS')}\n
        🤣 ${sign} Economy ${await language(guild, 'SETTINGS')}\n
        🤣 ${sign} Swearfilter ${await language(guild, 'SETTINGS')}\n
        🤣 ${sign} Ticket ${await language(guild, 'SETTINGS')}\n
        🤣 ${sign} Moderation ${await language(guild, 'SETTINGS')}\n
        🤣 ${sign} Antijoin ${await language(guild, 'SETTINGS')}\n
        🤣 ${sign} Welcome Message ${await language(guild, 'SETTINGS')}`

        /*const offbutton = new MessageButton()
            .setStyle('red')
            .setLabel('Off')
            .setEmoji(`${off.id}`)
            .setID('off')
        const onbutton = new MessageButton()
            .setStyle('green')
            .setLabel('On')
            .setEmoji(`${on.id}`)
            .setID('on')*/
        let embed2: any = {
            type: 'rich',
            title: "test"
        }
        let embed = new Discord.MessageEmbed()
            .setColor("FUCHSIA")
            .setTitle(`${capitalizeFirstLetter(await language(guild, 'SETTINGS'))}`)
            .setDescription(`${settingicon} ${await language(guild, 'SETTINGS_DESC')}\n\n\n${msg}`)
            .setFooter(`${await language(guild, 'HELP_PAGE')} - ${page}/7`)
        let messageEmbed = await message.channel.send({embeds: [embed]});
        await message.channel.send({embeds: [embed2]})
        messageEmbed.react('🤣');
        messageEmbed.react('😁');
        /*for (let i = 0; i < 6; i++) {
            messageEmbed.react(nmb[i])
        }*/
        async function updateEmbed(color: any, category: string, emojis: any = [], toggleemoji: any, pageint: number) {
            let embed2 = new Discord.MessageEmbed()
                .setColor(color)
                .setTitle(`${capitalizeFirstLetter(category)} system ${await language(guild, 'SETTINGS')} ${toggleemoji}`)
                .setDescription(`${await language(guild, 'SETTINGS_REACT')} ${capitalizeFirstLetter(category)} system\n__${desc[pageint]}__`)
                .setFooter(`${await language(guild, 'HELP_PAGE')} - ${pageint}/7`)
            let messageEmbeds = await messageEmbed.edit({embeds: [embed2]});
            
            //messageEmbed.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
            
            
            for (let i = 0; i < emojis.length; i++) {
                messageEmbed.react(emojis[i]);
            }
        }

        client.on('messageReactionAdd', async (reaction: any, user: any) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;
            if (user != message.author) {
                await reaction.users.remove(user.id);
                return
            }
            let emojis = []
            if (reaction.message.channel.id == message.channel.id) {
                if (reaction.message.id != messageEmbed.id) return
                let result = await settingsSchema.findOne({
                    guildId
                })

                if (!result) {
                    //console.log('new settings schema')
                    result = await new settingsSchema({
                        guildId
                    }).save()

                    return
                }
                messageEmbed.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                // if (reaction.emoji.id == icons(guild, 'chevronleft')) {
                if (reaction.emoji.id == '🤣') {
                    if (page == 0) {     
                        page = 7
                    } else {
                        page -= 1
                    }
                // } else if (reaction.emoji.id == icons(guild, 'chevronright')) {
                } else if (reaction.emoji.id == '😁') {
                    if (page == 7) {
                        page = 0
                    } else {
                        page += 1
                    }
                } else if (reaction.emoji.id == off) {
                    emojis = ['🤣', '😁', on]
                    //emojis = [trueEmoji]
                    //await reaction.message.reactions.valueOf(off).delete()
                    //reaction.message.reactions.resolve(off).users.remove(this.client.id)
                    
                    await reaction.users.remove(client.user?.id);
                    if (page == 1) {
                        updateEmbed('#00ff00', 'Emote', emojis, off, page)
                        const resultfalse = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    emotes: false
                                }
                            }, {
                                upsert: true
                            }
                        )
                    } else if (page == 2) {
                        updateEmbed("#ff0000", 'Economy', emojis, off, page)
                        const resultfalse = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    money: false
                                }
                            }, {
                                upsert: true
                            }
                        )
                    } else if (page == 3) {
                        updateEmbed("#ff0000", 'Swearfilter', emojis, off, page)
                        const resultfalse = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    swearfilter: false
                                }
                            }, {
                                upsert: true
                            }
                        )
                    } else if (page == 4) {
                        updateEmbed("#ff0000", 'Ticket', emojis, off, page)
                        const resultfalse = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    ticket: false
                                }
                            }, {
                                upsert: true
                            }
                        )
                    } else if (page == 5) {
                        updateEmbed("#ff0000", 'Moderation', emojis, off, page)
                        const resultfalse = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    moderation: false
                                }
                            }, {
                                upsert: true
                            }
                        )
                    } else if (page == 6) {
                        updateEmbed("#ff0000", 'Antijoin', emojis, off, page)
                        const resultfalse = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    antijoin: false
                                }
                            }, {
                                upsert: true
                            }
                        )
                    } else if (page == 7) {
                        updateEmbed("#ff0000", 'Welcome', emojis, off, page)
                        const resultfalse = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    welcome: false
                                }
                            }, {
                                upsert: true
                            }
                        )
                    }
                } else if (reaction.emoji.id == on) {
                    emojis = ['🤣', '😁', off]
                    //emojis = [falseEmoji]
                    await reaction.users.remove(client.user?.id);
                    
                    if (page == 1) {
                        updateEmbed("#00ff00", 'Emote', emojis, on, page)
                        const resulttrue = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    emotes: true
                                }
                            }, {
                                upsert: true
                            }
                        )
                    } else if (page == 2) {
                        updateEmbed("#00ff00", 'Economy', emojis, on, page)
                        const resulttrue = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    money: true
                                }
                            }, {
                                upsert: true
                            }
                        )
                    } else if (page == 3) {
                        updateEmbed("#00ff00", 'Swearfilter', emojis, on, page)
                        const resulttrue = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    swearfilter: true
                                }
                            }, {
                                upsert: true
                            }
                        )
                    } else if (page == 4) {
                        updateEmbed("#00ff00", 'Ticket', emojis, on, page)
                        const resulttrue = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    ticket: true
                                }
                            }, {
                                upsert: true
                            }
                        )
                    } else if (page == 5) {
                        updateEmbed("#00ff00", 'Moderation', emojis, on, page)
                        const resulttrue = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    moderation: true
                                }
                            }, {
                                upsert: true
                            }
                        )
                    } else if (page == 6) {
                        updateEmbed("#00ff00", 'Antijoin', emojis, on, page)
                        const resulttrue = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    antijoin: true
                                }
                            }, {
                                upsert: true
                            }
                        )
                    } else if (page == 7) {
                        updateEmbed("#00ff00", 'Welcome', emojis, on, page)
                        const resulttrue = await settingsSchema.findOneAndUpdate(
                            {
                                guildId,
                            }, {
                                guildId,
                                $set: { 
                                    welcome: true
                                }
                            }, {
                                upsert: true
                            }
                        )
                    }
                }
                result = await settingsSchema.findOne({
                    guildId
                })
                const categories: any = {
                    moderation: result.moderation,
                    ticket: result.ticket,
                    swearfilter: result.swearfilter,
                    emotes: result.emotes,
                    money: result.money,
                    currency: result.currency,
                    antijoin: result.antijoin,
                    welcome: result.welcome
                }
                let category = ''
                
                switch (page) {
                    case 0:
                        messageEmbed.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                        embed = new Discord.MessageEmbed()
                            .setColor("#00ff00")
                            .setTitle(`${capitalizeFirstLetter(await language(guild, 'SETTINGS'))}`)
                            .setDescription(`${settingicon} ${await language(guild, 'SETTINGS_DESC')}\n\n\n${msg}`)
                            .setFooter(`${await language(guild, 'HELP_PAGE')} - ${page}/7`)
                        await messageEmbed.edit({embeds: [embed]});
                        
                        messageEmbed.react('🤣')
                        messageEmbed.react('😁')
                        //await reaction.users.remove(user.id);
                        //reaction.message.reactions.valueOf(2).delete()
                        break;
                    case 1:
                        category = 'emotes'
                        break;
                    case 2:
                        category = 'money'
                        break;
                    case 3:
                        category = 'swearfilter'
                        break;
                    case 4:
                        category = 'ticket'
                        break;
                    case 5:
                        category = 'moderation'
                        break;
                    case 6:
                        category = 'antijoin'
                        break;
                    case 7:
                        category = 'welcome'
                        break;
                }
                for (const key in categories) {
                    if (category == key) {
                        if (categories[key] == true) {
                            // emojis = [icons(guild, 'chevronleft'), icons(guild, 'chevronright'), off]
                            emojis = ['🤣', '😁', off]
                            updateEmbed("#00ff00", `${category}`, emojis, on, page)
                        } else if (categories[key] == false) {
                            // emojis = [icons(guild, 'chevronleft'), icons(guild, 'chevronright'), on]
                            emojis = ['🤣', '😁', on]
                            updateEmbed("#ff0000", `${category}`, emojis, off, page)
                        }
                        await reaction.users.remove(user.id);
                    }
                }
                return
            } else {
                return;
            }
        });
    }
}
