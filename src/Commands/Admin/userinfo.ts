import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
export const command: Command = {
    name: "userinfo",
    description: "check info of a user",
    details: "Check the info of a user.",
    aliases: ["brukerinfo"],
    group: __dirname.toLowerCase(),
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS", 'ADMINISTRATOR'],
    ownerOnly: false,
    examples: ["userinfo @user"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions } = message;
        const embed = new MessageEmbed()
            .setAuthor({name: `Userinfo for: ${member?.user.username}`, iconURL: member?.displayAvatarURL()})
            .addFields(
                {name: `Bannable: `, value: `${member?.bannable}`},
                {name: `Kickable: `, value: `${member?.kickable}`},
                {name: `Managable: `, value: `${member?.manageable}`},
                {name: `Moderatable: `, value: `${member?.moderatable}`},
                {name: `Nickname: `, value: `${member?.nickname}`},
                {name: `Displayname: `, value: `${member?.displayName}`},
                {name: `Displaynhexcolor: `, value: `${member?.displayHexColor}`},
                {name: `Joined At: `, value: `${member?.joinedTimestamp}`},
                {name: `Permissions: `, value: `${member?.permissions}`},
                {name: `Discriminator: `, value: `${member?.user.discriminator}`},
            )
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
            .setTimestamp()
        author.send({embeds: [embed]});
    }
}