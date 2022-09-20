import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, GuildMember, EmbedFieldData } from 'discord.js';
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
        const { guild, mentions, author, member, channel } = message;
        const mention = mentions.users.first();
        const usermember: GuildMember|any = guild?.members.cache.find(m => m.id === mention?.id) || member;
        const presence: EmbedFieldData[] = [];
        if (!usermember?.presence?.activities) presence.push({name: "none", value: Date.now().toString()})
        usermember?.presence?.activities.forEach((act: any) => {
            presence.push({name: `${act.type.toLowerCase()} ${act.name}`, value: `\`\`\`autohotkey\n${act.details ? `Song: ${act.details}` : ``}\n${act.state ? `Artist: '${act.state}'` : ``}\n${act.assets ? `Album: [${act.assets.largeText}]` : ``}\n${moment(act.createdTimestamp).fromNow()}\`\`\``})
            presence.push({name: `\u200b`, value: `\u200b`})
        })
        const embed = new EmbedBuilder()
            .setAuthor({name: `${usermember?.user.username}'s Presence`, iconURL: member?.displayAvatarURL()})
            .addFields(presence)
            .setFooter({ text: `Requested by ${author.tag}`})
            .setTimestamp(Date.now())
        const img = usermember?.presence?.activities.find((img: any) => img.assets?.largeImageURL());
        const img2 = usermember?.presence?.activities.find((img: any) => img.assets?.largeImageURL());
        if (img || img2) embed.setImage(usermember?.presence?.activities[0].assets?.largeImageURL() || usermember?.presence?.activities[0].assets?.smallImageURL() || '');
        channel.send({embeds: [embed]});
        client.user?.setActivity({type: "LISTENING", name: "to yooouuu", url: usermember?.presence?.activities[0].assets?.largeImageURL() || ''})

        // https://gist.github.com/matthewzring/9f7bbfd102003963f9be7dbcf7d40e51
    }
}