import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, GuildMember, EmbedFieldData, MessageAttachment } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import axios from 'axios';
import { PageEmbed, PageEmbedOptions } from '../../Functions/PageEmbed'
import { CustomCanvas, Icon } from '../../Functions/Canvas'
import { ErrorEmbed } from '../../Functions/ErrorEmbed';

export const command: Command = {
    name: "weather",
    description: "get the weather for a city",
    details: "get the weather for a city",
    aliases: ["været"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["weather <city>"],

    run: async(client, message, args) => {
        const { guild, mentions, author, member, channel, attachments } = message;

        if (!guild) return;
        let city = args[0];

        // if (!city) return temporaryMessage(channel, "Please provide a city", 10)
        if (!city) return ErrorEmbed(message, client, command, "Please provide a city")

        function calculateWindDirection(degrees: number): string {
            // const wind_from_direction_cardinal = ["↑N", "↗NE", "→E", "↘SE", "↓S", "↙SW", "←W", "↖NW"]
            const wind_from_direction_arrow = ["↓", "↙", "←", "↖", "↑", "↗", "→", "↘"]
            // ["↑", "↗", "→", "↘", "↓", "↙", "←", "↖"]
            let val = Math.round(degrees / 45)
            /* const wind_from_cardinal_direction = wind_from_direction_arrow[Math.round(degrees / 45)] */
            const wind_from_cardinal_direction = wind_from_direction_arrow[val % 8]
            return wind_from_cardinal_direction
        }
        
        // Haugesund: https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=59.4138214&lon=5.2680735
        try {
            let { data: geodata } = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city.toLowerCase()}&limit=5&appid=${process.env.OPENWEATHER_API_KEY}`).then(res => {
                return res
            })

            const { name, local_names, lat, lon, country } = geodata[0]

            let { data: weatherdata } = await axios.get(`https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${lat}&lon=${lon}`, {
                headers: {
                    "User-Agent": "Discordbot Arvid W."
                }
            })

            

            const { timeseries, meta } = weatherdata.properties;

            

            // Filter timeseries to only show the weather for today
            let filteredTimeseries = timeseries.filter((d: any) => {
                var time = new Date(d.time); 
                return (moment(time).isBefore(moment().endOf('day')) && moment(time).isAfter(moment().startOf('day')))
            });
            let filteredTimeseriesTomorrow = timeseries.filter((d: any) => {
                var time = new Date(d.time); 
                return (moment(time).isAfter(moment().add(1, 'days').startOf('day')) && moment(time).isBefore(moment().add(1, 'days').endOf('day')))
            });

            let startPosY = 140

            const customcanvas = new CustomCanvas(800, 750)
            customcanvas.rect(0, 0, 800, 750, '#01B0F1')
            customcanvas.text(`${name}`, 10, 40, '#FFFFFF', '40px sans-serif')


            const customcanvas2 = new CustomCanvas(800, 750)
            customcanvas2.rect(0, 0, 800, 750, '#01B0F1')
            customcanvas2.text(`${name} tomorrow`, 10, 40, '#FFFFFF', '40px sans-serif')

            function data(data: any, rows: any[], icons: Icon[]) {
                const { time, data: hourdata } = data;

                const { instant, next_12_hours, next_1_hours, next_6_hours } = hourdata;
                const { 
                    air_temperature, 
                    air_pressure_at_sea_level, 
                    cloud_area_fraction,
                    relative_humidity,
                    wind_from_direction,
                    wind_speed,
                    wind_speed_of_gust
                } = instant.details

                let {
                    summary,
                    details
                } = next_1_hours

                icons.push({
                    iconPath: `./img/weather/${summary.symbol_code}.png`,
                    // posX: 250,
                    posX: 300,
                })

                rows.push([
                    `${moment(time).format("HH")}`, 
                    `${air_temperature}°C`, 
                    `${details?.precipitation_amount ? details?.precipitation_amount : "0"}`,
                    `${wind_from_direction} (${wind_speed_of_gust}) ${calculateWindDirection(wind_from_direction)}`,
                ])
            }

            const titles = [`Time`, `Temp.`, `Rain mm`, `Wind(gust) m/s`]

            let rows: any = [titles]
            let icons: Icon[] = []

            let rows2: any = [titles]
            let icons2: Icon[] = []
            
            for (let hour of filteredTimeseries) {
                data(hour, rows, icons)
            }
            
            for (let hour of filteredTimeseriesTomorrow) {
                data(hour, rows2, icons2)
            }
            
            customcanvas.grid(10, startPosY, rows, 30, icons)
            customcanvas2.grid(10, startPosY, rows2, 30, icons2)

            const pages: PageEmbedOptions[] = [
                {
                    color: client.config.botEmbedHex,
                    timestamp: new Date(),
                    canvas: customcanvas.gen()
                }, {
                    color: client.config.botEmbedHex,
                    timestamp: new Date(),
                    canvas: customcanvas2.gen()
                }
            ]  
            const t = new PageEmbed()
                .addPages(pages);

            await t.post(message)

            // channel.send({ embeds: [], files: [] })
        } catch (err) {
            console.log(err)
        }
    }
}


