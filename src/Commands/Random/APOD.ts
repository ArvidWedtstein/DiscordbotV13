import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, GuildMember, AttachmentBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import axios from 'axios';
import { cacheSetTTL, cacheSet } from '../../Functions/CacheClient'
import NasaAPIcacheSchema from '../../schemas/24hAPIcacheSchema';
export const command: Command = {
    name: "apod2",
    description: "Check out the Astronomy Picture of the Day",
    details: "Check out the Astronomy Picture of the Day",
    aliases: ["astronomy_picture_of_the_day", "astronomypictureoftheday"],
    hidden: false,
    UserPermissions: ["SendMessages", "EmbedLinks", "ViewChannel"],
    ClientPermissions: ["SendMessages", "AddReactions"],
    ownerOnly: false,
    examples: ["apod"],
    run: async(client, message, args) => {
        const { guild, mentions, author, member, channel } = message;
        //https://api.nasa.gov/
        
        let Nasa = await NasaAPIcacheSchema.findOne({
            type: "apod"
        })
        if (!Nasa || moment(Nasa.data.date).isBefore(moment().startOf('day'))) {
            if (Nasa && moment(Nasa.data.date).isBefore(moment().startOf('day'))) {
                await NasaAPIcacheSchema.deleteOne({
                    type: "apod"
                })
            }
            const { data } = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`)
            const newNasa = new NasaAPIcacheSchema({
                type: "apod",
                data: data
            }).save()
            Nasa = await newNasa
        }
        
        const { data: { date, explanation, hdurl, media_type, service_version, title, url } } = Nasa;

        const embed = new EmbedBuilder()
            .setTitle(`Astronomy Picture of the Day`)
            .setDescription(`${title}`)
            .setImage(hdurl)
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
            .setTimestamp(date)

        if (media_type === "video") embed.setURL(url)

        return channel.send( {embeds: [embed] });
    }
}


