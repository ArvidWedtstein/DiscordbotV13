
// const ytdl = require('ytdl-core');
// const ytSearch = require('yt-search');
// const { YTSearcher } = require('ytsearcher')
import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Interaction, MessageReaction, User } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import { joinVoiceChannel } from '@discordjs/voice';
import icon from '../../Functions/icon';
import playlistSchema from '../../schemas/playlist-schema';
import { ErrorEmbed } from '../../Functions/ErrorEmbed';

let songint = 0
let music: any = {}
const queue: any = new Map();
export const command: Command = {
    name: "music",
    description: "Music",
    details: "play music from a url or by searching\nYou can also skip, pause and make playlists!",
    aliases: ["m", "musikk"],
    hidden: true,
    disabled: true,
    UserPermissions: ["SendMessages", "Connect"],
    ClientPermissions: [
        'Speak', 
        'Connect', 
        'Stream', 
        'SendMessages',
        'AddReactions',
        'AttachFiles',
        'EmbedLinks',
        'ManageMessages',
        'ReadMessageHistory',
        'ViewChannel'
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

        playemojis.forEach(async (emoji: any) => {
            music[emoji] = getEmoji(emoji)
        })
        
        const guildId = guild?.id;
        const userId = author.id;
        
        const voice_channel = member?.voice.channel;


        const server_queue = queue.get(guildId)
        if (!args[0]) {
            menu(message, music, server_queue, client)
        } else if (args[0] == 'play') {
            if (!voice_channel) {
                
                return ErrorEmbed(message, client, command, `${language(guild, 'VOICE_CHANNEL')}.`);
            } else {
                /*let result = await searcher.search(args.join(" "), { type: "video" })
                const songInfo = await ytdl.getInfo(result.first.url)*/
                
                let song: any = {}
                /*let song = { 
                    title: songInfo.videoDetails.title, 
                    url: songInfo.videoDetails.video_url,
                    img: songInfo.videoDetails.thumbnail,
                    duration: songInfo.videoDetails.duration
                }*/
                
                if (!args.length) return ErrorEmbed(message, client, command, 'You need to send the second argument');
        
                // if (ytdl.validateURL(args[0])) {
                //     const song_info = await ytdl.getInfo(args[0]);
                //     song_info.fade_in_start_milliseconds = false;
                //     song_info.loudness = 100;
                    
                //     song = { 
                //         title: song_info.videoDetails.title, 
                //         url: song_info.videoDetails.video_url,
                //         img: song_info.videoDetails.thumbnail,
                //         duration: song_info.videoDetails.duration
                //     }
                // } else {
                //     //If the video is not a URL then use keywords to find that video.
                //     const video_finder = async (query: any) => {
                //         const videoResult = await ytSearch(query);
                        
                //         return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                        
                //         /*let videoResult = await searcher.search(query)
                //         return videoResult.first*/
                //     }
                //     const video = await video_finder(args.join(" "));
                //     if (video) {
                //         song = { title: video.title, url: video.url, img: video.thumbnail, duration: video.duration }
                //     } else {
                //         temporaryMessage(channel, `${language(guild, 'MUSIC_CONNECTERROR')}`, 30);
                //     }
                // }
                if (!server_queue) {

                    const queue_constructor: any = {
                        voice_channel: voice_channel,
                        text_channel: channel,
                        connection: null,
                        songs: [],
                        playing: true,
                        loopone: false,
                        loopall: false
                    }
        
                    // Set quene
                    queue.set(guildId, queue_constructor);

                    // Add song to quene
                    queue_constructor.songs.push(song);
                    //songs.push(song)

                    try {
                        if (!voice_channel.joinable) return ErrorEmbed(message, client, command, `Could not join voicechannel`);
                        if (voice_channel.full) return ErrorEmbed(message, client, command, `There is not enough room for both of us in this voicechannel 😐`);

                        let ad: any = guild.voiceAdapterCreator
                        // Join Voice channel
                        let connection = joinVoiceChannel({
                            channelId: voice_channel.id,
                            guildId: guildId,
                            selfDeaf: true,
                            adapterCreator: ad
                        })


                        queue_constructor.connection = connection;
                        video_player(message, queue_constructor.songs[0], client)
                    } catch (err) { 
                        queue.delete(guildId);
                        console.error(err);
                        return ErrorEmbed(message, client, command, `${language(guild, 'MUSIC_CONNECTERROR')}`);
                    }
                } else {
                    // If there already is a song in the quene
                    server_queue.songs.push(song);
                    
                    let embed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle(`📥 **${song?.title}** ${language(guild, 'MUSIC_ADDQUEUE')}.`)
                        .setThumbnail(song?.img)
                        .setFooter({ text: `Added by ${message.author.username}`, iconURL: `${message.author.displayAvatarURL()}` })
                    
                    return await temporaryMessage(server_queue.text_channel, embed, 10);
                }
            }

        } else if (args[0] == 'skip') {
            skip_song(message, server_queue);
        } else if (args[0] == 'stop') {
            stop_song(message, server_queue);
        } else if (args[0] == 'list') {
            list_songs(message, server_queue);
        } else if (args[0] == 'save') {
            save_queue(message, server_queue);
        } else if (args[0] == 'load') {
            load_queue(message, server_queue, client);
        } else if (args[0] == 'playlist') {
            playlist_songs(message, server_queue);
        } else if (args[0] == 'v') {
            volume(message, args, server_queue);
        } else if (args[0] == 'p') {
            pause_song(message, server_queue);
        } else if (args[0] == 'r') {
            resume_song(message, server_queue);
        } else if (args[0] == 'loop') {
            if (args[1] == 'one') {
                loop_one(message, server_queue);
            } else if (args[1] == 'all') {
                loop_all(message, server_queue);
            } else if (args[1] == 'off') {
                loop_off(message, server_queue);
            }
        } 
        const filter = (i: Interaction) => i.user.id === author.id;
        const filterReaction = (i: MessageReaction, user: User) => {
            return user.id === author.id;
        }
        let collect = message.createMessageComponentCollector({
            filter, 
            max: 1,
            time: 60000
        });
        collect.on('collect', async (reaction) => {
            if (!reaction) return;
            if (!reaction.isButton()) return;
            console.log(reaction.id)
            switch (reaction.id) {
                case "play":

                    break;
                case "skip":
                    skip_song(message, server_queue);
                    break;
                case "stop":
                    stop_song(message, server_queue);
                    break;
                case "loopone":
                    loop_one(message, server_queue);
                    break;
                case "loopall":
                    loop_all(message, server_queue);
                    break;
                case "loopstop":
                    loop_off(message, server_queue);
                    break;
            }
        })
        let reactionCollect = message.createReactionCollector({
            filter: filterReaction,
            max: 1,
            time: 60000
        });
        reactionCollect.on('collect', async (reaction: MessageReaction, user: User) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;

            
            if (reaction.message.channel.id != channel.id) return
            switch (reaction.emoji) {
                case music.pause: 
                    await reaction.users.remove(user.id);
                    await reaction.users.remove(client.user?.id);
                    reaction.message.react(music.resume)
                    pause_song(message, server_queue);
                    break;
                case music.resume:
                    await reaction.users.remove(user.id);
                    await reaction.users.remove(client.user?.id);
                    reaction.message.react(music.pause)
                    resume_song(message, server_queue);
                    break; 
                case music.stop:
                    stop_song(message, server_queue);
                    await reaction.users.remove(user.id);
                    break;
                case music.skip:
                    skip_song(message, server_queue);
                    await reaction.users.remove(user.id);
                    break;
                case music.loopone: 
                    loop_one(message, server_queue);
                    await reaction.users.remove(user.id);
                    break;
                case music.loopall:
                    loop_all(message, server_queue);
                    await reaction.users.remove(user.id);
                    break;
                case music.loopstop:
                    loop_off(message, server_queue);
                    break;
                default:

                    break;
            }
        })
    }
}
async function menu(message: Message, music: any, queue: any, client: any) {
    const { guild, author, channel } = message
    if (!guild) return
    const row = new ActionRowBuilder<ButtonBuilder>()
    const playbtn = new ButtonBuilder()
        .setCustomId('play')
        .setEmoji(icon(client, guild, 'play').id)
        .setStyle(2)
    const skipbtn = new ButtonBuilder()
        .setCustomId('skip')
        .setEmoji(music.skip.id)
        .setStyle(2)
    const stopbtn = new ButtonBuilder()
        .setCustomId('stop')
        .setEmoji(music.stop.id)
        .setStyle(2)
    const looponebtn = new ButtonBuilder()
        .setCustomId('loopone')
        .setEmoji(music.loopone.id)
        .setStyle(2)
    const loopallbtn = new ButtonBuilder()
        .setCustomId('loopall')
        .setEmoji(icon(client, guild, 'loopall').id)
        .setStyle(2)

    row.addComponents(
        playbtn,
        skipbtn,
        stopbtn,
        looponebtn,
        loopallbtn
    )
    let embed = new EmbedBuilder()
        .setColor("#000000")
        .setTitle(`${language(guild, 'MUSIC_MENU')}`)
        .setDescription(queue.songs[0].duration.timestamp)
        .setFooter({ text: `${author.username}`, iconURL: `${author.displayAvatarURL()}` })
    if (queue) {
        embed.setAuthor({ name: `${language(guild, 'MUSIC_NOWPLAYING')} ${queue.songs[0].title}`, iconURL: queue.songs[0].img })
        embed.setThumbnail(queue.songs[0].img)
    }

    let msgembed = await channel.send({
        embeds: [embed],
        components: [row]
    }).then((message) => {
        message.react(icon(client, guild, 'play'))
        message.react(music.skip)
        message.react(music.stop)
        message.react(music.loopone)
        message.react(icon(client, guild, 'loopall'))
        if (!queue) {
            message.react(music.pause)
        } else {
            if (queue.connection.dispatcher.paused) {
                message.react(music.resume)
            } else {
                message.react(music.pause)
            }
        }
    })
    return
}
async function video_player(message: Message, song: any, client: any) {
    const { guild } = message;
    if (!guild) return

    const server_queue = await queue.get(guild.id);

    if (!server_queue.connection) return message.reply(`${language(guild, 'MUSIC_NOTPLAYING')}.`)
    if (!song) return server_queue.voice_channel.leave(); queue.delete(guild.id);

    /*const dispatcher = server_queue.connection.play(stream, { seek: 0, volume: 1.0 })
        .on('finish', () => {
            
            server_queue.songs.shift()
            video_player(guild, server_queue.songs[0])
        })*/
    // const stream = ytdl(song.url, { filter: 'audioonly' });
    const stream = {}
    server_queue.connection.play(stream)
        .on('finish', () => {
            if (server_queue.loopone) {
                //video_player(guild, server_queue.songs[0]);
                video_player(message, server_queue.songs[songint], client);
            } else if (server_queue.loopall) {
                video_player(message, server_queue.songs[songint], client);
                //server_queue.songs.push(server_queue.songs[songint])
                //server_queue.songs.shift()
            } else {
                //server_queue.songs.shift()
                //video_player(guild, server_queue.songs[0]);
                songint++
                video_player(message, server_queue.songs[songint], client);
                
            }
            //server_queue.songs.shift();
        });
        
    
    let embed = new EmbedBuilder()
        .setColor("#000000")
        .setTitle(`**${language(guild, 'MUSIC_NOWPLAYING')}**`)
        .setDescription(`${icon(client, guild, 'audiowave')}`)
        //.addField(`c`, `**${song.title}** (${song.duration.seconds})`, true)
        .setFooter({ text: `${song.title} (${song.duration.timestamp})` })
        .setThumbnail(song.img)
        .setURL(song.url)
    let msgembed = await server_queue.text_channel.send({ embeds: [embed] });

    return
}
const save_queue = (async (message: Message, server_queue: any) => {
    const { guild, member, author } = message
    if (!guild) return
    if (!member?.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);
    if (!server_queue.songs) {
        return message.reply(`${language(guild, 'MUSIC_NOSONGS')}.`);
    }
    let userplaylist = []
    for (let i = 0; i < server_queue.songs.length; i++) {
        userplaylist.push(server_queue.songs[i])
    }
    const guildId = guild?.id;
    const userId = author.id;

    const playlist = await playlistSchema.findOneAndUpdate(
        {
            guildId, 
            userId
        },
        {
            guildId,
            userId,
            playlist: userplaylist, 
        }, 
        {
            upsert: true,
            new: true,
        }
    )
    if (!playlist) {
        await new playlistSchema({
            guildId,
            userId,
            playlist: userplaylist
        }).save()
    }
    message.reply(`${language(guild, 'MUSIC_SAVEPLAYLIST')}`)
})

async function load_queue (message: Message, server_queue: any, client: any) {
    const { guild, member, channel, author } = message
    if (!guild) return;
    const voice_channel = member?.voice.channel;
    const guildId = guild.id
    const userId = author.id

    if (!voice_channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);
    
    let ad: any = guild.voiceAdapterCreator
    // Join Voice channel
    let connection = await joinVoiceChannel({
        channelId: voice_channel.id,
        guildId: guildId,
        adapterCreator: ad
    })
    
    const queue_constructor: any = {
        voice_channel: voice_channel,
        text_channel: channel,
        connection: connection,
        songs: [],
        playing: true,
        loopone: false,
        loopall: false
    }

    // Set quene
    queue.set(guildId, queue_constructor);


    const result = await playlistSchema.findOne({
        guildId,
        userId
    })
    
    if (!result) return message.reply(`${language(guild, 'MUSIC_NOPLAYLIST')}.`)
        
    if (server_queue) {
        server_queue.songs.forEach(async (song: any) => {
            server_queue.songs.shift()
        });

        result.playlist.forEach(async (song: any) => {
            server_queue.songs.push(song)
        });
    } else {
        songint = 0;
        result.playlist.forEach(async (song: any) => {
            queue_constructor.songs.push(song)

            if (server_queue) {
                server_queue.songs.push(song);
            }
        });

        message.reply(`${language(guild, 'MUSIC_LOADPLAYLIST')}`)
        try {
            video_player(message, queue_constructor.songs[songint], client)
        } catch (err) { 
            ErrorEmbed(message, client, command, `${language(guild, 'MUSIC_CONNECTERROR')}! ${music.cable}`);
            console.error(err)
        }
    }
    return
}
async function playlist_songs (message: Message, server_queue: any) {
    const { guild, author, channel, member } = message;
    if (!guild) return

    const guildId = guild.id
    const userId = author.id

    const result = await playlistSchema.findOne({
        guildId,
        userId
    })

    if (!result) return message.reply(`${language(guild, 'MUSIC_NOPLAYLIST')}`)
     
    let txt = ''
    result.playlist.forEach(async (song: any) => {
        txt += `- ${song.title}\n`
    });
    return message.reply(`${language(guild, 'MUSIC_PLAYLIST')}:\n**${txt}**`)
}

async function skip_song (message: Message, server_queue: any) {
    const { guild, member } = message;
    if (!guild) return
    if (!member?.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);
    if (!server_queue) return message.reply(`${language(guild, 'MUSIC_NOSONGS')}.`);
    
    server_queue.connection.dispatcher.end();
}

async function stop_song (message: Message, server_queue: any) {
    const { guild, member, author } = message;
    if (!guild) return
    if (!member?.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);
    if (!server_queue || !server_queue.connection) return server_queue.connection.destroy();
    if (server_queue.connection) return server_queue.connection.destroy();

    queue.delete(guild?.id);
    server_queue.songs = [];
    songint = 0;
    server_queue.connection.destory();
}
async function pause_song (message: Message, server_queue: any) {
    const { guild, member, author } = message;
    if (!guild) return
    if (!server_queue) server_queue = queue.get(guild.id);
    if (!member?.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);
    if (!server_queue) server_queue.connection.dispatcher.pause(true);
    if (server_queue.connection.dispatcher.paused) return message.reply(`${language(guild, 'MUSIC_ALREADYPAUSE')}.`);

    server_queue.connection.dispatcher.pause(true)
    return message.reply(`${language(guild, 'MUSIC_PAUSE')}.`)
}

async function resume_song (message: Message, server_queue: any) {
    const { guild, member } = message
    if (!guild) return
    if (!server_queue)  server_queue = queue.get(guild?.id)
    
    if (!member?.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);

    if (!server_queue.connection) return message.reply(`${language(guild, 'MUSIC_NOTPLAYING')}.`);
    if (server_queue.connection.dispatcher.resumed) return message.reply(`${language(guild, 'MUSIC_ALREADYRESUME')}.`);

    server_queue.connection.dispatcher.resume(true)
    
    message.reply(`${language(guild, 'MUSIC_RESUME')}.`)
}

const volume = (message: Message, args: any, server_queue: any) => {
    const { guild, member } = message
    if (!guild) return
    if (!member?.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);

    if (!server_queue.connection) return message.reply(`${language(guild, 'MUSIC_NOTPLAYING')}.`);

    let percent = args[1] / 100
    
    message.reply(`${language(guild, 'MUSIC_VOLUME')} ${args[1]}%`)
    server_queue.connection.dispatcher.setVolume(percent)
}
const loop_all = (message: Message, server_queue: any) => {
    const { guild, member } = message
    if (!guild) return
    if (!member?.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);
    server_queue.loopall = !server_queue.loopall;
    server_queue.loopone = false;

    if (server_queue.loopall) {
        message.reply(`${language(guild, 'MUSIC_LOOPALL')}.`)
    } else {
        message.reply(`${language(guild, 'MUSIC_LOOPSTOP')}.`)
    }
}
const loop_one = (message: Message, server_queue: any) => {
    const { guild } = message
    if (!guild) return
    if (!server_queue.connection) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);

    server_queue.loopone = !server_queue.loopone;
    server_queue.loopall = false;

    if (server_queue.loopone === true) {
        message.reply(`${language(guild, 'MUSIC_LOOPONE')}.`)
    } else {
        message.reply(`${language(guild, 'MUSIC_LOOPSTOP')}.`)
    }
}
const loop_off = (message: Message, server_queue: any) => {
    const { guild, member } = message
    if (!guild) return
    if (!member?.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);
    server_queue.loopall = false;
    server_queue.loopone = false;

    message.reply(`${language(guild, 'MUSIC_LOOPSTOP')}.`)
}

const list_songs = (message: Message, server_queue: any) => {
    const { guild, member, channel, author } = message;
    if (!guild) return
    if (!member?.voice.channel) return message.reply(`${language(guild, 'VOICE_CHANNEL')}.`);
    if (!server_queue) return message.reply(`${language(guild, 'MUSIC_NOSONGS')}.`);

    let nowPlaying = server_queue.songs[songint];
    let qMsg = `${language(guild, 'MUSIC_NOWPLAYING')} ${nowPlaying.title}\n-----------------------------------\n`

    for (let i = 1; i < server_queue.songs.length; i++) {
        qMsg += `${i}. ${server_queue.songs[i].title}\n`
    }
    
    channel.send('```' + qMsg + `Requested by: ${author.username} ` + '```');
}


