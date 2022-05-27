
import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, Message, Interaction, ExcludeEnum, MessageAttachment, MessageButtonStyleResolvable } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import { joinVoiceChannel } from '@discordjs/voice';
import icon from '../../Functions/icon';
import playlistSchema from '../../schemas/playlist-schema';
import { QueryType } from 'discord-player';
import { MessageButtonStyles } from 'discord.js/typings/enums';

let songint = 0
let music: any = {}
const queue: any = new Map();
export const command: Command = {
    name: "music2",
    description: "Music",
    details: "play music from a url or by searching\nYou can also skip, pause and make playlists!",
    aliases: ["m2"],
    hidden: true,
    disabled: false,
    UserPermissions: ["SEND_MESSAGES", "CONNECT"],
    ClientPermissions: [
        'SPEAK', 
        'CONNECT', 
        'STREAM', 
        'SEND_MESSAGES',
        'ADD_REACTIONS',
        'ATTACH_FILES',
        'EMBED_LINKS',
        'MANAGE_MESSAGES',
        'READ_MESSAGE_HISTORY',
        'VIEW_CHANNEL'
    ],
    ownerOnly: false,
    examples: ["music"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions } = message;

        const playemojis = [
            "play",
            "skip",
            "stop",
            "resume",
            "pause",
            "loopone",
            "loopall",
            "loopstop",
            "music",
            "cable",
            "audio"
        ]

        if (!guild) return message.reply(`Cannot find guild`);
        
        const getEmoji = (emojiName: any) => client.emojis.cache.find((emoji) => emoji.name === emojiName);
        
        const guildId = guild.id;
        const userId = author.id;

        if (!member?.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);

        const queue = await client.player.createQueue(guild, {
            metadata: {
                channel: channel
            }
        });

        if (!queue.connection) await queue.connect(member.voice.channel);

        let allowedOptions = [
            'play',
            'skip',
            'stop',
            'resume',
            'pause',
            'loopone',
            'loopall',
            'loopstop',
            'playlist',
            'search'
        ]
        
        if (!allowedOptions.includes(args[0])) return temporaryMessage(channel, `Invalid option! Try one of these ${allowedOptions.join(',')}`, 30)

        function genButton(id: string, emoji: any, style: ExcludeEnum<typeof MessageButtonStyles, "LINK">) {
            return new MessageButton({
                customId: id,
                emoji: emoji,
                style: style
            })
        }
        function row(paused: boolean) {
            const row = new MessageActionRow()
            const playpausebtn = new MessageButton()
                .setCustomId(paused ? 'play' : 'pause')
                .setEmoji(icon(client, guild, paused ? 'play' : 'pause').id)
                .setStyle(2)
            const skipbtn = new MessageButton()
                .setCustomId('skip')
                .setEmoji(icon(client, guild, 'chevronright').id)
                .setStyle(2)
            const stopbtn = new MessageButton()
                .setCustomId('stop')
                .setEmoji(icon(client, guild, 'musicalnotes').id)
                .setStyle(2)
            const looponebtn = new MessageButton()
                .setCustomId('loopone')
                .setEmoji(icon(client, guild, 'loopall').id)
                .setStyle(2)
            const loopallbtn = new MessageButton()
                .setCustomId('loopall')
                .setEmoji(icon(client, guild, 'loopall').id)
                .setStyle(2)

            row.addComponents(
                genButton(paused ? 'play' : 'pause', icon(client, guild, paused ? 'play' : 'pause').id, "SECONDARY"),
                playpausebtn,
                skipbtn,
                stopbtn,
                looponebtn,
                loopallbtn
            )

            return row;
        }
        
        const attachment = new MessageAttachment('./img/banner.jpg', 'banner.jpg');
        const embed = new MessageEmbed()
            .setColor(client.config.botEmbedHex)
            .setImage('attachment://banner.jpg')

        if (args[0] === 'play') {
            if (!args[1]) return temporaryMessage(channel, `You need to specify a url or search term!`, 30)

            let url = args[1];
            const track = await client.player.search(url, {
                requestedBy: author,
                searchEngine: QueryType.YOUTUBE_VIDEO
            }).then(x => x.tracks[0])

            if (!track) return temporaryMessage(channel, `Could not find a video with the url ${url}`, 30)
            // queue.createProgressBar();
            await queue.addTrack(track);

            embed.setDescription([
                `**[${track.title}]** has been added to the queue!\n`,
                `Added by: ${author.tag} | Duration: \`> ${track.duration}\` | Position In Queue: \`${queue.getTrackPosition(track)}\``,
            ].join('\n'))
            embed.setThumbnail(track.thumbnail)
            embed.setAuthor({ name: `ADDED TO QUEUE`, iconURL: author.displayAvatarURL({ dynamic: true })})
        } else if (args[0] === 'skip') {
            queue.skip();
        } else if (args[0] === 'stop') {

        } else if (args[0] === 'resume') {

        } else if (args[0] === 'pause') {

        } else if (args[0] === 'loopone') {

        } else if (args[0] === 'loopall') {

        } else if (args[0] === 'loopstop') {
    
        } else if (args[0] === 'playlist') {
            if (!args[1]) return temporaryMessage(channel, `You need to specify a url or search term!`, 30)

            let url = args[1];
            const result = await client.player.search(url, {
                requestedBy: author,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })

            if (!result || result.tracks.length === 0) return temporaryMessage(channel, `Could not find a playlist with the url ${url}`, 30)

            const playlist = result.playlist;
            await queue.addTracks(result.tracks);
        } else if (args[0] === 'search') {
            if (!args[1]) return temporaryMessage(channel, `You need to specify a url or search term!`, 30)

            let url = args[1];
            const result = await client.player.search(url, {
                requestedBy: author,
                searchEngine: QueryType.AUTO
            })

            if (!result || result.tracks.length === 0) return temporaryMessage(channel, `Could not find something with the url ${url}`, 30)

            const track = result.tracks[0];
            await queue.addTrack(track);
        }

        if (!queue.playing) await queue.play();

        channel.send({ embeds: [embed], files: [attachment], components: [row(queue.playing)] }).then(async(msg) => {
            const filter = (i: Interaction) => i.user.id === author.id;
            let collect = msg.createMessageComponentCollector({
                filter, 
                max: 100,
                time: 5 * (60 * 1000)
            });
            collect.on('collect', async (reaction) => {
                if (!reaction) return;
                if (!reaction.isButton()) return;
                reaction.deferUpdate();

                switch (reaction.customId) {
                    case "play":
                        embed.setDescription(`**[${queue.current.title}]** has been resumed!`)
                        msg.edit({ embeds: [embed], files: [attachment], components: [row(false)] })
                        await queue.setPaused(false);
                        break;
                    case "pause":
                        queue.setPaused(true);
                        embed.setDescription(`**[${queue.current.title}]** has been paused!`)
                        msg.edit({ embeds: [embed], files: [attachment], components: [row(true)] })
                        break;
                    case "skip":
                        
                        break;
                    case "stop":
                        
                        break;
                    case "loopone":
                        
                        break;
                    case "loopall":
                        
                        break;
                    case "loopstop":
                        
                        break;
                }
                return
            })
        })
    }
}
