import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, codeBlock, EmbedBuilder, GuildMember, APIEmbedField, ActivityType } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
export const command: Command = {
    name: "presence",
    description: "check a user's presence",
    aliases: ["mypresence"],
    hidden: false,
    UserPermissions: ["SendMessages"],
    ClientPermissions: ["SendMessages", "AddReactions"],
    ownerOnly: false,
    examples: ["presence @user"],
    
    run: async(client, message, args) => {
        const { guild, mentions, author, member, channel } = message;
        if (!guild) return

        const mention = mentions.users.first();
        
        let usermember = guild.members.cache.find(m => m.id === mention?.id) || member; 
        if (!usermember) return
        

        

        const getPresence = ((user: GuildMember): APIEmbedField[] => {
            const presence: APIEmbedField[] = [];
            if (!user.presence) return [{name: "none", value: Date.now().toString()}]

            user.presence.activities.forEach((act) => {
                presence.push({ 
                    name: `${act.type.toString().toLowerCase()} ${act.name}`, 
                    value: `${codeBlock('autohotkey', `
                        ${act.details ? `Song: ${act.details}${act.emoji}` : ''}
                        ${act.state ? `Artist: '${act.state}'`: ''}
                        ${act.assets ? `Album: [${act.assets.largeText}]` : ``}
                        ${moment(act.createdTimestamp).fromNow()}
                    `)}` 
                })
                presence.push({name: `\u200b`, value: `\u200b`})
            })
            return presence
        });
        

        const embed = new EmbedBuilder()
            .setAuthor({name: `${usermember.user.username}'s Presence`, iconURL: usermember.displayAvatarURL()})
            .addFields(getPresence(usermember))
            .setFooter({ text: `Requested by ${author.tag}`})
            .setTimestamp(Date.now())
        const img = usermember?.presence?.activities.find((img: any) => img.assets?.largeImageURL());
        const img2 = usermember?.presence?.activities.find((img: any) => img.assets?.largeImageURL());
        if (img || img2) embed.setImage(usermember?.presence?.activities[0].assets?.largeImageURL() || usermember?.presence?.activities[0].assets?.smallImageURL() || '');
        channel.send({embeds: [embed]});
        client.user?.setActivity({ type: ActivityType.Listening, name: `to yoooouuu`, url: usermember.presence?.activities[0].assets?.largeImageURL() || '' })

        // https://gist.github.com/matthewzring/9f7bbfd102003963f9be7dbcf7d40e51
    }
}