import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, GuildMember, EmbedFieldData, AttachmentBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import { ErrorEmbed } from '../../Functions/ErrorEmbed';
import { CustomCanvas, Icon, TextArraySettings } from '../../Functions/Canvas'
import { PageEmbed, PageEmbedOptions } from '../../Functions/PageEmbed'
import axios from 'axios';
export const command: Command = {
    name: "marsweather",
    description: "Get the weather from mars",
    details: "insert detailed description here",
    aliases: ["weatheronmars", "weathermars"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["marsweather"],
    run: async(client, message, args) => {
        const { guild, mentions, author, member, channel } = message;

        const calculateWindDirection = (degrees: number): string => {
            const wind_from_direction_cardinal = ["↓", "↙", "←", "↖", "↑", "↗", "→", "↘"]
            const wind_from_cardinal_direction = wind_from_direction_cardinal[Math.round(degrees / 45)]
            return wind_from_cardinal_direction
        }
        try {
            let { data } = await axios.get(`https://mars.nasa.gov/rss/api/?feed=weather&category=insight_temperature&feedtype=json&ver=1.0`);
            
            const {
                sol_keys,
                validity_checks,
                ...solData
            } = data;

            const sols = Object.entries(solData).map(([sol, data]: any) => {
                const { AT, HWS, WD, PRE, First_UTC } = data;
                return {
                    sol: sol,
                    maxTemp: AT.mx,
                    minTemp: AT.mn,
                    windSpeed: HWS.av,
                    windDirectionDegrees: WD.most_common.compass_degrees,
                    windDirectionIcon: calculateWindDirection(WD.most_common.compass_degrees),
                    windDirectionCardinal: WD.most_common.compass_point,
                    date: new Date(First_UTC),
                }
            });

            let lastSol = sols[sols.length - 1];

            const {
                sol,
                maxTemp,
                minTemp,
                windSpeed,
                windDirectionDegrees,
                windDirectionIcon,
                windDirectionCardinal,
                date
            } = lastSol;

            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            const cc = new CustomCanvas(800, 400)
            cc.rect(0, 0, 800, 750, '#550C06')
            cc.text(`Weather On Mars`, 10, 40, '#FFFFFF', '40px sans-serif')

            /* cc.row(0, 300, cc.canvas.width, [
                "test1",
                "test2",
                "test3"
            ]); */

            let texts: TextArraySettings[] = [
                { text: `SOL`, font: '40px sans-serif' },
                { text: `${sol}`, font: '40px sans-serif', padding: { top: 10 } },
                { text: `${monthNames[date.getMonth()]} ${date.getDate()},`, font: '40px sans-serif', padding: { top: 30 } },
                { text: `${date.getFullYear()}`, font: '40px sans-serif', padding: { top: 15 } },
            ]
            cc.textArray(texts, 10, 100)


            let textTemp: TextArraySettings[] = [
                { text: `High: ${maxTemp.toFixed(1)}°C `, font: '40px sans-serif' },
                { text: `Low: ${minTemp.toFixed(1)}°C`, font: '40px sans-serif', padding: { top: 5 } },
                { text: `Wind: ${windSpeed.toFixed(1)}m/s ${windDirectionIcon}`, font: '40px sans-serif' },
            ]
            cc.textArray(textTemp, 400, 100)


            const pages: PageEmbedOptions[] = [
                {
                    color: client.config.botEmbedHex,
                    timestamp: new Date(),
                    canvas: cc.gen()
                }
            ]  
            const t = new PageEmbed()
                .addPages(pages);

            await t.post(message)
        } catch (error) {
            console.log(error)
        }
    }
}


