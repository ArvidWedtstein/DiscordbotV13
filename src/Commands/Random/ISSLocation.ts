import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, GuildMember, AttachmentBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import axios from 'axios';
export const command: Command = {
    name: "isslocation",
    description: "check the iss location",
    details: "Check the International Space Stations current location.",
    aliases: ["iss"],
    hidden: false,
    UserPermissions: ["SendMessages"],
    ClientPermissions: ["SendMessages", "AddReactions"],
    ownerOnly: false,
    examples: ["iss"],
    run: async(client, message, args) => {
        const { guild, mentions, author, member, channel } = message;


        const { data } = await axios.get(`http://api.open-notify.org/iss-now.json`)
        let { iss_position } = data;
        let { latitude, longitude } = iss_position;

        const { data: Countrydata } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=true&key=${process.env.GOOGLE_API_KEY}`)
        let { results } = Countrydata;
        let res = results[results.length-1]
        let types: any = res.address_components[res.address_components.length-1].types;
        
        const attachment = new AttachmentBuilder('./img/iss.jpg') 
        const attachment2 = new AttachmentBuilder('./img/banner.jpg');
        const embed = new EmbedBuilder()
            .setAuthor({ name: `International Space Station Location` })
            .setThumbnail('attachment://iss.jpg')
            .setImage('attachment://banner.jpg')
            .addFields(
                {name: "Latitude", value: `${latitude}`, inline: true}, 
                {name: "Longitude", value: `${longitude}`, inline: true}, 
                {name: "Country", value: `${types.some((x: any) => x == "country") ? `${res.address_components[0].long_name}` : "In the middle of nowhere"}`, inline: true},
            )
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
            .setTimestamp(Date.now())

        channel.send( {embeds: [embed], files: [attachment, attachment2] });

        return
    }
}


