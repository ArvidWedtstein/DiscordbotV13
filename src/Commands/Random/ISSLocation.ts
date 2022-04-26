import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, GuildMember, EmbedFieldData, MessageAttachment } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import axios from 'axios';
export const command: Command = {
    name: "isslocation",
    description: "check the iss location",
    details: "Check the International Space Stations current location.",
    aliases: ["iss"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["iss"],
    run: async(client, message, args) => {
        const { guild, mentions, author, member, channel } = message;

        axios.get('http://api.open-notify.org/iss-now.json').then(res => {
            let { iss_position } = res.data
            axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${iss_position.latitude},${iss_position.longitude}&sensor=true&key=${process.env.GOOGLE_API_KEY}`).then(res2 => {
                let { results } = res2.data
                let types: any = results[results.length-1].address_components[results[results.length-1].address_components.length-1].types;

                const attachment = new MessageAttachment('./img/iss.jpg', 'iss.jpg')  // Create an attachment
                const embed = new MessageEmbed()
                    .setAuthor({ name: `International Space Station` })
                    .setThumbnail('attachment://iss.jpg')
                    .addFields(
                        {name: "Latitude", value: `${iss_position.latitude}`, inline: true}, 
                        {name: "Longitude", value: `${iss_position.longitude}`, inline: true}, 
                        {name: "Country", value: `${types.some((x: any) => x == "country") ? `${results[results.length-1].address_components[0].long_name}` : "In the middle of nowhere"}`, inline: true},
                    )
                    .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
                    .setTimestamp(Date.now())

                channel.send( {embeds: [embed], files: [attachment] });
            }).catch(err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        })
    }
}


