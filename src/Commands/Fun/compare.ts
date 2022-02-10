import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, User, GuildMember } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import profileSchema from '../../schemas/profileSchema';

export const command: Command = {
    name: "compare",
    description: "compare yourself to a user",
    aliases: ["memecompare"],
    group: __dirname,
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["compare @user"],
    
    run: async(client, message, args) => {
        const author: User = message.author;

        if (!message.mentions.users.first()) return temporaryMessage(message.channel, `${await language(message.guild, 'BAN_NOUSERSPECIFIED')}`, 5);
        const mention = message.mentions.users.first();
        const { guild } = message;
        if (!guild?.available) return;

        const member: GuildMember|undefined = guild?.members.cache.find(m => m.id === mention?.id)
        const guildId = guild?.id;
        const userId = author.id;
        const resultUser = await profileSchema.findOne({
            userId,
            guildId
        })
        const resultUser2 = await profileSchema.findOne({
            userId: member?.id,
            guildId
        })
        console.log(resultUser)
        console.log(resultUser2)
        const embed = new MessageEmbed()
            .setTitle(`${author.username} vs ${member?.user.username}`)
            .setAuthor({name: `Ping is currently ${client.ws.ping.toString()}`, iconURL: client.user?.displayAvatarURL()})
            .setFooter({ text: `Requested by ${message.author.tag}`})
            .addFields(
                // {name: "**Level**", value: `${author.username}: \`\`\`css\n${resultUser.level}\`\`\`\n${member?.user.username}: \`\`\`fix\n${resultUser2.level}\`\`\``}
                {name: `**${author.username}**`, value: `Level: \`${resultUser.level}\`\nCoins: \`${resultUser.coins}\``, inline: true},
                {name: `**${member?.user.username}**`, value: `Level: \`${resultUser2.level}\`\nCoins: \`${resultUser2.coins}\``, inline: true}
            )
            .setTimestamp()
        message.channel.send({embeds: [embed]});
    }
}