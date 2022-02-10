import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, GuildMember, EmbedFieldData } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
export const command: Command = {
    name: "presence",
    description: "check a user's presence",
    aliases: ["mypresence"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["presence @user"],
    
    run: async(client, message, args) => {
        const { guild, mentions, author } = message;
        const mention = mentions.users.first();
        const member: GuildMember|undefined = guild?.members.cache.find(m => m.id === mention?.id)
        const presence: EmbedFieldData[] = [];
        if (!member?.presence?.activities) presence.push({name: "none", value: Date.now().toString()})
        member?.presence?.activities.forEach((act) => {
            presence.push({name: `${act.type.toLowerCase()} ${act.name}`, value: `\`\`\`autohotkey\n${act.details ? `Song: ${act.details}` : ``}\n${act.state ? `Artist: '${act.state}'` : ``}\n${act.assets ? `Album: [${act.assets.largeText}]` : ``}\n${moment(act.createdTimestamp).fromNow()}\`\`\``})
            presence.push({name: `\u200b`, value: `\u200b`})
        })
        const embed = new MessageEmbed()
            .setAuthor({name: `${member?.user.username}'s Presence`, iconURL: member?.displayAvatarURL()})
            .addFields(presence)
            .setFooter({ text: `Requested by ${author.tag}`})
            .setTimestamp(Date.now())
        const img = member?.presence?.activities.find((img) => img.assets?.largeImageURL());
        const img2 = member?.presence?.activities.find((img) => img.assets?.largeImageURL());
        if (img || img2) embed.setImage(member?.presence?.activities[0].assets?.largeImageURL() || member?.presence?.activities[0].assets?.smallImageURL() || '');
        message.channel.send({embeds: [embed]});
        client.user?.setActivity({type: "LISTENING", name: "to yooouuu", url: member?.presence?.activities[0].assets?.largeImageURL() || ''})

        // https://gist.github.com/matthewzring/9f7bbfd102003963f9be7dbcf7d40e51
    }
}