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
import { PageEmbed, PageEmbedOptions } from '../../Functions/PageEmbed'
import { CustomCanvas } from '../../Functions/Canvas'
import Canvas, { createCanvas, Image } from '@napi-rs/canvas';
import { read } from 'fs';
import sharp from 'sharp';
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


        function addHours(numOfHours: number, date = new Date()) {
            const dateCopy = new Date(date.getTime());
          
            dateCopy.setTime(dateCopy.getTime() + numOfHours * 60 * 60 * 1000);
          
            return dateCopy;
        }

        function calculateWindDirection(degrees: number): string {
            const wind_from_direction_cardinal = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
            const wind_from_cardinal_direction = wind_from_direction_cardinal[Math.round(degrees / 45)]
            return wind_from_cardinal_direction
        }
        
        
        // Haugesund: https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=59.4138214&lon=5.2680735
        try {
            let { data: geodata } = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city.toLowerCase()}&limit=5&appid=${process.env.OPENWEATHER_API_KEY}`).then(res => {
                return res
            })

            const { name, local_names, lat, lon, country } = geodata[0]

            let { data: weatherdata } = await axios.get(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`, {
                headers: {
                    "User-Agent": "Discordbot"
                }
            })

            

            const { timeseries, meta } = weatherdata.properties;

            

            // Filter timeseries to only show the weather for today
            let filteredTimeseries = timeseries.filter((d: any) => {var time = new Date(d.time); return (moment(time).isBefore(moment().endOf('day')) && moment(time).isAfter(moment().startOf('day')))});
            let filteredTimeseriesTomorrow = timeseries.filter((d: any) => {var time = new Date(d.time); return (moment(time).isAfter(moment().add(1, 'days').startOf('day')) && moment(time).isBefore(moment().add(1, 'days').endOf('day')))});

            filteredTimeseriesTomorrow.splice(0,1)

            let startPosY = 140

            const customcanvas = new CustomCanvas(800, 750)
            customcanvas.rect(0, 0, 800, 750, '#01B0F1')
            customcanvas.text(`${name}`, 10, 40, '#FFFFFF', '40px sans-serif')

            
            let rows: any = []
            // customcanvas.text(`Time`, 10, startPosY - 40);
            // customcanvas.text(`Temp.`, 80, startPosY - 40);
            // customcanvas.text(`Rain`, 300, startPosY - 40);
            // customcanvas.text(`Wind`, 460, startPosY - 40);
            // customcanvas.text(`Wind dir.`, 600, startPosY - 40);

            const canvas2 = createCanvas(800, 750);
            const ctx2 = canvas2.getContext("2d")

            
            ctx2.fillStyle = '#01B0F1';
            ctx2.fillRect(0, 0, canvas2.width, canvas2.height);

            ctx2.font = '40px sans-serif';
            ctx2.fillStyle = '#ffffff';
            ctx2.fillText(`Weather tomorrow`, 10, 40);
            ctx2.font = '30px sans-serif';

            

            // Titles
            ctx2.fillText(`Time`, 10, startPosY - 40);
            ctx2.fillText(`Temp.`, 80, startPosY - 40);
            ctx2.fillText(`Rain`, 300, startPosY - 40);
            ctx2.fillText(`Wind`, 460, startPosY - 40);
            ctx2.fillText(`dir.`, 600, startPosY - 40);

            let x = 0
            for (let hour of filteredTimeseriesTomorrow) {
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

                let {
                    summary,
                    details
                } = next_1_hours
    

                let offsetY = startPosY + (x * 43)
                // Row

                rows.push([
                    `${moment(time).format("HH")}`, `${air_temperature}°C`, 
                    `./img/weather/${summary.symbol_code}.png`,
                    `${details?.precipitation_amount ? details?.precipitation_amount : "0"}mm`,
                    `${wind_speed}m/s`,
                    `${calculateWindDirection(wind_from_direction)}`
                ])
                ctx2.fillText(`${moment(time).format("HH")}`, 10, offsetY);
                ctx2.fillText(`${air_temperature}°C`, 80, offsetY);
                ctx2.fillText(`${details?.precipitation_amount ? details?.precipitation_amount : "0"}mm`, 300, offsetY);
                ctx2.fillText(`${wind_speed}m/s`, 460, offsetY);
                ctx2.fillText(`${calculateWindDirection(wind_from_direction)}`, 600, offsetY);
                
                if (summary && summary?.symbol_code) {
                    let icon = await readFile(`./img/weather/${summary.symbol_code}.png`)
                    if (icon) {
                        const weathericon = new Image();
                        weathericon.src = icon;
        
                        ctx2.drawImage(weathericon, 230, offsetY - 40)
                    }
                }
                
                // Grid lines
                ctx2.beginPath()
                ctx2.moveTo(10, offsetY+10);
                ctx2.lineTo(700, offsetY+10);
                ctx2.closePath()
                ctx2.stroke();

                x++;
            }
            customcanvas.grid(10, startPosY, [`Time`, `Temp.`, `Rain`, `Wind`, `Wind dir.`], rows, 30)

            // Main Canvas
            const canvas = createCanvas(800, 750);
            const ctx = canvas.getContext('2d')

            
            ctx.fillStyle = '#01B0F1';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = '40px sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`Weather in ${city}`, 10, 40);
            ctx.font = '30px sans-serif';

            // Titles
            ctx.fillText(`Time`, 10, startPosY - 40);
            ctx.fillText(`Temp.`, 80, startPosY - 40);
            ctx.fillText(`Rain`, 300, startPosY - 40);
            ctx.fillText(`Wind`, 460, startPosY - 40);
            ctx.fillText(`Wind dir.`, 600, startPosY - 40);
            let i = 0
            for (let hour of filteredTimeseries) {
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

                let {
                    summary,
                    details
                } = next_1_hours
    

                let offsetY = startPosY + (i * 43)
                // Row
                ctx.fillText(`${moment(time).format("HH")}`, 10, offsetY);
                ctx.fillText(`${air_temperature}°C`, 80, offsetY);
                ctx.fillText(`${details?.precipitation_amount ? details?.precipitation_amount : "0"}mm`, 300, offsetY);
                ctx.fillText(`${wind_speed}m/s`, 460, offsetY);
                ctx.fillText(`${calculateWindDirection(wind_from_direction)}`, 600, offsetY);
                
                if (summary && summary?.symbol_code) {
                    let icon = await readFile(`./img/weather/${summary.symbol_code}.png`)
                    if (icon) {
                        const weathericon = new Image();
                        weathericon.src = icon;
        
                        ctx.drawImage(weathericon, 230, offsetY - 40)
                    }
                }
                
                // Grid lines
                ctx.beginPath()
                ctx.moveTo(10, offsetY+10);
                ctx.lineTo(700, offsetY+10);
                ctx.closePath()
                ctx.stroke();

                i++;
            }


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
            

            const pages: PageEmbedOptions[] = [
                {
                    color: client.config.botEmbedHex,
                    timestamp: new Date(),
                    canvas: canvas
                }, {
                    color: client.config.botEmbedHex,
                    timestamp: new Date(),
                    canvas: customcanvas.gen()
                }
            ]  
            const t = new PageEmbed(pages);

            await t.post(message)

            // channel.send({ embeds: [], files: [] })
        } catch (err) {
            console.log(err)
        }
    }
}


