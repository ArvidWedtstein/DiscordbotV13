import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, MessageAttachment } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import profileSchema from '../../schemas/profileSchema';
import moment from 'moment';
import { blob } from 'stream/consumers';
export const command: Command = {
    name: "notification",
    description: "choose what you want to get notified about",
    details: "Choose what you want to get notified about.",
    aliases: ["notifications"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    run: async(client, message, args) => {
        const { guild, channel, author } = message

        const attachment = new MessageAttachment('./img/banner.jpg', 'banner.jpg');

        // TODO - Create either select menu with the notification settings or buttons. Toggle emoji of button/menuitem to show/hide.
        let embed = new MessageEmbed()
            .setTitle(`Notifications`)
            .setDescription(`This command is still in progress.`)
            .setImage('attachment://banner.jpg')
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
        channel.send({ embeds: [embed], files: [attachment] })
    }
}

