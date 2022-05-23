import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, GuildMember, EmbedFieldData, MessageAttachment } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import axios from 'axios';
import { readFile } from 'fs/promises'
import { PageEmbed, PageEmbedOptions } from 'Functions/PageEmbed'
import Canvas, { createCanvas, Image } from '@napi-rs/canvas';
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
        // Haugesund: https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=59.4138214&lon=5.2680735
        try {
            let { data: geodata } = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city.toLowerCase()}&limit=5&appid=${process.env.OPENWEATHER_API_KEY}`).then(res => {
                return res
            })

            const { name, local_names, lat, lon, country } = geodata[0]
            let { data: weatherdata } = await axios.get(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"
                }
            })
            const { timeseries, meta } = weatherdata.properties;

            const canvas = createCanvas(800, 600);
            const ctx = canvas.getContext('2d')

            ctx.fillStyle = '#01B0F1';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = '40px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`Weather in ${city}`, 10, 40);
            ctx.font = '30px sans-serif';

            let startPosY = 140

            // Titles
            ctx.fillText(`Tid`, 10, startPosY - 40);
            ctx.fillText(`Temp.`, 80, startPosY - 40);
            ctx.fillText(`Nedbør`, 200, startPosY - 40);
            const weatherlist: any = []
            timeseries.every((hour: any, i: any) => {
                const { time, data: hourdata } = hour;
                const { instant, next_12_hours, next_1_hours, next_6_hours } = hourdata;
                const { 
                    air_temperature, 
                    air_pressure_at_sea_level, 
                    cloud_area_fraction,
                    relative_humidity,
                    wind_from_direction,
                    wind_speed
                } = instant.details
                const { 
                    summary,
                    details
                } = next_1_hours
                // Calculate the wind_from_direction degrees to cardinal direction
                const wind_from_direction_cardinal = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
                const wind_from_direction_index = Math.round(wind_from_direction / 22.5)
                const wind_from_cardinal_direction = wind_from_direction_cardinal[wind_from_direction_index]
                let d = new Date(time).getDate()
                if (d === new Date().getDate() + 1) return false;

                weatherlist.push(`**${moment(time).format("HH")}** - ${air_temperature}°C - ${relative_humidity}% - ${wind_from_cardinal_direction} - ${wind_speed} m/s`)
                
                // Row
                
                ctx.fillText(`${moment(time).format("HH")}`, 10, startPosY + (i * 40));
                ctx.fillText(`${air_temperature}°C`, 80, startPosY + (i * 40));
                ctx.fillText(`${details.precipitation_amount}mm`, 200, startPosY + (i * 40));

                ctx.beginPath()
                ctx.moveTo(10, startPosY + (i * 40)+10);
                ctx.lineTo(300, startPosY + (i * 40)+10);
                ctx.closePath()
                ctx.stroke();

                return true;
            })

            // Pass the entire Canvas object because you'll need access to its width and context
            const applyText = (canvas: any, text: any) => {
                const context = canvas.getContext('2d');

                // Declare a base size of the font
                let fontSize = 70;

                do {
                    // Assign the font to the context and decrement it so it can be measured again
                    context.font = `${fontSize -= 10}px sans-serif`;
                    // Compare pixel width of the text to the canvas minus the approximate avatar size
                } while (context.measureText(text).width > canvas.width - 300);

                // Return the result to use in the actual canvas
                return context.font;
            };
    
            

            const attachment = new MessageAttachment(canvas.toBuffer('image/png'), 'profile-image.png');
            const embed = new MessageEmbed({
                color: 0x03a9f4,
                title: `Weather in ${city}`,
                description: weatherlist.join('\n'),
                // fields: [
                //     { 
                //         name: `🌡 Temperature:`,
                //         value: `**${res.data.temperature}**`,
                //         inline: true
                //     }, 
                //     {
                //         name: `🍃 Wind:`,
                //         value: `**${res.data.wind}**`,
                //         inline: true
                //     }
                // ],
                footer: {
                    text: `Requested by ${author.tag}`,
                    icon_url: author.displayAvatarURL()
                }
            })

            channel.send({ embeds: [embed], files: [attachment] })
        } catch (err) {
            console.log(err)
        }
    }
}


