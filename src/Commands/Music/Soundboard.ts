
import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { ButtonStyle, Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, Interaction, AttachmentBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import icon from '../../Functions/icon';
import playlistSchema from '../../schemas/playlist-schema';
// import { QueryType, QueueRepeatMode } from 'discord-player';

import { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, StreamType, createAudioResource, AudioPlayerStatus, getVoiceConnection, VoiceConnectionStatus, entersState } from '@discordjs/voice';
import { join } from 'path';
export const command: Command = {
    name: "soundboard",
    description: "soundboard",
    details: "play music from a soundboard",
    aliases: [],
    hidden: true,
    disabled: false,
    UserPermissions: ["SendMessages", "CONNECT", "MANAGE_CHANNELS"],
    ClientPermissions: [
        'SPEAK', 
        'CONNECT', 
        'STREAM', 
        'SendMessages',
        'AddReactions',
        'ATTACH_FILES',
        'EmbedLinks',
        'MANAGE_MESSAGES',
        'READ_MESSAGE_HISTORY',
        'ViewChannel'
    ],
    ownerOnly: false,
    examples: ["soundboard"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions } = message;

        if (!guild) return

        if (!member?.voice.channel) return

        let adapterCreator: any = member.voice.channel.guild.voiceAdapterCreator
        const connection = joinVoiceChannel({ 
            channelId: member.voice.channel.id,
            guildId: member.voice.channel.guildId,
            adapterCreator: adapterCreator,
            selfDeaf: false,
            selfMute: false,
        })



        const player = createAudioPlayer()

        
        

        // const resource = createAudioResource('/src/skyrim.mp3', {
        //     metadata: {
        //         title: 'A good song!',
        //     },
        // });
        
        // player.play(resource);
        
        // player.on("subscribe", error => {
        //     console.log("SUBSCRIBE", error.player);
        // });
        // player.on("error", error => {
        //     console.error(error);
        // });
        
        // player.on(AudioPlayerStatus.Idle, () => {
        //     console.log('Player is IDLE')
        // });

        // connection.subscribe(player)
        // connection.on(VoiceConnectionStatus.Ready, () => {
        //     console.log('The connection has entered the Ready state - ready to play audio!');
        // });

        // let resource = createAudioResource(join(__dirname, 'skyrim.mp3'));

        
        // console.log(join(__dirname, 'skyrim.mp3'))
        // // Will use FFmpeg with volume control enabled
        // resource = createAudioResource(join(__dirname, 'skyrim.mp3'), { inlineVolume: true });
        // resource.volume?.setVolume(1)
        
        // await player.play(resource);
        // try {
        //     await entersState(player, AudioPlayerStatus.Playing, 5_000);
        //     // The player has entered the Playing state within 5 seconds
        //     console.log('Playback has started!');
        // } catch (error) {
        //     // The player has not entered the Playing state and either:
        //     // 1) The 'error' event has been emitted and should be handled
        //     // 2) 5 seconds have passed
        //     console.error(error);
        // }

        // player.on(AudioPlayerStatus.Playing, (oldState, newState) => {
        //     console.log('Audio player is in the Playing state!');
        // });
        // connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
        //     try {
        //         await Promise.race([
        //             entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
        //             entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
        //         ]);
        //         // Seems to be reconnecting to a new channel - ignore disconnect
        //     } catch (error) {
        //         // Seems to be a real disconnect which SHOULDN'T be recovered from
        //         console.log('destroy connection');
        //         connection.destroy();
        //     }
        // });
    }
}
