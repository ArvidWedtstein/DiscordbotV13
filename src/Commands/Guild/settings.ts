import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import settingsSchema from '../../schemas/settingsSchema';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, GuildEmoji } from 'discord.js';
import emojiCharacters from '../../Functions/emojiCharacters';
import icon from '../../Functions/icon';
import boticons from '../../Functions/boticons';

export const command: Command = {
    name: "settings",
    description: "settings",
    run: async(client, message, args) => {
        const { guild, channel, author, mentions } = message
        function capitalizeFirstLetter(string: string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        
        const guildId = guild?.id
        message.delete()
        let emojicharacters: any = emojiCharacters
        
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
        const settingicon = icon(client, guild, 'settings');
        const off = boticons(client, 'off');
        const on = boticons(client, 'on');
        const sign = boticons(client, 'sign');

        const settingsLangtxt = await language(guild, 'SETTINGS');

        let SettingsCategories: any = [];
        client.commands.forEach((cmd) => {
            SettingsCategories.push(cmd)
        })

        SettingsCategories = SettingsCategories.filter((v: any,i:any,a: any)=>a.findIndex((t: any)=>(t.group===v.group))===i)
        console.log(SettingsCategories)
        const SettingsList = []
        for (let i = 0; i < SettingsCategories.length; i++) {
            let str: any = `${i}-3`
            SettingsList.push({name: `${emojicharacters[str]} ${sign}`, value: `\`\`\`fix\n${SettingsCategories[i].group}\`\`\``})
        }

        

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

        let embed = new MessageEmbed()
            .setColor("FUCHSIA")
            .setTitle(`${emojiCharacters['archleft']}${capitalizeFirstLetter(await settingsLangtxt)}${emojiCharacters['archright']}`)
            .addFields(SettingsList)
            // .setDescription(`${settingicon} ${await language(guild, 'SETTINGS_DESC')}\n\n\n${msg}`)
            .setFooter({text: `${await language(guild, 'HELP_PAGE')} - ${page}/7`})
        let messageEmbed = await channel.send({embeds: [embed]})
 
        const left: any = icon(client, guild, 'chevronleft');
        const right: any = icon(client, guild, 'chevronright');
        if (!left || !right) return console.log('no emoji found');
        try {
			await messageEmbed.react(left);
            await messageEmbed.react(right);
		} catch (error) {
			console.error('One of the emojis failed to react:', error);
		}
        

        const updateEmbed = (async (color: any, category: string, emojis: any = [], toggleemoji: any, pageint: number) => {
            let embed2 = new Discord.MessageEmbed()
                .setColor(color)
                .setTitle(`${capitalizeFirstLetter(category)} system ${await language(guild, 'SETTINGS')} ${toggleemoji}`)
                .setDescription(`${await language(guild, 'SETTINGS_REACT')} ${capitalizeFirstLetter(category)} system\n__${desc[pageint]}__`)
                .setFooter({text: `${await language(guild, 'HELP_PAGE')} - ${pageint}/7`})
            let messageEmbeds = await messageEmbed.edit({embeds: [embed2]});
            
            //messageEmbed.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
            
            
            emojis.forEach(async (emoji: any) => {
                messageEmbed.react(emoji);
            })
        })

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
                const cats: any = {
                    emotes: result.emotes,
                    money: result.money,
                    ticket: result.ticket,
                    swearfilter: result.swearfilter,
                    moderation: result.moderation,
                    antijoin: result.antijoin,
                    welcome: result.welcome
                }
                // messageEmbed.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                await reaction.users.remove(user.id);
                // if (reaction.emoji.id == icons(guild, 'chevronleft')) {
                if (reaction.emoji.id == left) {
                    if (page == 0) {     
                        page = 7
                    } else {
                        page -= 1
                    }
                // } else if (reaction.emoji.id == icons(guild, 'chevronright')) {
                } else if (reaction.emoji.id == right) {
                    if (page == 7) {
                        page = 0
                    } else {
                        page += 1
                    }
                } else if (reaction.emoji.id == off) { // if setting got turned off
                    emojis = [left, right, on]
                    //emojis = [trueEmoji]
                    //await reaction.message.reactions.valueOf(off).delete()
                    //reaction.message.reactions.resolve(off).users.remove(this.client.id)
                    
                    await reaction.users.remove(user?.id);
                    if (page == 1) {
                        updateEmbed('#00ff00', 'Emote', emojis, off, page)
                        cats.emotes = false;
                    } else if (page == 2) {
                        updateEmbed("#ff0000", 'Economy', emojis, off, page)
                        cats.money = false;
                    } else if (page == 3) {
                        updateEmbed("#ff0000", 'Swearfilter', emojis, off, page)
                        cats.swearfilter = false;
                    } else if (page == 4) {
                        updateEmbed("#ff0000", 'Ticket', emojis, off, page)
                        cats.ticket = false;
                    } else if (page == 5) {
                        updateEmbed("#ff0000", 'Moderation', emojis, off, page)
                        cats.moderation = false;
                    } else if (page == 6) {
                        updateEmbed("#ff0000", 'Antijoin', emojis, off, page)
                        cats.antijoin = false
                    } else if (page == 7) {
                        updateEmbed("#ff0000", 'Welcome', emojis, off, page)
                        cats.welcome = false
                    } 
                    const resultfalse = await settingsSchema.findOneAndUpdate(
                        {
                            guildId,
                        }, {
                            guildId,
                            cats
                        }, {
                            upsert: true
                        }
                    )
                } else if (reaction.emoji.id == on) { // if setting got turned on
                    emojis = [left, right, off]
                    //emojis = [falseEmoji]
                    await reaction.users.remove(user?.id);
                    
                    if (page == 1) {
                        updateEmbed("#00ff00", 'Emote', emojis, on, page)
                        cats.emotes = true
                    } else if (page == 2) {
                        updateEmbed("#00ff00", 'Economy', emojis, on, page)
                        cats.money = true
                    } else if (page == 3) {
                        updateEmbed("#00ff00", 'Swearfilter', emojis, on, page)
                        cats.swearfilter = true
                    } else if (page == 4) {
                        updateEmbed("#00ff00", 'Ticket', emojis, on, page)
                        cats.ticket = true
                    } else if (page == 5) {
                        updateEmbed("#00ff00", 'Moderation', emojis, on, page)
                        cats.moderation = true
                    } else if (page == 6) {
                        updateEmbed("#00ff00", 'Antijoin', emojis, on, page)
                        cats.antijoin = true
                    } else if (page == 7) {
                        updateEmbed("#00ff00", 'Welcome', emojis, on, page)
                        cats.welcome = true
                    }
                    const resultfalse = await settingsSchema.findOneAndUpdate(
                        {
                            guildId,
                        }, {
                            guildId,
                            cats
                        }, {
                            upsert: true
                        }
                    )
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
                
                switch (page) { // Update embed for each page.
                    case 0:
                        await reaction.users.remove(user?.id);
                        embed = new Discord.MessageEmbed()
                            .setColor("#00ff00")
                            .setTitle(`${capitalizeFirstLetter(await language(guild, 'SETTINGS'))}`)
                            .setDescription(`${settingicon} ${await language(guild, 'SETTINGS_DESC')}\n\n\n${desc}`)
                            .setFooter({ text: `${await language(guild, 'HELP_PAGE')} - ${page}/7` })
                        await messageEmbed.edit({embeds: [embed]});
                        
                        // messageEmbed.react(left)
                        // messageEmbed.react(right)
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
                            emojis = [off]
                            updateEmbed("#00ff00", `${category}`, emojis, on, page)
                        } else if (categories[key] == false) {
                            // emojis = [icons(guild, 'chevronleft'), icons(guild, 'chevronright'), on]
                            emojis = [on]
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
