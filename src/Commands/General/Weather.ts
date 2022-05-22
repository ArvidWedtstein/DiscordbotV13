import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, GuildMember, EmbedFieldData, MessageAttachment } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import axios from 'axios';
import { PageEmbed, PageEmbedOptions } from 'Functions/PageEmbed'
export const command: Command = {
    name: "weather",
    description: "get the weather for a city",
    details: "get the weather for a city",
    aliases: ["været"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["weather {city}"],
    run: async(client, message, args) => {
        const { guild, mentions, author, member, channel, attachments } = message;

        if (!guild) return
        
        let city = args[0];
        
        if (!city) return temporaryMessage(channel, "Please provide a city", 10)

        // TODO - Implement PageEmbed to show the weather for the next 2 days and add icons for the weather
        // TODO - Replace this inaccurate API with this:
        // Use this api to get the lat and longitude for the city: https://openweathermap.org/api/geocoding-api / http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=
        // Use then the Yr.no api to get the weather for the lat and longitude: https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=51.5&lon=0
        try {
            axios.get(`https://goweather.herokuapp.com/weather/${city.toLowerCase()}`).then(async res => {

                const pages: PageEmbedOptions[] = [
                    {
                        color: client.config.botEmbedHex,
                        title: `All Legends`,
                        description: [
                            `**Legend Name**\n`,
                        ].join('\n'),
                        timestamp: new Date(),
                    },
        
                ]
                const embed = new MessageEmbed({
                    color: 0x03a9f4,
                    title: `Weather in ${city}`,
                    fields: [
                        { 
                            name: `🌡 Temperature:`,
                            value: `**${res.data.temperature}**`,
                            inline: true
                        }, 
                        {
                            name: `🍃 Wind:`,
                            value: `**${res.data.wind}**`,
                            inline: true
                        }
                    ],
                    footer: {
                        text: `Requested by ${author.tag}`,
                        icon_url: author.displayAvatarURL()
                    }
                })

                channel.send({ embeds: [embed] })
            }).catch(err => {
                console.log(err)
                return temporaryMessage(channel, "Could not find the city", 10)
            })
        } catch (err) {
            console.log(err)
        }
    }
}


