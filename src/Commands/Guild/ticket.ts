import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language, { insert } from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
export const command: Command = {
    name: "ticket",
    description: "send a ticket",
    aliases: ["helpticket"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["ticket "],
    
    run: async(client, message, args) => {
        const { guild, author, member, channel: chan } = message;
        if (!guild) return
        const guildId = guild.id

        const setting = await Settings(message, 'ticket');
        if (!setting) return temporaryMessage(chan, `${insert(guild, 'SETTING_OFF', "Ticket")}`)
        
        let channel: any = guild.channels.cache.find(channel => channel.name === 'tickets');
        if (!channel) {
            channel = guild.channels.create('tickets', {
                nsfw: true,
                topic: "pain"
            })
        }
        const check = '<:yes:807175712515162183>'
        let helpText = args.slice(0).join(' ');
        let d = new Date();

        //If there is no help
        if (!helpText) {
            return temporaryMessage(chan, `${language(guild, 'TICKET_NOARGS')}`, 10)
        }

        if (helpText.length > 1024) {
            helpText = helpText.slice(0, 1021) + '...';
        }
        if (channel?.type != "GUILD_TEXT") return;

        let embed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle(`${await language(guild, 'TICKET_ISSUE')}:`)
            .setDescription(helpText)
            .setAuthor({ name: `${author.username}`, iconURL: author.displayAvatarURL()} )
            .setFooter({ text: `${await language(guild, 'TICKET_UNSOLVED')} ${d.toLocaleTimeString()}`})
        let messageEmbed = await channel.send({ embeds: [embed] }).then((msg: any) => {
            msg.react(check);

            client.on('messageReactionAdd', async (reaction, user) => {
                if (reaction.message.partial) await reaction.message.fetch();
                if (reaction.partial) await reaction.fetch();
                if (user.bot) return;
                if (!reaction.message.guild) return;
                const ReactUser = reaction.message.guild.members.cache.get(user?.id)
                let embed2 = new MessageEmbed()
                    .setColor('#10ff00')
                    .setTitle(`${await language(guild, 'TICKET_SOLVED')} ${await language(guild, 'TICKET_ISSUE')}:`)
                    .setDescription(helpText)
                    .setAuthor({name: `${member?.user?.username}`, iconURL: member?.user.displayAvatarURL()})
                    .setTimestamp()
                    .setFooter({ text: `${await language(guild, 'TICKET_SOLVEDBY')} ${user.username}`})
                reaction.message.edit({ embeds: [embed2] });
                member?.user.send(`${await language(guild, 'TICKET_SOLVEDISSUE')} ${user.username}`)
                
            });
            client.on('messageReactionRemove', async (reaction, user) => {
                if (reaction.message.partial) await reaction.message.fetch();
                if (reaction.partial) await reaction.fetch();
                if (user.bot) return;
                if (!reaction.message.guild) return;
    
                const ReactUser = reaction.message.guild.members.cache.get(user?.id)
                let embed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setTitle(`${language(guild, 'TICKET_ISSUE')}:`)
                    .setDescription(helpText)
                    .setAuthor({ name: `${member?.user.username}`, iconURL: member?.user.displayAvatarURL() })
                    .setFooter({ text: `${language(guild, 'TICKET_UNSOLVED')} ${d.toLocaleTimeString()}`})
                message.edit({ embeds: [embed] });
                member?.user.send(`${language(guild, 'TICKET_UNSOLVEDISSUE')}`)
            });
        })
    }
}