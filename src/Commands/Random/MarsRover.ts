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
    name: "marsrover",
    description: "Get a random mars rover image",
    details: "Get a random mars rover image",
    aliases: ["marsroverpictures"],
    hidden: false,
    UserPermissions: ["SendMessages"],
    ClientPermissions: ["SendMessages", "AddReactions"],
    ownerOnly: false,
    examples: ["marsroverpictures"],
    run: async(client, message, args) => {
        const { guild, mentions, author, member, channel } = message;

        axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${process.env.NASA_API_KEY}`).then(res => {
            let chosenPicture = res.data.photos[Math.floor(Math.random()*res.data.photos.length)];
            const embed = new EmbedBuilder()
                .setTitle(`Random Mars Rover Picture`)
                .setImage(chosenPicture.img_src)
                .setDescription(`Taken on ${chosenPicture.earth_date} by the "${chosenPicture.rover.name}" rover with the camera ${chosenPicture.camera.full_name}`)
                .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
                .setTimestamp(Date.now())

            channel.send({ embeds: [embed] });
        }).catch(err => {
            console.log(err);
        })
    }
}


