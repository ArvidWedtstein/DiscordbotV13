import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import profileSchema from '../../schemas/profileSchema';
export const command: Command = {
    name: "birthdays",
    description: "see upcomming birthdays",
    details: "see the upcomming birthdays for the next month",
    aliases: ["upcommingbirthdays"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    run: async(client, message, args) => {
        profileSchema.find({birthday: {$regex: `^${new Date().getMonth()+1}/`}}).then(async users => {
            if(users.length < 1) return message.channel.send(`${language(message.guild, 'NO_BIRTHDAYS')}`)
            let userList = users.map(user => `<@${user.userId}>`).join(', ')
            let embed = new MessageEmbed()
                .setTitle(`${language(message.guild, 'BIRTHDAYS')}`)
                .setDescription(`${userList}`)
            message.channel.send({ embeds: [embed] })
        })
    }
}

