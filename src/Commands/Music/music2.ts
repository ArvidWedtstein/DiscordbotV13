
import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, TextInputComponent, ModalActionRowComponent, EmbedBuilder, Message, Interaction, AttachmentBuilder, Formatters } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import icon from '../../Functions/icon';
import playlistSchema from '../../schemas/playlist-schema';
// import { QueryType, QueueRepeatMode } from 'discord-player';


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
        return
        /* const { guild, channel, author, member, mentions } = message;

        if (!guild) return message.reply(`Cannot find guild`);
        
        const getEmoji = (emojiName: string) => client.emojis.cache.find((emoji) => emoji.name === emojiName);
        
        const guildId = guild.id;
        const userId = author.id;

        if (!member?.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);

        const queue = await client.player.createQueue(guild, {
            metadata: {
                channel: channel
            },
            leaveOnEmpty: false,
            leaveOnEnd: false
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
            const row = new MessageActionRow().addComponents(
                genButton(`volumedown`, "🔉", "SECONDARY"),
                genButton(`back`, icon(client, guild, 'chevronleft').id, "SECONDARY"),
                genButton(paused ? 'play' : 'pause', icon(client, guild, paused ? 'play' : 'pause').id, "SECONDARY"),
                genButton(`skip`, icon(client, guild, 'chevronright').id, "SECONDARY"),
                genButton(`volumeup`, "🔊", "SECONDARY")
            )
            const row2 = new MessageActionRow().addComponents(
                genButton('shuffle', icon(client, guild, 'shuffle').id, "SECONDARY"),
                genButton('loopone', icon(client, guild, 'loopall').id, "SECONDARY"),
                genButton('stop', icon(client, guild, 'musicalnotes').id, "SECONDARY"),
                genButton('loopall', icon(client, guild, 'loopall').id, "SECONDARY"),
                genButton('clear', "🗑", "SECONDARY")
            )
            return [row, row2];
        }
        
        const attachment = new AttachmentBuilder('./img/banner.jpg', 'banner.jpg');

        if (args[0] === 'play') {
            if (!args[1]) return temporaryMessage(channel, `You need to specify a url or search term!`, 30)
            args.shift()
            let url = args.join(' ');
            const track = await client.player.search(url, {
                requestedBy: author,
                searchEngine: QueryType.AUTO
            }).then(x => x.tracks[0])
            
            if (!track) return temporaryMessage(channel, `Could not find a video with the url ${url}`, 30)
            await queue.addTrack(track);

        } else if (args[0] === 'skip') {
            queue.skip();
        } else if (args[0] === 'stop') {
            queue.stop()
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

            await queue.addTracks(result.tracks);
        }

        if (!queue.playing) await queue.play();


        return */
    }
}