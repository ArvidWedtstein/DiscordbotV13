import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, User, GuildMember, GuildListMembersOptions } from 'discord.js';
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
        const author: GuildMember|undefined = message.member || message.guild?.members.cache.get(message.author.id);
        if (!message.mentions.users.first()) return temporaryMessage(message.channel, `${await language(message.guild, 'BAN_NOUSERSPECIFIED')}`, 5);
        const mention = message.mentions.users.first();
        const { guild } = message;
        if (!guild?.available) return;

        const member: GuildMember|undefined = guild?.members.cache.find(m => m.id === mention?.id)
        const guildId = guild?.id;
        const userId = author?.user.id;
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
            .setTitle(`${author?.user.username} vs ${member?.user.username}`)
            .setAuthor({name: `Ping is currently ${client.ws.ping.toString()}`, iconURL: client.user?.displayAvatarURL()})
            .setFooter({ text: `Requested by ${message.author.tag}`})
            .addFields(
                // {name: "**Level**", value: `${author.username}: \`\`\`css\n${resultUser.level}\`\`\`\n${member?.user.username}: \`\`\`fix\n${resultUser2.level}\`\`\``}
                {name: `**${author?.user.username}**`, value: 
                    `Level: \`${resultUser.level}\`
                    Coins: \`${resultUser.coins}\`
                    XP: \`${resultUser.xp}\`
                    Bannable: \`${author?.bannable}\`
                    Moderatable: \`${author?.moderatable}\`
                    Premium: \`${author?.premiumSince}\`
                    Highest Role: \`${author?.roles.highest.name}\`
                `, inline: true},
                {name: `**${member?.user.username}**`, value: 
                    `Level: \`${resultUser2.level}\`
                    Coins: \`${resultUser2.coins}\`
                    XP: \`${resultUser2.xp}\`
                    Bannable: \`${member?.bannable}\`
                    Moderatable: \`${member?.moderatable}\`
                    Premium: \`${member?.premiumSince}\`
                    Highest Role: \`${member?.roles.highest.name}\`
                `, inline: true}
            )
            .setTimestamp()
        message.channel.send({embeds: [embed]});
    }
}